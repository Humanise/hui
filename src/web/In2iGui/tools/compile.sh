#!/bin/bash

DIR=$(dirname $0)
CSS_PATH=${DIR}"/../css/"
JS_LIB_PATH=${DIR}"/../lib/"
JS_PATH=${DIR}"/../js/"

${DIR}/concat.sh

echo "Compressing prototype"
java -jar yuicompressor-2.2.4.jar ../lib/prototype.js --charset UTF-8 -o ../lib/prototype.min.js
echo "Compressing scripts"
java -jar yuicompressor-2.2.4.jar ${JS_PATH}combined.js --charset UTF-8 -o ${JS_PATH}minimized.js
echo "Compressing basic scripts"
java -jar yuicompressor-2.2.4.jar ${JS_PATH}combined.basic.js --charset UTF-8 -o ${JS_PATH}minimized.basic.js
echo "Compressing site scripts"
java -jar yuicompressor-2.2.4.jar ${JS_PATH}combined.site.js --charset UTF-8 -o ${JS_PATH}minimized.site.js
echo "Compressing site scripts"
java -jar yuicompressor-2.2.4.jar ${JS_PATH}combined.site.noproto.js --charset UTF-8 -o ${JS_PATH}minimized.site.noproto.js
echo "Compressing css"
java -jar yuicompressor-2.2.4.jar ${CSS_PATH}combined.css --charset UTF-8 -o ${CSS_PATH}minimized.css