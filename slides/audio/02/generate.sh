#!/usr/bin/env bash
# Genera los audios del video 02 — Primer componente
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
  "En este video vamos a crear nuestro primer Web Component con Lit. Va a ser un componente de saludo, simple pero completo, que nos va a permitir entender la estructura fundamental de cualquier componente Lit."

# 01 — Estructura del proyecto
generate "01-escena.mp3" \
  "Partimos del proyecto que configuramos en el video anterior. Dentro de src vamos a crear nuestro primer componente. La convención en Lit es un archivo por componente, con el mismo nombre que el tag HTML que va a representar."

# 02 — Imports básicos
generate "02-escena.mp3" \
  "Empezamos con los imports. De la librería lit importamos tres cosas: Lit Element, que es la clase base de todos nuestros componentes; html, que es una función de plantilla etiquetada para escribir HTML; y css, que es lo mismo pero para estilos. Del módulo lit/decorators punto js importamos los decoradores custom Element y property."

# 03 — @custom Element
generate "03-escena.mp3" \
  "Aquí ocurren dos cosas fundamentales. El decorador arroba custom Element con el nombre del tag entre comillas registra este componente en el navegador. A partir de este momento, el navegador sabe qué hacer cuando encuentre my-greeting en el HTML. La clase MyGreeting extiende Lit Element. Esa herencia es la que nos da el sistema de reactividad y el Shadow DOM automático."

# 04 — @property
generate "04-escena.mp3" \
  "Declaramos nuestra primera propiedad reactiva con el decorador arroba property. El argumento type String le dice a Lit cómo convertir el atributo HTML, que siempre es texto, al tipo JavaScript correcto. reflect true mantiene sincronizados la propiedad JavaScript y el atributo HTML: si cambias la propiedad por código, el atributo en el DOM se actualiza también. El valor por defecto es Mundo."

# 05 — static styles
generate "05-escena.mp3" \
  "Los estilos en Lit se declaran como una propiedad estática llamada styles, usando la función de plantilla etiquetada css. El selector dos puntos host apunta al propio elemento, es decir, a my-greeting en el DOM. Por defecto los Web Components son display inline, así que es buena práctica ponerlos en display block. Estos estilos están encapsulados en el Shadow DOM: no afectan al resto de la página y los estilos externos tampoco los sobreescriben."

# 06 — render()
generate "06-escena.mp3" \
  "El método render es el corazón del componente. Devuelve un template creado con la función html. Dentro usamos la sintaxis de template literals de JavaScript: this.name inserta el valor de la propiedad. Cada vez que name cambie, Lit va a volver a llamar a render y actualizar solo la parte del DOM que cambió, de forma eficiente."

# 07 — Componente completo
generate "07-escena.mp3" \
  "Aquí tenemos el componente completo. Fíjate en la estructura: imports, decorador con el nombre del tag, clase que extiende Lit Element, propiedad reactiva, estilos encapsulados y método render. Esta misma estructura la vamos a repetir en todos los componentes del curso, añadiendo complejidad poco a poco."

# 08 — Importar y usar en HTML
generate "08-escena.mp3" \
  "Para usar el componente hay que hacer dos cosas: importarlo en el punto de entrada de la aplicación para que el decorador se ejecute y el tag quede registrado."

generate "08b-escena.mp3" \
  "Y luego usarlo en el HTML como cualquier otro elemento. La segunda instancia tiene el atributo name con el valor Lit, así que mostrará Hola, Lit en lugar de Hola, Mundo."

# 09 — Shadow DOM
generate "09-escena.mp3" \
  "En las DevTools podemos ver shadow-root dentro del elemento. Ahí vive el template que devuelve render. Los estilos también están dentro de esa raíz, por eso están completamente aislados. Esto es Shadow DOM nativo del navegador, no una abstracción de Lit: Lit simplemente lo usa y lo gestiona por nosotros."

# 99 — Resumen
generate "99-resumen.mp3" \
  "En resumen: arroba custom Element registra el tag en el navegador. extends Lit Element hereda el sistema de reactividad y Shadow DOM. arroba property declara una propiedad reactiva pública. reflect true mantiene sincronizado el atributo HTML con la propiedad JavaScript. static styles define estilos encapsulados. Y render devuelve el template; Lit lo actualiza de forma eficiente al cambiar las propiedades. En el siguiente video vamos a profundizar en las propiedades y el estado reactivo."

echo "Todos los audios del video 02 generados correctamente."
