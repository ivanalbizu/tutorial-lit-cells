#!/usr/bin/env bash
# Genera los audios para el video 15 — Estado compartido con Channels
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

speak "00-intro.mp3" "En este video vamos a ver el sistema de Channels de Open Cells. Los Channels son un mecanismo de mensajería global que permite a distintas páginas y componentes compartir estado sin necesidad de imports directos entre ellos. Vamos a construir un carrito de compra básico para ver cómo funciona en la práctica."

speak "01-escena.mp3" "La API tiene tres funciones que se importan desde open-cells-core. Publish envía un valor al canal. Subscribe registra un callback que se ejecuta cada vez que alguien publica en ese canal. Y unsubscribe cancela la suscripción. El nombre del canal es una cadena de texto arbitraria, por convención usamos el prefijo ch guión para identificarlos fácilmente."

speak "01b-escena.mp3" "Imaginemos que tenemos una página de producto y una página de carrito. ¿Cómo se comunican dos páginas que no se importan entre sí? Los Channels de Open Cells ofrecen un bus de mensajes con nombre, parecido al patrón publish-subscribe."

speak "02-escena.mp3" "El patrón correcto es suscribirse en on Peiych Énter y desuscribirse en on Peiych Liiv. Así evitamos memory leaks: cuando la página no está activa, no está escuchando el canal. Cuando vuelve a activarse, se suscribe de nuevo."

speak "02b-escena.mp3" "Open Cells puede mantener páginas en el DOM aunque estén ocultas. Sin el unsubscribe en on Peiych Liiv podríamos acumular suscriptores duplicados. Suscribirse en on Peiych Énter y desuscribirse en on Peiych Liiv es el patrón fundamental que evita este problema."

speak "03-escena.mp3" "La página de producto publica en el canal ch-cart cuando el usuario añade un producto. Pero también se suscribe al mismo canal para tener siempre el estado actual. Antes de publicar el nuevo estado del carrito, necesitamos saber cuál es el estado actual para añadir el producto sin perder los anteriores."

speak "04-escena.mp3" "Veamos el flujo completo. La página de producto publica en ch-cart cuando se añade un item. La página de carrito, si está suscrita, recibe ese dato en su callback y actualiza su estado, lo que dispara un re-render automático. Ambas páginas pueden leer y escribir en el mismo canal. El canal es el punto de verdad compartido."

speak "05-escena.mp3" "La página de carrito se suscribe al canal ch-cart en on Peiych Énter y actualiza su estado local con los items recibidos. En on Peiych Liiv cancela la suscripción. El método remove Item filtra el item del array y publica el resultado de vuelta al canal, propagando el cambio a cualquier otra página suscrita. El total se calcula con un getter que reduce el array."

speak "06-escena.mp3" "¿Por qué usar Channels en lugar de otras soluciones? Primero, las páginas están desacopladas: no se importan entre sí, no se conocen. Segundo, es global: cualquier componente puede suscribirse o publicar. Tercero, es simple: no hay reducers, no hay acciones. Solo publish y subscribe. Y cuarto, es láif saikl auér cuando usamos el patrón on Peiych Énter y on Peiych Liiv."

speak "99-resumen.mp3" "Hemos visto el sistema de Channels de Open Cells: publish para enviar datos, subscribe para recibirlos, y unsubscribe para dejar de escuchar. El patrón fundamental es suscribirse en on Peiych Énter y desuscribirse en on Peiych Liiv para evitar suscriptores huérfanos. Los Channels permiten que páginas completamente desacopladas compartan estado de forma reactiva y sin bóilerpleit. En el siguiente video vamos a integrar todo lo aprendido en un proyecto final cohesivo."

echo "¡Todos los audios del video 15 generados!"
