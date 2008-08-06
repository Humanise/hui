#!/bin/bash

CSS_PATH="../css/"

cat ${CSS_PATH}master.css ${CSS_PATH}common.css ${CSS_PATH}tabbox.css ${CSS_PATH}formula.css ${CSS_PATH}layout.css ${CSS_PATH}alert.css ${CSS_PATH}view.css ${CSS_PATH}toolbar.css ${CSS_PATH}window.css ${CSS_PATH}list.css ${CSS_PATH}selection.css ${CSS_PATH}imagepicker.css ${CSS_PATH}boundpanel.css ${CSS_PATH}panel.css ${CSS_PATH}richtext.css ${CSS_PATH}imageviewer.css ${CSS_PATH}picker.css ${CSS_PATH}editor.css ${CSS_PATH}menu.css ${CSS_PATH}overlay.css ${CSS_PATH}upload.css ${CSS_PATH}progressbar.css ${CSS_PATH}gallery.css ${CSS_PATH}calendar.css > ${CSS_PATH}combined.css

cat ../lib/In2iScripts/In2iScripts.js ../lib/prototype.js ../lib/swfupload/swfupload.js ../lib/In2iScripts/In2iAnimation.js ../lib/In2iScripts/In2iInput.js ../lib/In2iScripts/In2iDate.js ../lib/json2.js ../js/In2iGui.js ../js/Window.js ../js/Formula.js ../js/List.js ../js/Icons.js ../js/Tabs.js ../js/ViewStack.js ../js/Tabbox.js ../js/ObjectList.js ../js/Alert.js ../js/Button.js ../js/Selection.js ../js/Toolbar.js ../js/ImagePicker.js ../js/BoundPanel.js ../js/Panel.js ../js/RichText.js ../js/ImageViewer.js ../js/Picker.js ../js/Editor.js ../js/Menu.js ../js/Overlay.js ../js/Upload.js ../js/ProgressBar.js ../js/Gallery.js ../js/Calendar.js > ../js/combined.js

java -jar yuicompressor-2.2.4.jar ../lib/prototype.js --charset UTF-8 -o ../lib/prototype.min.js
java -jar yuicompressor-2.2.4.jar ../js/combined.js --charset UTF-8 -o ../js/minimized.js
java -jar yuicompressor-2.2.4.jar ${CSS_PATH}combined.css --charset UTF-8 -o ${CSS_PATH}minimized.css

#java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -a -t=jsdoc-toolkit/templates/jsdoc ../js/combined.js 
perl jsdoc/jsdoc.pl -d ../docs ../js/combined.js