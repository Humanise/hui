var controller = {
  $ready : function() {
    dark.show();
    dark.move({top: 100, left: 50});
    standard.show();
    standard.move({top: 100, left: 400});
    light.show();
    light.move({top: 100, left: 800});
    flipper.show();
    flipper.move({top: 450, left: 50});
    nonClosable.show()
    nonClosable.move({top: 450, left: 400});
  },
  _busy : false,
  $click$makeBusy : function() {
    this._busy = !this._busy;
    var txt = this._busy ? 'I am busy!' : false;
    dark.setBusy(txt)
    light.setBusy(txt)
    standard.setBusy(txt)
  }
}