#!/usr/bin/env bash
# Genera los audios para el video 16 — Proyecto final
# Voz: es-ES-AlvaroNeural (edge-tts)

set -e

EDGE_TTS="${HOME}/.local/share/pipx/venvs/edge-tts/bin/edge-tts"
if [ ! -x "$EDGE_TTS" ]; then
  EDGE_TTS="edge-tts"
fi

VOICE="es-ES-AlvaroNeural"
DIR="$(cd "$(dirname "$0")" && pwd)"

speak() {
  local file="$1"
  local text="$2"
  echo "Generando $file..."
  "$EDGE_TTS" --voice "$VOICE" --text "$text" --write-media "$DIR/$file"
}

speak "00-intro.mp3" "En este video integramos todos los conceptos del tutorial en una aplicación cohesiva. Vamos a ver cómo el Cart Contróuler actúa como puente entre los Reactive Controllers de Lit y el sistema de Channels de Open Cells. También veremos directivas, slots de layout, y el decorador kueri trabajando juntos en páginas reales."

speak "01-escena.mp3" "El concepto más importante de este video es usar un Reactive Contróuler como puente entre Lit y Cells. El contróuler se engancha al ciclo de vida del host con host Connected y host Disconnected. En host Connected se suscribe al canal. En host Disconnected cancela la suscripción. Cuando llegan datos del canal, llama a rikuést Update para que el componente host se re-renderice."

speak "01b-escena.mp3" "El Cart Contróuler implementa la interfaz Reactive Contróuler de Lit. En el constructor recibe el host y lo registra con add Contróuler. Así Lit sabe que debe llamar a host Connected y host Disconnected en los momentos correctos del ciclo de vida."

speak "01c-escena.mp3" "En host Connected nos suscribimos al canal. En el callback actualizamos items y llamamos a rikuést Update para desencadenar el re-render del host. En host Disconnected cancelamos la suscripción. Cualquier componente que instancie el contróuler queda sincronizado con el estado global automáticamente."

speak "01d-escena.mp3" "Los métodos add, remove y clear siempre publican el nuevo estado en el canal. No modifican items directamente. La actualización de items llega siempre a través del canal, lo que garantiza que todos los suscriptores estén sincronizados. Los getters total, count e isEmpty son propiedades calculadas."

speak "02-escena.mp3" "El header instancia dos contróulers: Peiych Contróuler para la navegación y Cart Contróuler para el estado del carrito. Los enlaces del menú usan peiych Contróuler punto návikeit para cambiar de página. El badch aparece de forma condicional: solo cuando cart.count es mayor que cero. Cada vez que el canal actualiza el carrito, el Cart Contróuler llama rikuést Update y el header se re-renderiza automáticamente."

speak "03-escena.mp3" "El page-layout es un componente de presentación puro que organiza la estructura visual usando slots. Tiene un slot sin nombre para el contenido principal, un slot subtitle para información contextual en la cabecera, y un slot footer para el pie de página."

speak "03b-escena.mp3" "Las páginas que usen el layout solo tienen que pasar contenido a los slots correctos. El slot sin nombre recibe el contenido principal. El slot subtitle muestra información contextual. El slot footer va al pie de página. El layout gestiona toda la estructura visual."

speak "04-escena.mp3" "La página de inicio usa las directivas when para renderizar condicionalmente, repeat con clave por producto para updates eficientes, y class Map para añadir la clase in-cart de forma dinámica cuando el producto ya está en el carrito. El layout page-layout estructura el contenido con sus slots."

speak "05-escena.mp3" "En la página del carrito vemos el decorador kueri en acción. Lo usamos para obtener una referencia al elemento con la clase cart-summary. En on Peiych Énter, esperamos a que el template se haya renderizado con apdeit compliit y luego hacemos scroll suave hasta ese elemento."

speak "06-escena.mp3" "El Cart Contróuler es el pegamento entre Lit y Cells. Tres instancias independientes, un único canal. Cuando cualquier componente publica en el canal, los tres se actualizan simultáneamente. El header, la home y el carrito siempre muestran el mismo estado del carrito."

speak "99-resumen.mp3" "El proyecto final nos muestra cómo cada concepto del tutorial encaja con los demás. El Cart Contróuler es el pegamento entre Lit y Cells: usa el ciclo de vida del Reactive Contróuler para gestionar las suscripciones y usa rikuést Update para desencadenar re-renders. Las directivas when, repeat y class Map hacen el template declarativo y eficiente. El page-layout con slots da estructura visual reutilizable. Y el decorador kueri permite interactuar con el Shadow DOM de forma tipada. En el siguiente y último video montaremos un mini e-commerce completo."

echo "¡Todos los audios del video 16 generados!"
