#!/usr/bin/env bash
# Genera los audios del video 03 — Propiedades y estado
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
  "En este video vamos a explorar el sistema de reactividad de Lit en profundidad. Vamos a ver la diferencia entre arroba property y arroba state, los tipos de datos disponibles, qué hace exactamente reflect y cómo funcionan los eventos en el template. Para eso vamos a construir dos componentes: un contador y una tarjeta de usuario."

# 01 — Concepto público vs privado
generate "01-escena.mp3" \
  "Antes de escribir código, entendamos la diferencia conceptual. arroba property declara una propiedad que el mundo exterior puede ver y modificar: otros componentes, JavaScript en la página, o atributos en el HTML. arroba state declara una propiedad puramente interna: solo el propio componente la conoce y la modifica. Ambas tienen lo mismo en común: cuando cambian, disparan un re-render automático. Esa es la reactividad de Lit."

# 02 — Imports my-counter
generate "02-escena.mp3" \
  "Creamos my-counter punto ts. En los imports añadimos state además de property. Son dos decoradores distintos con comportamientos distintos, aunque en apariencia se escriben igual."

# 03 — @property Number
generate "03-escena.mp3" \
  "Declaramos dos propiedades públicas. label es un String: el texto que aparece junto al contador. step es un Number: cuánto suma o resta cada pulsación. Fíjate en type Number. Cuando el HTML pone step igual a 2, el atributo llega como string dos, y Lit lo convierte a número dos automáticamente gracias a este tipo. Sin él, tendríamos sumas de strings en lugar de sumas numéricas."

# 04 — @state
generate "04-escena.mp3" \
  "Aquí está arroba state. El prefijo guion bajo es una convención de TypeScript para señalar que es privado. El valor del contador es estado interno: nadie fuera del componente debería poder cambiarlo directamente. Si el contador expone un valor hacia afuera, lo haría a través de un evento, no exponiendo este estado."

# 05 — métodos y render del contador
generate "05-escena.mp3" \
  "El render usa arroba click para enlazar eventos. Cuando _decrement modifica _count, que es un arroba state, Lit detecta el cambio y re-renderiza solo el span con el número. No se vuelve a crear todo el DOM, solo se actualiza el texto que cambió."

# 06 — my-user-card propiedades
generate "06-escena.mp3" \
  "Ahora el segundo componente: una tarjeta de usuario. Aquí tenemos los tres tipos primitivos en acción. name es String, age es Number. active es Boolean con reflect true. Los booleanos en HTML siguen una convención especial: si el atributo está presente, el valor es true; si está ausente, es false. Con reflect true, cuando el componente se marca como activo por código, el atributo active aparece en el elemento HTML. Eso permite seleccionarlo con CSS desde fuera usando el selector con corchetes active. Por último, _showDetails es un arroba state: estado interno para controlar si se expanden los detalles."

# 07 — :host([active]) estilos
generate "07-escena.mp3" \
  "Veamos los estilos. Fíjate en el selector dos puntos host con corchetes active. Esto aprovecha que active tiene reflect true: cuando la propiedad es true, el atributo active existe en el elemento HTML, y el selector lo captura para cambiar el borde a morado. Sin reflect, este selector no funcionaría porque el atributo no estaría en el DOM."

# 08 — render user-card
generate "08-escena.mp3" \
  "En el render combinamos todos los tipos. Primero interpolamos name, que es un String. Luego un ternario con active para mostrar Activo o Inactivo. El botón usa arroba click para alternar _showDetails, que es un arroba state. Y abajo, otro ternario: si _showDetails es true, renderizamos un template html anidado con la edad. El estado interno controla la visibilidad sin exponer nada al exterior."

# 09 — Uso en HTML
generate "09-escena.mp3" \
  "Usamos los componentes en el HTML. Al contador le pasamos step igual a cinco y Lit lo convierte a número. En la primera tarjeta ponemos el atributo active sin valor: solo su presencia ya significa true. La segunda tarjeta no tiene active, así que su propiedad será false y tendrá el borde gris."

# 10 — Reactividad en DevTools
generate "10-escena.mp3" \
  "Para ver la reactividad en acción, abrimos la consola del navegador. Cambiamos step a 10 en el contador: ahora cada pulsación suma o resta 10. Cambiamos active a true en la segunda tarjeta: el borde cambia inmediatamente a morado y el badch dice Activo. Todo esto sin recargar la página, porque Lit detecta el cambio en la propiedad y re-renderiza."

# 99 — Resumen
generate "99-resumen.mp3" \
  "En resumen: arroba property declara propiedades públicas, visibles y modificables desde fuera del componente. arroba state declara estado privado, solo accesible internamente. Ambas disparan un re-render automático al cambiar. type Number y type Boolean convierten atributos HTML al tipo JavaScript correcto. reflect true sincroniza la propiedad hacia el atributo HTML, útil para selectores CSS externos. Y en HTML, la presencia de un atributo booleano equivale a true; su ausencia equivale a false. En el siguiente video vamos a ver los siete tipos de binding del sistema de templates."

echo "Todos los audios del video 03 generados correctamente."
