#!/bin/bash

DIR=$(dirname $0)
CSS_PATH=${DIR}"/../css/"
JS_LIB_PATH=${DIR}"/../lib/"
JS_PATH=${DIR}"/../js/"
IPHONE_PATH=${DIR}"/../iphone/"

${DIR}/concat.sh

echo "Documenting"

java -Xmx256m -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -a -t=jsdoc-toolkit/templates/jsdoc -d=../api/alt ${JS_PATH}combined.noproto.js