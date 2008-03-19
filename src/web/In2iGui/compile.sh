#!/usr/bin/env bash

cat css/master.css css/master.css css/tabbox.css css/formula.css css/layout.css css/alert.css css/view.css css/toolbar.css css/window.css css/list.css css/selection.css css/imagepicker.css css/boundpanel.css > css/combined.css

cat lib/In2iScripts/In2iScripts.js lib/In2iScripts/In2iAnimation.js lib/In2iScripts/In2iInput.js lib/json2.js js/In2iGui.js js/Window.js js/Formula.js js/List.js js/Icons.js js/Tabs.js js/ViewStack.js js/Tabbox.js js/ObjectList.js js/Alert.js js/Button.js js/Selection.js js/Toolbar.js js/ImagePicker.js js/BoundPanel.js > js/combined.js

java -jar ~/Udvikling/yuicompressor-2.2.4/build/yuicompressor-2.2.4.jar js/combined.js -o js/minimized.js