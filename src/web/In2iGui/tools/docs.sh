#!/bin/bash

DIR=$(dirname $0)
CSS_PATH=${DIR}"/../css/"
JS_LIB_PATH=${DIR}"/../lib/"
JS_PATH=${DIR}"/../js/"
IPHONE_PATH=${DIR}"/../iphone/"

${DIR}/concat.sh

echo "Documenting"
perl jsdoc/jsdoc.pl -d ${DIR}/../api ${JS_PATH}combined.js