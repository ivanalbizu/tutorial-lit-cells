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
  "En este video vamos a ver cómo funciona el sistema de estilos de Lit. Gracias al Shadow DOM, los estilos de un componente están completamente encapsulados: no se filtran al exterior ni pueden ser sobrescritos por estilos globales. Pero también veremos las herramientas que Lit nos da para crear una API pública de estilos cuando queremos que el exterior pueda personalizar nuestro componente."

speak "01-static-styles.mp3" \
  "static styles es la forma correcta de definir estilos en Lit. Usamos el tagged template css que importamos desde el paquete lit. Estos estilos se inyectan en el Shadow DOM del componente, lo que significa que la clase .card solo existe dentro de este componente. Si en tu página global tienes otra clase .card, no habrá ningún conflicto."

speak "01b-static-styles.mp3" \
  "Los estilos viven dentro del Shadow DOM y están completamente aislados. La clase .card solo existe dentro de este componente. Si tienes otra clase .card en estilos globales de la página, no habrá ningún conflicto. Usa siempre el tagged template css importado desde lit para aprovechar la optimización de deduplicación."

speak "02-array-estilos.mp3" \
  "static styles también acepta un array. Esto es útil para compartir estilos base entre varios componentes: defines el CSS en un archivo separado con el tagged template css y lo importas donde lo necesites. Cada componente sigue teniendo sus estilos encapsulados, pero reutilizas las reglas comunes sin duplicar código."

speak "02b-array-estilos.mp3" \
  "Al usar un array de estilos, el primero en la lista son los estilos base compartidos y el segundo son los estilos propios del componente. Cada componente sigue teniendo su encapsulación completa. Los estilos base se reutilizan sin duplicar código y sin contaminar el scope global."

speak "03-host.mp3" \
  "El selector :host apunta al propio elemento, es decir, al my-card en sí. Con :host entre paréntesis con el atributo variant igual a primary podemos aplicar estilos cuando el elemento tiene ese atributo. Para que esto funcione, la propiedad debe tener reflect igual a true, que hace que Lit sincronice el valor de la propiedad como atributo en el HTML."

speak "03b-host.mp3" \
  "reflect igual a true sincroniza el valor de la propiedad TypeScript como atributo HTML del elemento. Sin reflect, el atributo variant no existe en el DOM y el selector :host con el atributo nunca coincide. También puedes usar pseudoclases del host, como :host hover, para reaccionar al estado del elemento contenedor."

speak "04-slotted.mp3" \
  "::slotted es un selector especial que permite estilizar el contenido proyectado en un slot, es decir, el HTML que el usuario del componente pone dentro. Tiene una limitación importante: solo funciona con hijos directos, no con descendientes más profundos."

speak "04b-slotted.mp3" \
  "Si proyectas un div que contiene un párrafo, el selector ::slotted(p) no llegará hasta ese párrafo interno. Solo afecta a los hijos directos del slot. Para estilos más profundos, la solución habitual son las CSS custom properties que el usuario puede configurar desde fuera."

speak "05-part.mp3" \
  "El atributo part expone un elemento interno para que pueda ser estilizado desde fuera con el selector ::part. Es la forma oficial y controlada de romper la encapsulación solo donde tú quieres. El autor del componente decide qué partes son públicas y las nombra. El usuario del componente puede personalizarlas sin romper la estructura interna."

speak "05b-part.mp3" \
  "Desde fuera del componente, el usuario puede estilizar las partes expuestas con la sintaxis my-card seguido de ::part y el nombre de la parte entre paréntesis. El autor del componente decide qué partes son públicas. El usuario las personaliza sin acceder a los internos del Shadow DOM."

speak "06-custom-props.mp3" \
  "Las CSS custom properties, también llamadas variables CSS, atraviesan el Shadow DOM de forma nativa. Son la API de theming más potente y limpia para Web Components. El autor del componente define las variables con valores por defecto usando var seguido del nombre de la variable y el valor por defecto."

speak "06b-custom-props.mp3" \
  "El usuario del componente simplemente asigna esas variables en un ancestro CSS y los estilos internos se actualizan automáticamente. No necesita saber nada del interior del Shadow DOM. Las variables CSS traversan la barrera del Shadow DOM de forma nativa, lo que las convierte en la herramienta de theming más elegante disponible."

speak "99-resumen.mp3" \
  "El sistema de estilos de Lit te da encapsulación por defecto y herramientas precisas para decidir cuándo y cómo abrir esa encapsulación. Con :host controlas el elemento contenedor, con ::slotted llegas al contenido proyectado, con ::part expones internos de forma controlada, y con custom properties creas una API de theming que funciona de forma nativa en el navegador."

echo "Audio del video 07 generado correctamente."
