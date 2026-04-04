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
  "En este video vamos a ver las directivas de Lit. Las directivas son funciones especiales que se usan dentro de los templates para controlar cómo Lit actualiza el DOM. Cada una resuelve un problema concreto: listas con reordenamiento eficiente, clases y estilos condicionales, renderizado lazy, memorización y atributos opcionales."

speak "01-que-son.mp3" \
  "Las directivas son funciones que controlan cómo Lit actualiza el DOM. Se usan dentro de los templates html. Cada directiva resuelve un problema concreto: listas eficientes, clases condicionales, renderizado lazy, memorización y atributos opcionales. Se importan individualmente, lo que significa que solo incluyes en tu bundle lo que realmente usas."

speak "02-base.mp3" \
  "Vamos a construir un único componente que use todas las directivas. Tenemos una lista de personas con un identificador, nombre, edad y estado activo. Añadiremos controles para reordenar, filtrar y resaltar, de modo que cada directiva tenga una razón de ser concreta."

speak "03-repeat.mp3" \
  "repeat toma tres argumentos: el array de datos, una función clave que retorna un identificador único por elemento, y una función de template que retorna el HTML de cada item. La función clave es fundamental: cuando el array se reordena, Lit puede mover los nodos del DOM existentes en lugar de destruirlos y recrearlos."

speak "03b-repeat.mp3" \
  "La función clave de repeat preserva el estado interno de cada elemento y es mucho más eficiente al reordenar. Si tu lista solo crece al final y nunca se reordena, el método .map normal es suficiente. Usa repeat cuando haya inserciones en el medio, reordenamiento o eliminaciones frecuentes."

speak "04-classmap.mp3" \
  "class Map recibe un objeto donde las claves son nombres de clases CSS y los valores son booleanos. Si el valor es verdadero, la clase se añade; si es falso, se elimina. Es la forma idiomática de manejar clases condicionales en Lit: mucho más legible que construir una cadena de texto manualmente."

speak "05-stylemap.mp3" \
  "style Map funciona igual que class Map pero para estilos inline. Las claves del objeto son propiedades CSS en kámel keis, que es el estándar de JavaScript para acceder a propiedades de estilo. Por ejemplo, font-weight en CSS se escribe font Weight en el objeto. Úsalo cuando los valores de los estilos son dinámicos y no pueden resolverse con clases CSS predefinidas."

speak "06-when.mp3" \
  "when es un condicional ternario para templates. Recibe una condición y dos funciones: la primera se ejecuta si la condición es verdadera, la segunda si es falsa. La diferencia clave respecto a un ternario normal es que when es lazy: la función que no se necesita no se evalúa en absoluto. Si tus templates son simples, un ternario normal es perfectamente válido."

speak "07-guard.mp3" \
  "La directiva guard recibe dos argumentos: un array de dependencias y una función. Solo ejecuta esa función cuando alguna dependencia cambia. Si nada cambió, reutiliza el resultado anterior. Esto permite memorizar fragmentos costosos del template. Por ejemplo, si tienes un listado con filtrado complejo pero otros estados del componente cambian con frecuencia, guard evita recalcular ese fragmento en cada render."

speak "08-ifdefined.mp3" \
  "if difaind es muy sencillo pero evita un bug habitual. Si un atributo tiene el valor andifaind, sin if difaind Lit lo renderizaría como la cadena de texto andifaind, lo que en un href sería un enlace roto. Con if difaind, si el valor es andifaind, el atributo directamente no se añade al elemento. Si el valor existe, se añade con normalidad. Nota que esto solo elimina el atributo con andifaind; si el valor es null, el atributo sí se añade."

speak "99-resumen.mp3" \
  "Las directivas de Lit se importan individualmente: solo pagas por lo que usas. Cada una resuelve un problema concreto. repeat para listas con claves únicas, evitando recrear nodos al reordenar. class Map para clases CSS condicionales declarativas. style Map para estilos inline dinámicos. when para condicionales lazy que no evalúan la rama que no se necesita. guard para memorizar fragmentos costosos y evitar recálculos innecesarios. Y if difaind para atributos opcionales que no deben renderizarse si el valor es andifaind. En el siguiente video veremos slots y composición."

echo "Audio del video 08 generado correctamente."
