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
  "En este video aprenderás tres patrones para integrar componentes Lit dentro de una aplicación Open Cells: componentes persistentes fuera del router, componentes reutilizables dentro de páginas, y el uso de Peiych Contróuler para reaccionar a la navegación."

# 01 — Tres roles
tts "01-escena.mp3" \
  "En una aplicación Open Cells hay tres roles que puede jugar un componente Lit. El primero es el componente persistente: vive fuera del contenedor main Node, directamente en el HTML. Open Cells no lo toca nunca. Un ejemplo típico es la cabecera o el menú de navegación. El segundo es el componente reutilizable: es Lit puro, sin ninguna dependencia de Open Cells. Se usa dentro de las páginas como cualquier otro componente. El tercero es la página en sí: vive dentro del main Node, Open Cells gestiona su ciclo de vida, y puede usar Peiych Contróuler para saber cuándo entra y cuándo sale de pantalla."

# 02 — app-header
tts "02-escena.mp3" \
  "El componente app-header importa návikeit directamente desde open-cells-core. Esta función acepta el nombre de la ruta, el mismo que definimos en el campo name de nuestras rutas."

# 02b — Por qué návikeit y no Peiych Contróuler
tts "02b-escena.mp3" \
  "¿Por qué návikeit global y no Peiych Contróuler? Porque este componente no es una página. No vive dentro del main Node y Open Cells no gestiona su ciclo de vida. No tiene acceso a Peiych Contróuler. Para estos casos, la función návikeit importada directamente es la solución correcta."

# 03 — index.html actualizado
tts "03-escena.mp3" \
  "app-header se coloca antes del div app-content en el HTML. Está completamente fuera del área gestionada por Open Cells. Cuando el router cambia de página, la cabecera no se ve afectada en absoluto. Lo importamos en app-index para que se registre el custom element antes de que el navegador intente renderizarlo."

# 04 — feature-card
tts "04-escena.mp3" \
  "feature-card es Lit puro. No importa nada de Open Cells. No sabe que vive en una aplicación Cells. Podría usarse en cualquier proyecto web. Este es el patrón que debes seguir para tus componentes de interfaz: mantenerlos agnósticos del framework de routing. Solo los componentes que necesiten navegar o reaccionar a la navegación deben conocer Open Cells."

# 05 — Peiych Contróuler
tts "05-escena.mp3" \
  "Peiych Contróuler es un Reactive Contróuler de Open Cells. Se instancia igual que cualquier controller: pasando this en el constructor, y se registra automáticamente con add Contróuler. Proporciona dos callbacks: on Page Enter y on Page Leave."

# 05b — on Page Enter y on Page Leave
tts "05b-escena.mp3" \
  "on Page Enter se ejecuta cada vez que esta página se convierte en la activa. Es el lugar para arrancar timers, suscribirse a datos, o hacer un fetch al entrar. on Page Leave se ejecuta cuando el usuario navega a otra página. Aquí puedes limpiar recursos, cancelar peticiones o guardar el estado del formulario. La página no se destruye al salir: solo se oculta con state igual a kéicht. Por eso on Page Leave es importante: el componente sigue vivo en el DOM."

# 06 — Render con feature-card y navegación
tts "06-escena.mp3" \
  "El render de la página usa el componente feature-card tres veces, pasando título, descripción e icono por propiedades. Debajo hay un div que muestra el log de navegación: cada entrada que añadimos en on Page Enter y on Page Leave aparece aquí. Por último, un botón llama a this.peiych Contróuler.návikeit con el nombre de la ruta para navegar programáticamente."

# 06b — návikeit global vs peiych Contróuler.návikeit
tts "06b-escena.mp3" \
  "Una aclaración importante: hay dos formas de navegar en Open Cells. La primera es la función návikeit importada desde open-cells-core. La usas en componentes que no son páginas, como el app-header. La segunda es this.peiych Contróuler.návikeit, disponible en componentes que tienen Peiych Contróuler instanciado. Ambas hacen lo mismo internamente, pero usar el método del controller en las páginas es más explícito y mantiene la dependencia de Open Cells centralizada en el controller. El argumento es siempre el name de la ruta, no el path."

# 07 — Agregar ruta demo
tts "07-escena.mp3" \
  "Al navegar a la página demo, vemos en el log que la página entró. Al ir a otra página y volver, vemos que la página salió y luego entró de nuevo. El log se acumula porque la página no se destruye entre navegaciones, solo se oculta. También comprobamos que app-header sigue visible en todo momento, independientemente de la página activa."

# 99 — Resumen
tts "99-resumen.mp3" \
  "Para resumir: los componentes persistentes viven fuera del main Node y usan návikeit importado desde open-cells-core. Los componentes reutilizables son Lit puro, sin dependencias de Open Cells. Peiych Contróuler es un Reactive Contróuler que provee on Page Enter y on Page Leave. on Page Enter se llama cada vez que la página se activa, on Page Leave cuando se desactiva. Las páginas no se destruyen al navegar: se ocultan con state igual a kéicht. Por eso on Page Leave es el lugar para limpiar recursos. Y this.peiych Contróuler.návikeit con el nombre de la ruta navega programáticamente desde una página."

echo "Audio generado correctamente en $DIR"
