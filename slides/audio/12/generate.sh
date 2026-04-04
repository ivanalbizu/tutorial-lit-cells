#!/usr/bin/env bash
set -euo pipefail

VOICE="es-ES-AlvaroNeural"
EDGE_TTS="${HOME}/.local/share/pipx/venvs/edge-tts/bin/edge-tts"

# Fallback: buscar edge-tts en PATH si no existe en la ruta de pipx
if [[ ! -x "$EDGE_TTS" ]]; then
  EDGE_TTS="$(command -v edge-tts 2>/dev/null || true)"
fi

if [[ -z "$EDGE_TTS" || ! -x "$EDGE_TTS" ]]; then
  echo "ERROR: edge-tts no encontrado. Instálalo con: pipx install edge-tts" >&2
  exit 1
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

tts() {
  local file="$1"
  local text="$2"
  echo "Generando: $file"
  "$EDGE_TTS" --voice "$VOICE" --text "$text" --write-media "$DIR/$file"
}

# 00 — Intro
tts "00-intro.mp3" \
  "Open Cells es un framework de micro-frontends construido sobre Web Components. En este video crearemos una aplicación desde cero y entenderemos cómo funciona su sistema de routing, lazy loading y gestión de páginas."

# 01 — Qué es Open Cells
tts "01-escena.mp3" \
  "Open Cells se encarga de cuatro cosas principales. Primero, el routing: usa hash en la URL para saber qué página mostrar. Segundo, la orquestación de páginas: gestiona qué páginas están activas, cuáles están en caché y cuáles están inactivas. Tercero, el estado compartido mediante canales: permite que componentes de distintas páginas se comuniquen sin depender directamente unos de otros. Y cuarto, el lazy loading: las páginas se cargan bajo demanda, solo cuando el usuario navega hacia ellas por primera vez. Cada página es un web component independiente. Open Cells no sabe nada de ningún otro framework."

# 02 — Estructura
tts "02-escena.mp3" \
  "Esta es la estructura que vamos a construir. La raíz tiene el HTML de entrada, la configuración de TypeScript, la de Vite y el package.json. Dentro de src, separamos claramente: components para los componentes globales, router para las rutas, péiches con una carpeta por página, y css para los estilos globales."

# 03 — package.json
tts "03-escena.mp3" \
  "Las dependencias de producción son tres: open-cells-core, que es el núcleo del framework con el router y el sistema de canales; open-cells-peich Contróuler, que es el Reactive Contróuler que usaremos en las páginas para reaccionar a la navegación; y lit."

# 04 — index.html
tts "04-escena.mp3" \
  "El HTML es muy sencillo. Lo más importante es el div con id app-content. Este es el main Node: el contenedor donde Open Cells montará y desmontará las páginas. El ID debe coincidir exactamente con lo que le pasemos a start App. Por convención se usa app-content."

# 05 — CSS obligatorio
tts "05-escena.mp3" \
  "Este CSS es obligatorio y es uno de los errores más comunes al empezar con Open Cells. Open Cells gestiona las páginas añadiendo un atributo state a cada una. Las páginas pueden tener tres estados: active para la página visible, cached para páginas que se mantienen en el DOM pero no se ven, e inactive para páginas que han pasado el límite de caché y se eliminan del DOM. El problema es que Open Cells no incluye el CSS para ocultar las páginas inactivas. Eso lo tienes que poner tú. Si te olvidas de esta regla, todas las páginas se mostrarán apiladas al mismo tiempo."

# 05b — El atributo state
tts "05b-escena.mp3" \
  "El atributo state tiene tres valores posibles. Active para la página visible actualmente. Kéicht para páginas visitadas que están en el DOM pero ocultas. E inéiktiv para páginas que ya no caben en el límite: salen del DOM hasta que el usuario las vuelva a visitar. Open Cells no incluye el CSS para ocultar páginas. Si lo omites, todas las páginas se apilan visibles al mismo tiempo."

# 06 — Rutas
tts "06-escena.mp3" \
  "Cada ruta tiene cuatro campos. path es el fragmento de URL, sin el signo de almohadilla porque Open Cells lo gestiona internamente. name es el identificador que usaremos en el código para navegar. component es el nombre del custom element que se insertará en el DOM. Y action es una función que devuelve un import dinámico: esto es lo que habilita el lazy loading."

# 06b — Campos de la ruta
tts "06b-escena.mp3" \
  "El import dinámico solo se ejecuta la primera vez que el usuario navega a esa ruta. El módulo se descarga bajo demanda, no al arrancar la aplicación. El nombre del custom element en component debe coincidir con el argumento de custom Element en la clase."

# 07 — start App
tts "07-escena.mp3" \
  "Este es el archivo de arranque de toda la aplicación. Solo necesita dos líneas. start App es la función de bootstrap de Open Cells. Recibe routes, que es el array de rutas que acabamos de definir, y main Node, que es el ID del contenedor donde se montarán las páginas. Con esto Open Cells está activo. Escucha los cambios de hash en la URL y carga el componente correspondiente."

# 08 — Páginas
tts "08-escena.mp3" \
  "Las páginas son componentes Lit normales y corrientes. No hay ninguna clase base especial que deban extender. Lo importante es que el nombre del custom element, lo que se pasa a custom Element, coincida con el campo component de la ruta."

# 08b — Navegación hash
tts "08b-escena.mp3" \
  "Para navegar usamos enlaces con href apuntando al hash. Open Cells intercepta estos clics automáticamente. Para navegar programáticamente usamos la función návikeit importada desde open-cells-core, o el método návikeit del Peiych Contróuler dentro de una página."

# 09 — viewLimit
tts "09-escena.mp3" \
  "viu Límit controla cuántas páginas se mantienen en el DOM. Por defecto son tres. Cuando se supera ese número, las páginas más antiguas pasan a inéiktiv y salen del DOM hasta que el usuario las vuelva a visitar. persistent Péiches excluye páginas de ese conteo: se mantienen en el DOM con state kéicht indefinidamente."

# 99 — Resumen
tts "99-resumen.mp3" \
  "Para resumir: Open Cells gestiona routing con hash, orquestación de páginas, estado compartido y lazy loading. start App con routes y main Node arranca la aplicación. Las rutas tienen path, name, component y action con import dinámico. Las páginas son web components normales cuyo nombre coincide con component en la ruta. El CSS para ocultar páginas inactivas es obligatorio. Y viu Límit controla cuántas páginas se mantienen en el DOM."

echo "Audio generado correctamente en $DIR"
