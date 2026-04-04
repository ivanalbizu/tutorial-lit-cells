#!/usr/bin/env bash
# Genera los audios para el video 17 — E-commerce completo
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

speak "00-intro.mp3" "Este es el video final del tutorial. Vamos a construir un mini e-commerce que pone a prueba absolutamente todo lo que hemos aprendido. Tendremos catálogo con búsqueda con debounce, detalle de producto con parámetros dinámicos, carrito con cantidades, lista de favoritos, notificaciones tipo toast, y limpieza de estado al salir de una página. Son cuatro Reactive Controllers y tres canales independientes trabajando en paralelo."

speak "01-escena.mp3" "El mini e-commerce tiene seis funcionalidades principales: catálogo con búsqueda con debounce, detalle de producto con parámetros dinámicos, carrito con cantidades y total calculado, lista de favoritos independiente, notificaciones toast con auto-dismiss, y cleanup en on Page Leave."

speak "01b-escena.mp3" "La estructura del proyecto refleja la separación de responsabilidades. Cuatro controllers, cada uno gestionando un aspecto de la aplicación. Tres componentes compartidos que no son páginas. Cuatro páginas principales. Y el punto de entrada app punto ts que configura el router."

speak "02-escena.mp3" "Antes de escribir código, entendamos los cuatro Reactive Controllers. Cart Contróuler con el canal cart-items. Wishlist Contróuler con el canal wishlist-items. Search Contróuler sin canal, es debounce puro. Y Toast Contróuler con el canal toast-messages y un método estático show que se puede llamar desde cualquier parte."

speak "03-escena.mp3" "Tres canales completamente independientes. El canal cart-items conecta las tarjetas de producto con el Cart Contróuler y este actualiza el badge del header y la página del carrito. El canal wishlist-items hace lo mismo para los favoritos. Y el canal toast-messages recibe peticiones de notificación y el toast-container las muestra."

speak "04-escena.mp3" "El Search Contróuler es diferente a los anteriores: no usa Channels. Es un controller de debounce puro. El método search recibe el texto que el usuario está escribiendo, cancela el timeout anterior si existe, y programa uno nuevo con 300 milisegundos de retraso. Solo cuando el usuario deja de escribir durante 300 milisegundos se actualiza la propiedad kueri y se llama a request Update. En host Disconnected limpiamos el timeout pendiente."

speak "05-escena.mp3" "El Toast Contróuler gestiona las notificaciones efímeras. Tiene un método estático show que se puede llamar desde cualquier parte de la aplicación sin necesidad de tener una instancia del controller. Publica en el canal toast-messages y el componente toast-container, que tiene el controller instanciado, recoge esos mensajes y los renderiza. El auto-remove después de tres segundos se implementa en el componente."

speak "06-escena.mp3" "El Wishlist Contróuler sigue exactamente el mismo patrón que el Cart Contróuler pero con el canal wishlist-items. La diferencia funcional es el método toggle: en lugar de add y remove separados, tenemos un único método que añade si el producto no está en la lista y lo elimina si ya está. También tenemos el método has para saber si un producto concreto está en los favoritos."

speak "07-escena.mp3" "En la home-page usamos la directiva live en el atributo value del input de búsqueda. La directiva live le indica a Lit que compare el valor con el valor real del DOM antes de actualizarlo, evitando que el campo de texto parpadee o pierda el cursor mientras el usuario escribe. El handler input llama a search.search con el valor actual, y el controller aplica el debounce de 300 milisegundos."

speak "08-escena.mp3" "El product-card es el componente más conectado de toda la aplicación. Instancia tres controllers: Cart Contróuler, Wishlist Contróuler, y usa el método estático de Toast Contróuler sin instanciarlo. Al añadir al carrito, llama a cart.add y lanza un toast de éxito. Al pulsar el favorito, llama a wishlist.toggle y lanza un toast informativo. Todo sin gestionar ningún estado local."

speak "09-escena.mp3" "La página del carrito usa on Page Leave para hacer un cleanup útil: cuando el usuario sale del carrito sin completar la compra, lanza un toast recordándole que tiene items pendientes. Este es un uso real de on Page Leave: no solo para desuscribirse de canales, sino para ejecutar cualquier lógica de salida. El Cart Contróuler gestiona la suscripción automáticamente."

speak "10-escena.mp3" "El diagrama de flujo de datos muestra los tres canales coordinando la aplicación. El canal cart-items conecta las tarjetas y páginas de carrito con el badge del header. El canal wishlist-items hace lo mismo para favoritos. Y el canal toast-messages lleva notificaciones desde cualquier parte hasta el toast-container. El Search Contróuler trabaja de forma independiente con debounce local."

speak "99-resumen.mp3" "Hemos completado el e-commerce y con él el tutorial completo. Los cuatro Reactive Controllers gestionan cada dominio de forma independiente: carrito, favoritos, búsqueda y toasts. Los tres canales conectan componentes sin que se conozcan entre sí. Los componentes compartidos consumen múltiples controllers simultáneamente. Y el ciclo de vida de Open Cells con on Page Enter y on Page Leave nos da control preciso sobre qué ocurre cuando el usuario navega. Las directivas de Lit que ejercitamos son repeat, when, class Map, live y guard. Los conceptos de Open Cells son start App, Peiych Contróuler, subscribe, publish, unsubscribe, návikeit, on Page Enter, on Page Leave, múltiples canales, y componentes fuera del router. Gracias por seguir el tutorial. Ya tienes todas las herramientas para construir aplicaciones reales con Lit y Open Cells."

echo "¡Todos los audios del video 17 generados!"
