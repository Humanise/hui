#!/bin/bash

DIR=$(dirname $0)
CSS_PATH=${DIR}"/../css/"
JS_LIB_PATH=${DIR}"/../lib/"
JS_PATH=${DIR}"/../js/"
IPHONE_PATH=${DIR}"/../iphone/"

echo "Concatenating CSS"
cat ${CSS_PATH}master.css ${CSS_PATH}common.css ${CSS_PATH}tabbox.css ${CSS_PATH}formula.css ${CSS_PATH}layout.css ${CSS_PATH}alert.css ${CSS_PATH}view.css ${CSS_PATH}toolbar.css ${CSS_PATH}window.css ${CSS_PATH}list.css ${CSS_PATH}selection.css ${CSS_PATH}imagepicker.css ${CSS_PATH}boundpanel.css ${CSS_PATH}panel.css ${CSS_PATH}richtext.css ${CSS_PATH}imageviewer.css ${CSS_PATH}picker.css ${CSS_PATH}editor.css ${CSS_PATH}menu.css ${CSS_PATH}overlay.css ${CSS_PATH}upload.css ${CSS_PATH}progressbar.css ${CSS_PATH}gallery.css ${CSS_PATH}calendar.css > ${CSS_PATH}combined.css

echo "Concatenating scripts"
cat ${JS_LIB_PATH}In2iScripts/In2iScripts.js ${JS_LIB_PATH}prototype.js ${JS_LIB_PATH}swfupload/swfupload.js ${JS_LIB_PATH}In2iScripts/In2iAnimation.js ${JS_LIB_PATH}In2iScripts/In2iInput.js ${JS_LIB_PATH}In2iScripts/In2iDate.js ${JS_LIB_PATH}json2.js ${JS_PATH}In2iGui.js ${JS_PATH}Window.js ${JS_PATH}Formula.js ${JS_PATH}List.js ${JS_PATH}Icons.js ${JS_PATH}Tabs.js ${JS_PATH}ViewStack.js ${JS_PATH}Tabbox.js ${JS_PATH}ObjectList.js ${JS_PATH}Alert.js ${JS_PATH}Button.js ${JS_PATH}Selection.js ${JS_PATH}Toolbar.js ${JS_PATH}ImagePicker.js ${JS_PATH}BoundPanel.js ${JS_PATH}Panel.js ${JS_PATH}RichText.js ${JS_PATH}ImageViewer.js ${JS_PATH}Picker.js ${JS_PATH}Editor.js ${JS_PATH}Menu.js ${JS_PATH}Overlay.js ${JS_PATH}Upload.js ${JS_PATH}ProgressBar.js ${JS_PATH}Gallery.js ${JS_PATH}Calendar.js ${JS_PATH}Layout.js > ${JS_PATH}combined.js

echo "Compressing prototype"
java -jar yuicompressor-2.2.4.jar ../lib/prototype.js --charset UTF-8 -o ../lib/prototype.min.js
echo "Compressing scripts"
java -jar yuicompressor-2.2.4.jar ${JS_PATH}combined.js --charset UTF-8 -o ${JS_PATH}minimized.js
echo "Compressing css"
java -jar yuicompressor-2.2.4.jar ${CSS_PATH}combined.css --charset UTF-8 -o ${CSS_PATH}minimized.css


#java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -a -t=jsdoc-toolkit/templates/jsdoc ${JS_PATH}combined.js 
echo "Documenting"
perl jsdoc/jsdoc.pl -d ${DIR}/../docs ${JS_PATH}combined.js

#iphone 
echo "Compressing iPhone CSS"
java -jar yuicompressor-2.2.4.jar ${IPHONE_PATH}css/iphone.css --charset UTF-8 -o ${IPHONE_PATH}css/iphone.min.css

echo "Building iPhone scripts"
cat ${JS_LIB_PATH}In2iScripts/In2iScripts.js ${JS_LIB_PATH}prototype.js ${JS_PATH}In2iGui.js ${IPHONE_PATH}js/In2iPhone.js > ${IPHONE_PATH}js/combined.js
java -jar yuicompressor-2.2.4.jar ${IPHONE_PATH}js/combined.js --charset UTF-8 -o ${IPHONE_PATH}js/minimized.js

#java -Xmx256m -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -a -t=jsdoc-toolkit/templates/jsdoc -d=../docs2 ${JS_PATH}combined.js 