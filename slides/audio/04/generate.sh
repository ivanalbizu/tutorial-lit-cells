#!/usr/bin/env bash
# Genera los audios del video 04 — Templates y binding
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
  "En este video vamos a dominar el sistema de templates de Lit. Lit ofrece siete tipos de binding distintos para enlazar datos con el DOM, cada uno con una sintaxis específica y un propósito claro. Los vamos a ver todos construyendo un componente de lista de tareas."

# 01 — Qué es un binding
generate "01-escena.mp3" \
  "Un binding es una conexión entre una expresión de JavaScript y una parte del DOM. Cuando la expresión cambia, el DOM se actualiza. Lit evalúa estos bindings de forma eficiente: solo actualiza las partes que cambiaron, no todo el template. Hay siete formas distintas de hacer ese enlace, dependiendo de qué parte del DOM quieres afectar."

# 02 — Interpolación de texto
generate "02-escena.mp3" \
  "El binding más básico es la interpolación de texto. Se escribe con dólar y llaves dentro del template html. La expresión puede ser una propiedad, una operación aritmética, o cualquier expresión JavaScript que devuelva un valor. Lit convierte el resultado a string y lo inserta como texto en el nodo. Si la expresión devuelve otro template html, lo anida."

# 03 — Binding de atributo
generate "03-escena.mp3" \
  "El binding de atributo asigna el valor de una expresión a un atributo HTML. La sintaxis es el nombre del atributo igual a expresión entre llaves, sin comillas alrededor. Lit serializa el valor a string si es necesario. Esto funciona para cualquier atributo: class, src, href, pléis jolder, lo que necesites."

# 04 — Binding de propiedad
generate "04-escena.mp3" \
  "El binding de propiedad usa el prefijo punto antes del nombre. Esto asigna el valor directamente a la propiedad JavaScript del elemento, no al atributo HTML. La diferencia es importante: un atributo siempre es string, una propiedad puede ser cualquier tipo. Usa binding de propiedad cuando necesites pasar un objeto, un array, un número, o cuando quieras comunicarte con un Web Component hijo."

# 05 — Binding de evento
generate "05-escena.mp3" \
  "El binding de evento usa el prefijo arroba seguido del nombre del evento, sin el on inicial. El valor es el handler: puede ser un método de la clase o una arrow function inline. Lit gestiona el add Event Listener y el remove Event Listener automáticamente. Cuando el componente se elimina del DOM, los listeners también se limpian."

# 06 — Binding booleano
generate "06-escena.mp3" \
  "El binding booleano usa el prefijo interrogación antes del nombre del atributo. Si la expresión es verdadera, el atributo aparece en el elemento sin valor, como disabled o required. Si es falsa, el atributo desaparece por completo. Es la forma correcta de manejar atributos que en HTML funcionan por presencia o ausencia."

# 07 — Condicional con nothing
generate "07-escena.mp3" \
  "Para renderizado condicional, Lit usa expresiones JavaScript estándar. El ternario es la forma más común. Para el caso en que no quieras renderizar absolutamente nada, ni siquiera un comentario en el DOM, Lit exporta el valor especial nothing. Es más limpio que devolver una cadena vacía o null, porque no deja ningún nodo residual."

# 08 — Listas con map
generate "08-escena.mp3" \
  "Para renderizar listas, se usa el método map de los arrays. Llamas a map sobre tu array y devuelves un template por cada elemento. Lit renderiza todos los templates resultantes. Aquí no hay directiva especial: es JavaScript puro dentro del template. Más adelante veremos la directiva repeat para listas grandes donde el rendimiento importa, pero para la mayoría de casos, map es suficiente y más sencillo."

# 09 — my-task-list estructura
generate "09-escena.mp3" \
  "Vamos a construir la lista de tareas. Definimos la interfaz Task con id, texto y si está completada. El estado son dos campos: el array de tareas y un booleano para mostrar u ocultar las completadas. Todo estado interno, con arroba state."

# 10 — getter y toggle
generate "10-escena.mp3" \
  "Un getter _visibleTasks calcula qué tareas mostrar según el filtro activo. El método _toggle actualiza el array de tareas. Fíjate en la asignación: this._tasks igual a this._tasks punto map. Es importante reasignar la propiedad completa, no mutar el array. Lit detecta el cambio comparando la referencia: si mutas el array sin reasignar, no detectará el cambio y no re-renderizará."

# 11 — render completo
generate "11-escena.mp3" \
  "El render junta todos los tipos de binding que vimos. Tenemos interpolación de texto con el contador de pendientes. Binding de propiedad con punto checked para sincronizar el checkbox con el estado. Binding de evento con arroba change. Binding de atributo con class que usa un ternario. Condicional con nothing para el icono de completado. Lista con map para renderizar las tareas. Y al final, un condicional para el mensaje de lista vacía. Cada uno en su sitio, haciendo exactamente lo que le corresponde."

# 99 — Resumen
generate "99-resumen.mp3" \
  "En resumen: interpolación de texto con dólar y llaves. Atributo con attr igual a expresión. Propiedad con punto prop. Evento con arroba evento. Booleano con interrogación attr. Condicional con ternario y nothing. Lista con punto map. Y recuerda: nunca mutar un array u objeto directamente; reasignar la propiedad para que Lit detecte el cambio. En el siguiente video vamos a ver los eventos y la comunicación entre componentes."

echo "Todos los audios del video 04 generados correctamente."
