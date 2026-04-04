#!/bin/bash
# Genera audios por slide para la presentacion 01-setup
# Uso: cd slides && bash audio/01/generate.sh

EDGE_TTS="${HOME}/.local/share/pipx/venvs/edge-tts/bin/edge-tts"
VOICE="es-ES-AlvaroNeural"
DIR="$(dirname "$0")"

if ! command -v "$EDGE_TTS" &> /dev/null; then
  # Fallback: edge-tts en PATH
  EDGE_TTS="edge-tts"
fi

generate() {
  local file="$1"
  local text="$2"
  echo "  Generando $file..."
  $EDGE_TTS --voice "$VOICE" --text "$text" --write-media "$DIR/$file" 2>/dev/null
}

echo "Generando audios para 01-setup..."
echo ""

generate "00-intro.mp3" \
  "Bienvenidos al primer video del curso de Lit y Cells. En este video vamos a montar un proyecto desde cero con Vite, Lit y TypeScript."

generate "01-escena.mp3" \
  "Empezamos con el package punto json. Lo primero importante es type module, porque vamos a usar ES Modules nativos."

generate "01b-escena.mp3" \
  "Añadimos tres scripts. dev para desarrollo con Vite, que nos da Hot Module Replacement. build para producción, que compila TypeScript y empaqueta con Rollup. Y preview para previsualizar el build."

generate "01c-escena.mp3" \
  "Solo necesitamos tres paquetes. lit como dependencia de producción, es la librería para crear Web Components. Y typescript y vite como dependencias de desarrollo. Comparado con otros frameworks que traen su propio compilador integrado, aquí elegimos cada pieza. Pero al final son solo tres paquetes."

generate "02-escena.mp3" \
  "Creamos el tsconfig punto json. La mayoría de opciones son estándar para un proyecto TypeScript moderno."

generate "02b-escena.mp3" \
  "Pero hay dos opciones críticas para Lit. Primera: experimental Decorators en true. Lit usa decoradores como arroba custom Element y arroba property. Sin esto, TypeScript no los reconoce. Segunda, y muy importante: use Define For Class Fields en false. Por defecto, TypeScript usa Object define Property para las propiedades de clase, lo que interfiere con cómo Lit gestiona las propiedades reactivas. Si alguna vez tus propiedades no disparan re-renders, revisa que esta opción esté en false."

generate "03-escena.mp3" \
  "La configuración de Vite es mínima. Le decimos que nuestro punto de entrada es src barra index punto ts, que queremos formato ES Modules, y que en el build de producción no incluya Lit en el bundle. Lo marcamos como external. Para desarrollo no necesitamos nada más. Vite detecta TypeScript automáticamente."

generate "04-escena.mp3" \
  "En Vite, el index punto html es el punto de entrada real, no un template generado. Fíjate en el script: type module y apuntando directamente al archivo punto ts. Vite se encarga de compilarlo al vuelo durante desarrollo."

generate "05-escena.mp3" \
  "Por ahora solo un console log para verificar que todo funciona. Aquí es donde iremos importando los componentes que creemos en los siguientes videos."

generate "06-escena.mp3" \
  "Ejecutamos npm run dev y Vite arranca en milisegundos. En el navegador vemos nuestro HTML, y si abrimos la consola, ahí está nuestro mensaje. El proyecto está listo. Tenemos Hot Module Replacement: cualquier cambio se refleja al instante sin recargar."

generate "99-resumen.mp3" \
  "Recapitulemos. Hemos creado un proyecto Lit desde cero con cinco archivos. package punto json con tres dependencias. tsconfig punto json con decoradores experimentales activados. vite config punto ts mínimo. index punto html como punto de entrada. Y src barra index punto ts donde vivirá nuestro código. En el siguiente video vamos a crear nuestro primer Web Component con Lit. Nos vemos allí."

echo ""
echo "Audios generados en $DIR/"
ls -la "$DIR"/*.mp3 2>/dev/null | wc -l
echo "archivos mp3"
