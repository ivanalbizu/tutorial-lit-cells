#!/usr/bin/env bash
# Genera los audios para el video 14 — Routing avanzado
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

speak "00-intro.mp3" "En este video vamos a profundizar en el sistema de routing de Open Cells. Veremos cómo definir rutas con parámetros dinámicos, cómo leer esos parámetros desde una página, y cómo proteger rutas con un interceptor que actúa como guardia de autenticación."

speak "01-escena.mp3" "Partimos de la configuración de start App que ya conocemos. Tenemos un array péiches donde cada entrada define una ruta. Hasta ahora todas nuestras rutas eran estáticas: barra home, barra about. Ahora vamos a añadir rutas dinámicas."

speak "01b-escena.mp3" "Para definir un parámetro dinámico usamos dos puntos seguidos del nombre del parámetro en el path. Aquí dos puntos id significa que ese segmento de la URL puede ser cualquier valor: un número, un slug, lo que necesitemos. El resto de la configuración es igual que cualquier otra ruta."

speak "02-escena.mp3" "Para navegar a una ruta con parámetros usamos page Contróuler.návikeit igual que siempre, pero pasamos un segundo argumento: un objeto con los parámetros. Open Cells construirá la URL automáticamente. En el hash del navegador veremos la ruta con el id al final."

speak "03-escena.mp3" "Creamos el componente product-page. El punto clave está en on Peiych Énter: se ejecuta cada vez que la página se vuelve activa. Dentro accedemos a la propiedad hash de la URL del navegador, que contiene la ruta completa incluyendo el parámetro, y lo parseamos para extraer el identificador."

speak "03b-escena.mp3" "Open Cells trabaja con hash-routing, lo que significa que toda la ruta vive en el fragmento de la URL. No hay servidor que procese la URL, todo ocurre en el cliente. Para rutas sencillas con un parámetro al final, este enfoque es directo y sin dependencias extra."

speak "04-escena.mp3" "El interceptor es una función que Open Cells ejecuta automáticamente antes de cada navegación. Recibe información sobre a dónde va el usuario y el contexto actual de la aplicación. Devuelve un objeto que le dice al router si debe permitir la navegación, redirigirla, o bloquearla."

speak "05-escena.mp3" "Definimos un array PUBLIC_ROUTES con las páginas que cualquiera puede ver sin autenticarse. Luego en start App añadimos la propiedad interceptor con una función de dos parámetros: navigation contiene información sobre la navegación actual, y ctx es el contexto que nosotros controlamos."

speak "05b-escena.mp3" "La lógica es simple: si el destino es una ruta pública, devolvemos intercept false para dejar pasar. Si el usuario no está autenticado, devolvemos intercept true con un ridirekt al login. Si está autenticado, dejamos pasar."

speak "06-escena.mp3" "Aquí hay un error muy común. El valor de ridirekt NO es un string con el nombre de la página. Debe ser un objeto con la propiedad page. Si escribimos ridirekt login como string, Open Cells intentará hacer ridirekt.page y obtendremos andifaind. La navegación fallará silenciosamente."

speak "07-escena.mp3" "skipNavigations controla el historial de navegación. Si la usamos para ir de login a home, esa transición no se añadirá al historial del navegador. Pero skipNavigations no tiene nada que ver con el interceptor. El interceptor se ejecuta igualmente. La única forma de que el interceptor deje pasar una ruta es que retorne intercept false explícitamente."

speak "08-escena.mp3" "Definimos PUBLIC_ROUTES como un array simple. Dentro del interceptor comprobamos si la página destino está en ese array. Si está, devolvemos intercept false inmediatamente. Así un único array controla qué páginas son públicas, sin tocar la lógica del guardia."

speak "09-escena.mp3" "Para que el interceptor tenga datos que evaluar, usamos update Interceptor Context importado desde open-cells-core. Cuando el usuario hace login correctamente, llamamos a esta función pasando un objeto con is Authenticated true. Ese valor quedará disponible como ctx en el interceptor."

speak "09b-escena.mp3" "La página de login es sencilla: un botón que al pulsarse llama a update Interceptor Context con is Authenticated true y luego navega a la página protegida. La página protegida no necesita lógica especial, el guardia ya la protege en el interceptor."

speak "99-resumen.mp3" "Hemos cubierto tres capacidades clave del routing en Open Cells. Primero, rutas con parámetros dinámicos usando dos puntos en el path y parseando el hash en on Peiych Énter. Segundo, navegación con parámetros usando el segundo argumento de návikeit. Tercero, el interceptor como guardia de autenticación. Y hemos visto dos gotchas importantes: el ridirekt debe ser un objeto con la propiedad page, y skipNavigations no reemplaza al interceptor. En el próximo video veremos cómo compartir estado entre páginas usando los Channels de Open Cells."

echo "¡Todos los audios del video 14 generados!"
