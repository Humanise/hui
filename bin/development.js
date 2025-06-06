(function() {
  _context = (function() {
    var scripts = document.getElementsByTagName('script');
    var find = 'bin/development.js'
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src');
      if (!src) continue
      var idx = src.indexOf(find)
      if (idx !== -1) {
        return src.substring(0, idx).replace(/\/+$/,'');
      }
    }
  })();

  document.write('<script type="text/javascript" src="'+_context+'/js/hui.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_animation.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_color.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_require.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_parallax.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_store.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_query.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_cookie.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_xml.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_preloader.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/hui_control.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/lib/date.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ui.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Component.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Source.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/DragDrop.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Window.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Form.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/List.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Tabs.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ObjectList.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/DropDown.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Alert.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Button.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Selection.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Toolbar.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ImageInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/BoundPanel.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ImageViewer.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Picker.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Menu.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Overlay.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Upload.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ProgressBar.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Gallery.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Calendar.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/DatePicker.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Layout.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Dock.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Box.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Wizard.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Input.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/InfoView.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Overflow.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/SearchField.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Fragment.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/LocationPicker.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Bar.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/IFrame.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/VideoPlayer.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Segmented.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Flash.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Link.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Links.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/MarkupEditor.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ColorPicker.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/LocationInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/StyleLength.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/DateTimeInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/TokenField.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Checkbox.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Checkboxes.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Radiobuttons.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/NumberInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/TextInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Rendering.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Icon.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ColorInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Columns.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Finder.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Structure.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Slider.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/CodeInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/LinkInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/FontInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/FontPicker.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Split.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/NumberValidator.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/ObjectInput.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Rows.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Pages.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Panel.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Collection.js"></script>');
  document.write('<script type="text/javascript" src="'+_context+'/js/Method.js"></script>');
})()