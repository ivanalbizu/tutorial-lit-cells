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
  "Lit incluye tres decoradores para acceder al DOM interno de tu componente de forma declarativa. En este video los veremos en acción construyendo un formulario con validación."

# 01 — El problema
tts "01-escena.mp3" \
  "Sin estos decoradores, para acceder a un elemento del Shadow DOM tendrías que escribir this.render Root.kueri Selector con el selector cada vez que lo necesitas. Es verboso y propenso a errores de tipado. Los decoradores kueri, queryAll y kueri Async son atajos declarativos que hacen exactamente eso, pero de forma limpia y con tipos correctos de TypeScript."

# 02 — @kueri
tts "02-escena.mp3" \
  "El decorador kueri recibe un selector CSS y crea un getter en la clase. Ese getter llama this.render Root.kueri Selector con el selector que le pasamos. Una característica importante: el resultado se cachea por defecto. Después de la primera llamada, el getter devuelve siempre el mismo elemento sin volver a buscar en el DOM. Nota el signo de exclamación después del tipo: le decimos a TypeScript que garantizamos que el elemento existe."

# 02b — Detalles @kueri
tts "02b-escena.mp3" \
  "Para desactivar la caché puedes pasar true como segundo argumento al decorador. No accedas a propiedades kueri en el constructor ni en connected Callback antes del primer render: el Shadow DOM aún no existe."

# 03 — @queryAll
tts "03-escena.mp3" \
  "queryAll es similar pero devuelve un NodeList con todos los elementos que coinciden con el selector. Es equivalente a kueri Selector All. En este caso obtenemos todos los inputs del formulario para iterar sobre ellos durante la validación."

# 04 — @kueri Async
tts "04-escena.mp3" \
  "kueri Async es el más especial de los tres. Devuelve una Promise en lugar de un elemento directo. Esta promesa se resuelve después del siguiente ciclo de renderizado. Lo necesitas cuando el elemento que buscas solo aparece en el DOM bajo ciertas condiciones. Si intentáramos accederlo con kueri justo después de cambiar el estado, el elemento aún no habría aparecido en el DOM porque Lit renderiza de forma asíncrona."

# 04b — Uso con await
tts "04b-escena.mp3" \
  "En handleSubmit esperamos la Promise de successMessage con await. Solo después de esa espera el elemento existe en el DOM y podemos llamar skrol into viu y focus sobre él. En handleReset usamos nameInput directamente, pero lo envolvemos en apdeit compliit. Esta propiedad es una Promise que resuelve cuando Lit termina de actualizar el DOM. Es la forma correcta de asegurarse de que el DOM está listo antes de manipularlo."

# 05 — Formulario completo
tts "05-escena.mp3" \
  "El template muestra o el formulario o el mensaje de éxito, nunca los dos a la vez. Este es exactamente el escenario para el que kueri Async es necesario: el elemento success-message solo existe cuando submitted es verdadero."

# 05b — Flujo completo
tts "05b-escena.mp3" \
  "Recapitulando: kueri con el id del input para acceso directo y cacheado, usado al resetear el formulario. queryAll para iterar todos los campos durante la validación. Y kueri Async para el mensaje de éxito, que solo aparece condicionalmente."

# 99 — Resumen
tts "99-resumen.mp3" \
  "Para resumir: el decorador kueri con un selector crea un getter para el primer elemento que coincide, cacheado por defecto. queryAll devuelve un NodeList con todos los elementos que coinciden. kueri Async devuelve una Promise que resuelve tras el siguiente render, necesario para elementos renderizados condicionalmente. Y apdeit compliit es la Promise de Lit que resuelve cuando el DOM está actualizado, úsala cuando necesites operar sobre el DOM justo después de cambiar el estado."

echo "Audio generado correctamente en $DIR"
