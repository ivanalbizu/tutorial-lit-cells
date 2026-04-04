#!/usr/bin/env bash
set -euo pipefail

VOICE="es-ES-AlvaroNeural"
EDGE_TTS="${HOME}/.local/share/pipx/venvs/edge-tts/bin/edge-tts"

if [[ ! -x "$EDGE_TTS" ]]; then
  EDGE_TTS="$(command -v edge-tts 2>/dev/null || true)"
fi

if [[ -z "$EDGE_TTS" ]]; then
  echo "Error: edge-tts no encontrado. Instala con: pipx install edge-tts" >&2
  exit 1
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

speak() {
  local file="$1"
  local text="$2"
  echo "Generando: $file"
  "$EDGE_TTS" --voice "$VOICE" --text "$text" --write-media "$DIR/$file"
}

speak "00-intro.mp3" \
  "En este video vamos a ver los slots, que son el mecanismo de composición de los Web Components. Los slots permiten que el contenido definido fuera del componente se proyecte dentro de su template, sin que el componente necesite saber qué es ese contenido. Es la base de los componentes contenedor, como acordeones, tarjetas, modales o layouts."

speak "01-default-slot.mp3" \
  "El slot por defecto se escribe simplemente como un elemento slot vacío. Todo lo que el usuario coloque entre las etiquetas de apertura y cierre del componente se proyectará en ese punto. En este caso, el contenido del acordeón puede ser cualquier HTML: párrafos, listas, imágenes, incluso otros componentes. El componente my-accordion-item no necesita saber qué se le pasa; simplemente lo muestra u oculta según el estado."

speak "01b-default-slot.mp3" \
  "Todo lo que el usuario coloca entre las etiquetas del componente se proyecta en el punto donde está el slot. El componente no necesita saber qué se le pasa: párrafos, listas, imágenes, otros componentes, todo vale. Los slots son nativos de la plataforma web, no una invención de Lit. Lit simplemente los usa como corresponde."

speak "02-fallback.mp3" \
  "Puedes poner contenido dentro del elemento slot. Ese contenido es el fólbak: se muestra únicamente si el usuario no proyecta nada en ese slot. En el momento en que el usuario añade contenido, el fólbak desaparece y se muestra el contenido proyectado. Es una forma elegante de proporcionar un estado vacío por defecto sin necesitar lógica adicional."

speak "03-named-slots.mp3" \
  "Los neimd slots o slots con nombre permiten proyectar contenido en posiciones específicas del template. Se definen con el atributo name en el slot. Para proyectar contenido en un slot con nombre, el elemento que el usuario añade debe tener el atributo slot con el mismo nombre. El slot sin nombre sigue siendo el slot por defecto y recoge todo lo que no tiene atributo slot."

speak "03b-named-slots.mp3" \
  "Cada elemento de la vista indica su posición mediante un atributo. La barra de navegación se declara como cabecera. La lista, como barra lateral. El artículo no lleva esa declaración, así que va al hueco principal, el predeterminado. Y el párrafo de los derechos va al pie de página. El orden de escritura no afecta al resultado: el navegador coloca cada elemento exactamente donde le corresponde, independientemente de su posición en el código."

speak "04-slotchange.mp3" \
  "El evento slot cheinch se dispara cuando el contenido proyectado en un slot cambia: cuando se añaden o eliminan elementos. Puedes escucharlo con la sintaxis habitual de eventos de Lit. Dentro del handler, slot.asáind Noudz te devuelve los nodos que están actualmente proyectados. La opción flatten igual a true aplana los slots anidados. Esto es útil para contar los ítems de un acordeón o para validar que se ha proyectado el contenido obligatorio."

speak "04b-flatten.mp3" \
  "Imagina que tienes dos componentes con hueco, y uno se proyecta dentro del otro. El componente exterior recibe en su hueco a otro componente que, a su vez, tiene su propio hueco con el contenido real dentro. Sin la opción flatten, asáind Noudz te devuelve el componente intermedio: ves el contenedor, no lo que hay dentro. Con flatten igual a true, la función resuelve todos los niveles y te devuelve directamente el contenido final. En la práctica esto es poco frecuente, pero es muy útil cuando compones componentes que se anidan en varios niveles."

speak "05-slotted.mp3" \
  "Con ::slotted aplicamos estilos al contenido proyectado. Recuerda la limitación: solo afecta a los hijos directos del slot, no a sus descendientes. Así que ::slotted(p) estilizará un párrafo proyectado directamente, pero no un párrafo dentro de un div proyectado. Para estilos más profundos, la solución habitual son las CSS custom properties que el usuario puede configurar desde fuera."

speak "06-patron.mp3" \
  "Los slots son la base del patrón de componentes contenedor. El componente define la estructura: la barra de título del acordeón, el botón de apertura, la animación de expansión. El usuario decide el contenido: párrafos, listas, imágenes, lo que necesite. El componente es reutilizable en cualquier contexto porque no está acoplado a un contenido concreto."

speak "06b-patron.mp3" \
  "El principio fundamental del patrón de composición es que el componente define la estructura y el comportamiento, mientras el usuario decide el contenido. Componentes que siguen este patrón incluyen acordeones, tarjetas, modales, layouts, tabs y tooltips. Máxima reutilización con mínimo acoplamiento."

speak "99-resumen.mp3" \
  "Los slots son el mecanismo de composición nativo de la plataforma web. El slot por defecto recoge cualquier contenido que el usuario coloque dentro del componente. Los neimd slots te permiten dirigir cada elemento a una posición concreta del template. El contenido de reserva se muestra cuando no se proyecta nada. Y el evento slot cheinch te avisa cada vez que el contenido proyectado cambia."

echo "Audio del video 09 generado correctamente."
