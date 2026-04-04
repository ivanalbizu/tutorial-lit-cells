#!/usr/bin/env bash
# Genera los audios del video 05 — Eventos y comunicación
# Requiere: edge-tts (pip install edge-tts)
# Voz: es-ES-AlvaroNeural

set -euo pipefail

VOICE="es-ES-AlvaroNeural"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

generate() {
  local file="$1"
  local text="$2"
  echo "Generando $file..."
  edge-tts --voice "$VOICE" --text "$text" --write-media "$DIR/$file"
}

# 00 — Intro
generate "00-intro.mp3" \
  "En este video vamos a ver cómo los componentes se comunican entre sí. En Lit la comunicación padre a hijo se hace con propiedades, y la comunicación hijo a padre se hace con eventos personalizados. Vamos a construir un sistema de valoraciones: un componente de estrellas que emite eventos, y un componente padre que los escucha y gestiona las reseñas."

# 01 — Patrón de comunicación
generate "01-escena.mp3" \
  "El patrón es simple. Los datos fluyen hacia abajo: el padre le pasa información al hijo a través de propiedades. Los eventos fluyen hacia arriba: el hijo le avisa al padre de que algo ocurrió a través de eventos. El padre escucha esos eventos y actualiza su estado. Esto crea un flujo de datos predecible y fácil de depurar."

# 02 — Anatomía del Custom Event
generate "02-escena.mp3" \
  "Un Custom Event tiene tres propiedades esenciales. detail es el péi load del evento: aquí enviamos el número de la valoración seleccionada. bubbles true hace que el evento suba por el árbol DOM hasta el documento, igual que un click. Y composed true es lo que permite que el evento cruce el Shadow DOM. Sin composed true, el evento quedaría atrapado dentro de la shadow root y el componente padre nunca lo recibiría."

# 03 — my-rating propiedades
generate "03-escena.mp3" \
  "El componente hijo es my-rating: muestra estrellas y permite seleccionar una valoración. Tiene dos propiedades: value para la valoración actual y max para el número máximo de estrellas. Ambas vienen del exterior, por eso son arroba property."

# 04 — dispatch Event
generate "04-escena.mp3" \
  "Este es el núcleo del video. Cuando el usuario selecciona una estrella, llamamos a this.dispatch Event con un Custom Event. El primer argumento es el nombre del evento: por convención se usa kebab keis. El segundo argumento es la configuración con detail, bubbles y composed."

# 05 — render my-rating
generate "05-escena.mp3" \
  "El render genera los botones de estrellas usando Array.from. Por cada posición, si el índice es menor que value, mostramos una estrella rellena; si no, una estrella vacía. Al hacer clic en un botón, llamamos a _select con el número de la estrella. El atributo aria-label hace el componente accesible para lectores de pantalla."

# 06 — my-review estado
generate "06-escena.mp3" \
  "El componente padre es my-review. Gestiona un array de reseñas. _currentRating almacena la valoración que el usuario está eligiendo en este momento, antes de enviar el formulario. _inputText guarda el texto del comentario."

# 07 — handler on Rating chéinjed
generate "07-escena.mp3" \
  "on Rating chéinjed es el handler que se ejecuta cuando el hijo emite rating chéinjed. Recibimos el Custom Event tipado con la forma del detail, y actualizamos _currentRating con el valor que llegó. Este método conecta el evento del hijo con el estado del padre. _submit añade la reseña al array, reasignando, no mutando, y resetea el formulario."

# 08 — render padre
generate "08-escena.mp3" \
  "Aquí está la pieza que une todo. El componente my-rating se usa con dos bindings: punto value para pasarle la valoración actual como propiedad, y arroba rating chéinjed para escuchar el evento que emite. Fíjate en la simetría: el hijo emite rating chéinjed, el padre escucha arroba rating chéinjed. Lit no distingue entre eventos del DOM y eventos personalizados: los trata igual."

# 09 — Sin composed
generate "09-escena.mp3" \
  "Si quitamos composed true del Custom Event, el evento queda atrapado dentro del Shadow DOM de my-rating. El padre nunca lo recibe: la valoración no cambia al hacer clic. Esto demuestra por qué composed true es necesario cuando el emisor está dentro de un Shadow DOM."

# 10 — Listener manual
generate "10-escena.mp3" \
  "En Lit no existe un decorador como arroba Listen. Si necesitas escuchar un evento fuera del template, lo haces manualmente con add Event Listener en el ciclo de vida connected Callback. Y es fundamental hacer el remove Event Listener en disconnected Callback para evitar fugas de memoria. Para la mayoría de casos, el binding arroba evento en el template es suficiente y más limpio."

# 99 — Resumen
generate "99-resumen.mp3" \
  "En resumen: los datos fluyen hacia abajo con propiedades y los eventos fluyen hacia arriba. dispatch Event con new Custom Event emite desde el hijo. detail es el péi load; puede ser cualquier objeto. bubbles true hace que el evento suba por el DOM, propagándose hacia arriba por el árbol. Y composed true permite que el evento cruce el Shadow DOM; sin él, el padre no lo recibe. En el template del padre, arroba nombre-evento igual a handler escucha el evento igual que cualquier evento nativo. Y no hay decorador arroba Listen en Lit. En el siguiente video vamos a ver el ciclo de vida de los componentes."

echo "Todos los audios del video 05 generados correctamente."
