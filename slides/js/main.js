import Reveal from 'reveal.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';

// Plugin de audio por slide
const AudioSlide = {
  id: 'audio-slide',

  init(reveal) {
    let currentAudio = null;
    let audioEnabled = true;

    // Crear panel de audio
    const panel = document.createElement('div');
    panel.className = 'audio-panel';
    panel.innerHTML = `
      <button class="audio-btn" title="Clic para iniciar audio">▶</button>
      <div class="audio-progress-bar">
        <div class="audio-progress-fill"></div>
      </div>
      <span class="audio-time">0:00</span>
      <div class="nav-hint"></div>
    `;
    document.body.appendChild(panel);

    const btn = panel.querySelector('.audio-btn');
    const progressBar = panel.querySelector('.audio-progress-bar');
    const progressFill = panel.querySelector('.audio-progress-fill');
    const timeDisplay = panel.querySelector('.audio-time');
    const navHint = panel.querySelector('.nav-hint');

    let animFrame = null;
    let started = false;
    let timedFragments = [];
    let shownFragments = new Set();
    // Map: codeEl → { steps: [{time, lines}], currentIndex }
    let highlightBlocks = new Map();

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // ── Timed fragments ──

    function collectTimedFragments(slide) {
      timedFragments = [];
      shownFragments = new Set();
      const fragments = slide.querySelectorAll('[data-fragment-time]');
      fragments.forEach((el) => {
        const time = parseFloat(el.dataset.fragmentTime);
        if (!isNaN(time)) {
          timedFragments.push({ el, time });
          el.classList.remove('visible');
          el.classList.add('fragment');
        }
      });
      timedFragments.sort((a, b) => a.time - b.time);
    }

    function checkTimedFragments(currentTime) {
      timedFragments.forEach(({ el, time }, i) => {
        if (currentTime >= time && !shownFragments.has(i)) {
          shownFragments.add(i);
          el.classList.add('visible');
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        }
      });
    }

    // ── Timed line highlights ──

    function collectHighlightSteps(slide) {
      highlightBlocks = new Map();
      slide.querySelectorAll('[data-highlight-steps]').forEach((codeEl) => {
        try {
          const steps = JSON.parse(codeEl.dataset.highlightSteps);
          const sorted = steps
            .map((s) => ({ time: s.time, lines: s.lines }))
            .sort((a, b) => a.time - b.time);
          highlightBlocks.set(codeEl, { steps: sorted, currentIndex: -1 });
          applyLineHighlight(codeEl, 'dim');
        } catch (e) {
          console.warn('Error parseando data-highlight-steps:', e);
        }
      });
    }

    function parseLineSpec(lineSpec) {
      const highlighted = new Set();
      if (!lineSpec) return highlighted;
      lineSpec.split(',').forEach((part) => {
        part = part.trim();
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start; i <= end; i++) highlighted.add(i);
        } else if (part) {
          highlighted.add(parseInt(part));
        }
      });
      return highlighted;
    }

    function applyLineHighlight(codeEl, lineSpec) {
      // "dim" = oscurecer todo sin resaltar nada (estado inicial)
      // ""    = limpiar, volver a opacidad normal
      // "1-3" = resaltar esas líneas, oscurecer el resto
      const dimAll = lineSpec === 'dim';
      const highlighted = dimAll ? new Set() : parseLineSpec(lineSpec);

      function applyToRow(el, lineNum) {
        el.classList.remove('highlight-line');
        if (dimAll) {
          el.style.opacity = '0.35';
        } else if (!lineSpec) {
          el.style.opacity = '';
        } else if (highlighted.has(lineNum)) {
          el.classList.add('highlight-line');
          el.style.opacity = '1';
        } else {
          el.style.opacity = '0.35';
        }
      }

      const table = codeEl.closest('pre')?.querySelector('table');
      if (table) {
        table.querySelectorAll('tr').forEach((tr) => {
          const lineNumTd = tr.querySelector('[data-line-number]');
          if (!lineNumTd) return;
          applyToRow(tr, parseInt(lineNumTd.dataset.lineNumber));
        });
        return;
      }

      codeEl.querySelectorAll('[data-line-number]').forEach((el) => {
        applyToRow(el, parseInt(el.dataset.lineNumber));
      });
    }

    function checkHighlightSteps(currentTime) {
      highlightBlocks.forEach((block, codeEl) => {
        let targetIndex = -1;
        for (let i = block.steps.length - 1; i >= 0; i--) {
          if (currentTime >= block.steps[i].time) {
            targetIndex = i;
            break;
          }
        }
        if (targetIndex !== block.currentIndex) {
          block.currentIndex = targetIndex;
          applyLineHighlight(codeEl, targetIndex >= 0 ? block.steps[targetIndex].lines : 'dim');
        }
      });
    }

    // ── Progress update (audio loop) ──

    function updateProgress() {
      if (!currentAudio) return;
      const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressFill.style.width = `${pct}%`;
      const elapsed = formatTime(currentAudio.currentTime);
      const total = formatTime(currentAudio.duration);
      timeDisplay.textContent = `${elapsed} / ${total}`;
      checkTimedFragments(currentAudio.currentTime);
      checkHighlightSteps(currentAudio.currentTime);
      animFrame = requestAnimationFrame(updateProgress);
    }

    function updateNavHint(slide) {
      const parent = slide.parentElement;
      const isVerticalStack = parent && parent.classList.contains('stack');
      const siblings = isVerticalStack ? parent.querySelectorAll(':scope > section') : [];
      const currentIndex = Array.from(siblings).indexOf(slide);
      const hasMore = currentIndex < siblings.length - 1;

      if (isVerticalStack && hasMore) {
        navHint.textContent = '↓ siguiente paso';
        navHint.className = 'nav-hint vertical';
      } else {
        navHint.textContent = '→ siguiente slide';
        navHint.className = 'nav-hint horizontal';
      }
    }

    // Click en barra de progreso para seek
    progressBar.addEventListener('click', (e) => {
      if (!currentAudio || !currentAudio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      currentAudio.currentTime = pct * currentAudio.duration;
      // Recalcular fragments y highlights tras seek
      shownFragments = new Set();
      timedFragments.forEach(({ el }) => el.classList.remove('visible'));
      highlightBlocks.forEach((block, codeEl) => {
        block.currentIndex = -1;
        applyLineHighlight(codeEl, 'dim');
      });
      checkTimedFragments(currentAudio.currentTime);
      checkHighlightSteps(currentAudio.currentTime);
    });

    btn.addEventListener('click', () => {
      if (!started) {
        started = true;
        audioEnabled = true;
        btn.textContent = '♪';
        playSlideAudio(reveal.getCurrentSlide());
        return;
      }

      if (currentAudio) {
        if (currentAudio.paused) {
          currentAudio.play();
          btn.textContent = '♪';
          panel.classList.add('playing');
        } else {
          currentAudio.pause();
          btn.textContent = '❚❚';
          panel.classList.remove('playing');
        }
      } else {
        // Audio terminado — replay desde el principio
        panel.classList.remove('ended');
        playSlideAudio(reveal.getCurrentSlide());
      }
    });

    function playSlideAudio(slide) {
      // Parar audio anterior
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
        panel.classList.remove('playing');
        if (animFrame) cancelAnimationFrame(animFrame);
      }

      progressFill.style.width = '0%';
      timeDisplay.textContent = '';

      updateNavHint(slide);
      collectTimedFragments(slide);
      collectHighlightSteps(slide);

      let audioSrc = slide.dataset.audio;
      if (!audioSrc || !audioEnabled || !started) return;

      currentAudio = new Audio(audioSrc);
      currentAudio.volume = 1.0;

      currentAudio.addEventListener('loadedmetadata', () => {
        timeDisplay.textContent = `0:00 / ${formatTime(currentAudio.duration)}`;
      });

      currentAudio.addEventListener('play', () => {
        btn.textContent = '♪';
        panel.classList.add('playing');
        updateProgress();
      });

      currentAudio.addEventListener('ended', () => {
        panel.classList.remove('playing');
        panel.classList.add('ended');
        progressFill.style.width = '100%';
        btn.textContent = '✓';
        if (animFrame) cancelAnimationFrame(animFrame);
        currentAudio = null;

        setTimeout(() => {
          panel.classList.remove('ended');
          btn.textContent = '♪';
        }, 2000);
      });

      currentAudio.addEventListener('error', () => {
        panel.classList.remove('playing');
        btn.textContent = '✕';
        timeDisplay.textContent = '';
        console.warn(`Audio no encontrado: ${audioSrc}`);
      });

      setTimeout(() => {
        if (currentAudio) {
          currentAudio.play().catch(() => {
            btn.textContent = '▶';
            btn.title = 'Clic para iniciar audio';
          });
        }
      }, 300);
    }

    function fixDownArrow(slide) {
      const parent = slide.parentElement;
      const isVerticalStack = parent && parent.classList.contains('stack');
      let hasMore = false;
      if (isVerticalStack) {
        const siblings = parent.querySelectorAll(':scope > section');
        const idx = Array.from(siblings).indexOf(slide);
        hasMore = idx < siblings.length - 1;
      }
      if (!hasMore) {
        const downBtn = document.querySelector('.reveal .controls .navigate-down');
        if (downBtn) downBtn.classList.remove('enabled');
      }
    }

    reveal.on('slidechanged', (event) => {
      playSlideAudio(event.currentSlide);
      // Corregir flecha ↓ después de que Reveal.js la haya activado
      requestAnimationFrame(() => fixDownArrow(event.currentSlide));
    });

    reveal.on('ready', () => {
      updateNavHint(reveal.getCurrentSlide());
      requestAnimationFrame(() => fixDownArrow(reveal.getCurrentSlide()));
    });

    // ── Helpers de calibración ──

    function dumpLineMap() {
      const slide = reveal.getCurrentSlide();
      const codeEl = slide.querySelector('[data-highlight-steps]');
      if (!codeEl) { console.log('[LINEMAP] Esta slide no tiene data-highlight-steps'); return; }
      const table = codeEl.closest('pre')?.querySelector('table');
      if (!table) { console.log('[LINEMAP] No se encontró tabla de líneas'); return; }
      const trs = table.querySelectorAll('tr');
      console.group('[LINEMAP] Mapa línea → contenido');
      trs.forEach((tr) => {
        const lineNumTd = tr.querySelector('[data-line-number]');
        const codeTd = tr.querySelector('.hljs-ln-code');
        if (!lineNumTd) return;
        const lineNum = lineNumTd.dataset.lineNumber;
        const text = codeTd ? codeTd.textContent.trimEnd() : '';
        console.log(`  ${String(lineNum).padStart(2)}: ${text}`);
      });
      console.groupEnd();
    }

    function markTime() {
      if (!currentAudio) { console.log('[MARK] Sin audio activo'); return; }
      console.log(`[MARK] t = ${currentAudio.currentTime.toFixed(2)}s`);
    }

    // Atajos de teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        if (currentAudio) {
          currentAudio.muted = !currentAudio.muted;
          btn.textContent = currentAudio.muted ? '✕' : '♪';
        }
      }
      if (e.shiftKey && e.key === 'D') dumpLineMap();
      if (e.shiftKey && e.key === 'M') markTime();
    });
  }
};

// Inicializar Reveal.js
Reveal.initialize({
  hash: true,
  slideNumber: true,
  progress: true,
  center: false,
  transition: 'slide',
  width: 1280,
  height: 700,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 1.5,

  highlight: {
    highlightOnLoad: true,
  },

  plugins: [Highlight, AudioSlide],
});
