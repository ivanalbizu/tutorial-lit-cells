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
  "En este video aprenderás a encapsular lógica reutilizable fuera de tus componentes usando Reactive Controllers. Es uno de los patrones más potentes de Lit."

# 01 — ¿Qué es un Reactive Contróuler?
tts "01-escena.mp3" \
  "Un Reactive Contróuler es una clase que puede engancharse al ciclo de vida de un componente Lit. El componente que lo usa se llama host. El contróuler puede pedirle al host que se rerenderice cuando su estado interno cambia."

# 01b — Interfaz Reactive Contróuler
tts "01b-escena.mp3" \
  "La interfaz tiene cuatro métodos opcionales: host Connected, que se llama cuando el host se conecta al DOM; host Disconnected, cuando se desconecta; host Update, antes de cada actualización; y host Updated, después de cada actualización. Lo fundamental es que en el constructor llamas host.add Contróuler de this. Eso registra el contróuler y activa los hooks del ciclo de vida."

# 02 — Clock Contróuler
tts "02-escena.mp3" \
  "El Clock Contróuler usa set interval para actualizar la hora cada segundo. En el constructor recibe el host y llama add Contróuler. En host Connected inicia el intervalo, y en host Disconnected lo cancela."

# 02b — Detalles Clock Contróuler
tts "02b-escena.mp3" \
  "Fíjate en dos cosas clave. Primero, this.host.rikuést Update: cuando el contróuler cambia su estado interno, el host no lo sabe automáticamente. Tenemos que notificárselo manualmente para que se rerenderice. Segundo, la limpieza en host Disconnected. Si no cancelamos el set interval, el timer seguiría corriendo aunque el componente ya no existiera, produciendo una fuga de memoria."

# 03 — Mouse Contróuler
tts "03-escena.mp3" \
  "El patrón es idéntico al del reloj. Registramos el listener en host Connected y lo quitamos en host Disconnected. Nota que guardamos la función en una propiedad de flecha: on maus muv. Esto es necesario para poder pasarla como referencia exacta a remove Event Listener. Si usáramos una función anónima, no podríamos eliminarla correctamente."

# 04 — Fetch Contróuler
tts "04-escena.mp3" \
  "Este contróuler es genérico: la T es el tipo de los datos que esperamos recibir. Tiene tres estados: loading, error y data. Usamos un Abort Contróuler nativo del navegador para cancelar peticiones en vuelo. Si el componente se desmonta antes de que la petición termine, host Disconnected llama abort y evitamos que lleguen datos a un componente que ya no existe."

# 04b — Método fetch
tts "04b-escena.mp3" \
  "El método fetch cancela cualquier petición anterior antes de iniciar una nueva. Actualiza loading y llama rikuést Update para que el host muestre el indicador de carga. Al terminar, en el bloque fáinali, loading vuelve a false y se notifica al host de nuevo. El AbortError se maneja por separado: cuando se cancela intencionalmente no lo tratamos como un error real."

# 05 — Uso en componente
tts "05-escena.mp3" \
  "Aquí se ve la elegancia del patrón. Los tres contróulers son simplemente class fields. Lit los registra automáticamente porque cada uno llamó add Contróuler en su constructor."

# 05c — Class fields vs constructor
tts "05c-escena.mp3" \
  "¿Por qué class fields y no el constructor? Podríamos declarar los contróulers dentro del constructor, pero sería código innecesario: declarar la propiedad, llamar a super, e instanciar cada contróuler. Como class field, el propio constructor del contróuler llama add Contróuler de this, así que el registro ocurre solo. Es la forma idiomática en Lit: menos código, más legible."

# 05b — Render
tts "05b-escena.mp3" \
  "En el render consumimos sus propiedades directamente: this.clock.value, this.mouse.position, this.fetcher.data. No necesitamos ningún código extra en el componente para que funcione la reactividad."

# 99 — Resumen
tts "99-resumen.mp3" \
  "Para resumir: un Reactive Contróuler implementa host Connected, host Disconnected, host Update y host Updated. El constructor siempre llama host.add Contróuler de this para registrarse. Se llama host.rikuést Update para notificar cambios de estado al componente. Se instancian como class fields en el componente. Un mismo componente puede tener múltiples contróulers. Y la limpieza de recursos en host Disconnected es obligatoria para evitar fugas de memoria."

echo "Audio generado correctamente en $DIR"
