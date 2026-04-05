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
  "En este video vamos a ver todos los métodos del ciclo de vida de un componente Lit. Vamos a construir un reloj en tiempo real para que cada método tenga un propósito real y concreto."

speak "01-diagrama.mp3" \
  "El ciclo de vida de Lit sigue un orden predecible. Empieza con el constructor al crear la instancia, luego connected Callback al insertar el elemento en el DOM, después will Update antes de cada render, el propio render que produce el template, first Updated que se ejecuta una sola vez tras el primer render, updated tras cada render, y finalmente disconnected Callback cuando el elemento se elimina del DOM."

speak "02-constructor.mp3" \
  "El constructor es el primer método que se ejecuta. La regla número uno es llamar a super() antes de cualquier otra cosa. Sin eso, la clase base no se inicializa y obtendrás un error. El constructor es el lugar para inicializar propiedades internas, pero el Shadow DOM todavía no existe, así que no intentes acceder a elementos del template aquí."

speak "02b-constructor.mp3" \
  "En el constructor puedes inicializar propiedades internas con valores por defecto. Lo que no debes hacer es acceder a this.shadow Root ni a elementos del template. El Shadow DOM se crea después del constructor, por lo que cualquier intento de acceder a él aquí resultará en null."

speak "03-connected.mp3" \
  "connected Callback se ejecuta cuando el elemento se inserta en el DOM. De nuevo, llamar a super.connected Callback() es obligatorio. Este es el lugar ideal para iniciar temporizadores, suscribirse a eventos globales o cargar datos. Aquí arrancamos un set interval que actualiza la hora cada segundo."

speak "03b-connected.mp3" \
  "Llamamos a this.rikuést Update() porque _currentTime es una propiedad privada que Lit no observa automáticamente. Sin esta llamada, el componente no sabría que necesita volver a renderizar. En connected Callback también puedes suscribirte a eventos globales, cargar datos iniciales o iniciar animaciones."

speak "04-willupdate.mp3" \
  "will Update se ejecuta justo antes de cada render. Recibe un Map llamado changedProps que contiene las propiedades que cambiaron. Importante: los valores dentro del Map son los valores anteriores, no los nuevos. Para leer el nuevo valor usas this.label directamente. Este método es perfecto para derivar estado. Cualquier cambio que hagas aquí no dispara un render adicional."

speak "05-render.mp3" \
  "El método render debe ser puro. Eso significa que solo lee estado y retorna un template; nunca modifica propiedades dentro de él. Lit llama a render cada vez que una propiedad observada cambia. Si pones lógica con efectos secundarios aquí, tu componente se volverá impredecible."

speak "06-firstupdated.mp3" \
  "first Updated se ejecuta una sola vez, justo después del primer render. Es el momento en el que el Shadow DOM ya existe y puedes acceder a elementos con this.shadow Root.kueri Selector. Es el equivalente al mounted de otros frameworks, ideal para integrar librerías de terceros que necesiten un nodo real del DOM, o para enfocar un campo de formulario al cargar."

speak "07-updated.mp3" \
  "updated se llama después de cada render cuando el DOM ya refleja los nuevos valores. También recibe el mapa de propiedades anteriores. Úsalo para reaccionar a cambios específicos. Ten cuidado: si modificas una propiedad observada dentro de updated, causarás otro render y puedes terminar en un bucle infinito. Siempre protege esos cambios con una condición."

speak "08-disconnected.mp3" \
  "disconnected Callback se ejecuta cuando el elemento es removido del DOM. Aquí es donde debes limpiar todo lo que iniciaste en connected Callback: cancelar el set interval, remover event listeners globales, cancelar peticiones de red. Siempre llama a super.disconnected Callback() para que Lit pueda hacer su propia limpieza interna. Si no limpias los temporizadores, seguirán corriendo en memoria aunque el elemento ya no esté visible."

speak "09-changedprops.mp3" \
  "changedProps es un Map que reciben tanto will Update como updated. Las claves son los nombres de las propiedades que cambiaron, y los valores son los valores anteriores, no los nuevos. Para leer el nuevo valor de una propiedad, accedes directamente a this.label. El Map existe tanto en will Update como en updated y ambos reciben exactamente los mismos valores anteriores."

speak "10-wrapper.mp3" \
  "El componente my-lifecycle-demo tiene un estado booleano _mounted. Cuando es true, renderiza el my-clock; cuando es false, renderiza un template vacío. Esto provoca que Lit agregue y elimine el elemento del DOM, disparando connected Callback y disconnected Callback. Abre la consola del navegador y pulsa el botón varias veces para ver el orden exacto de los métodos."

speak "10b-wrapper.mp3" \
  "Observa el orden en la consola: primero constructor, luego connected Callback, luego will Update, luego render, luego first Updated y updated. Al desmontar, solo aparece disconnected Callback. Al montar de nuevo, el ciclo completo vuelve a empezar porque es una instancia nueva del elemento."

speak "99-resumen.mp3" \
  "El ciclo de vida de Lit es predecible. Los métodos que heredan de la plataforma web, como connected Callback y disconnected Callback, requieren llamar a super. Los métodos propios de Lit, como will Update, first Updated y updated, no lo requieren. La regla práctica es sencilla: inicia recursos en connected Callback, limpia en disconnected Callback, accede al DOM en first Updated, y deriva estado en will Update."

echo "Audio del video 06 generado correctamente."
