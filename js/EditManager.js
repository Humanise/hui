(function(_super, _) {

  hui.ui.EditManager = function(options) {
    _super.call(this, options);
    this.options = options;
    this.root = hui.get(options.root);
    this.window = null;
    this.formula = null;
    this.saveButton = null;
    this.deleteButton = null;
    this.cancelButton = null;
    this._collect();
    this._attach();
  }

  hui.ui.EditManager.prototype = {
    _collect : function() {
      var root = this.root;
      var desc = _.findAll('*',root);
      desc.push(root);
      var components = _.ui.getComponents(function(c) {
        return (c.getElement && desc.indexOf(c.getElement()) !== -1);
      })
      for (var i = 0; i < components.length; i++) {
        var cmp = components[i];
        if (_.ui.is(cmp,hui.ui.Window)) {
          this.window = cmp;
        }
        else if (_.ui.is(cmp,hui.ui.Formula)) {
          this.formula = cmp;
        }
        else if (_.ui.is(cmp,hui.ui.Button)) {
          var role = cmp.getRole();
          if (role=='save') {
            this.saveButton = cmp;
          }
          else if (role=='delete') {
            this.deleteButton = cmp;
          }
          else if (role=='cancel') {
            this.cancelButton = cmp;
          }
        }
      }
    },
    _attach : function() {
      var self = this;
      this.cancelButton.listen({
        $click : function() {
          self.end();
        }
      })
      this.formula.listen({
        $submit : function() {
          self._save();
        }
      })
      this.deleteButton.listen({
        $click : function() {
          self._delete();
        }
      })
    },

    end : function() {
      this._reset();
      this.window.hide();
    },
    makeNew : function() {
      this._reset();
      this.window.show();
      this.formula.focus();
      this.deleteButton.disable();
    },
    _save : function() {
      this.window.setBusy(true);
      var self = this;
      var values = this.formula.getValues();
      if (this.objectId !== undefined) {
        values.id = this.objectId;
      }
      hui.ui.request({
        url : this.options.save.url,
        json : {data:values},
        $success : function() {
          self._saveSuccess();
        },
        $finally : function() {
          self.window.setBusy(false);
        }
      });
    },
    _reset : function() {
      this.formula.reset();
      this.objectId = undefined;
    },
    _saveSuccess : function() {
      var create = this.objectId === undefined;
      this.end();
      this.fire(create ? 'created' : 'updated');
      this.fire('changed');
    },

    edit : function(id) {
      this._reset();
      this.window.setBusy(true);
      this.window.show();
      var self = this;
      hui.ui.request({
        message : {start:{en:'Loading...',da:'Henter...'},delay:300},
        parameters : {id:id},
        url : this.options.read.url,
        $object : function(obj) {
          self.objectId = obj.id;
          self.formula.setValues(obj);
          self.deleteButton.setEnabled(true);
          self.window.show();
          self.formula.focus();
        },
        $finally : function() {
          self.window.setBusy(false);
        }
      });
    },

    _delete : function(id) {
      var self = this;
      hui.ui.request({
        message : {start:{en:'Deleting...',da:'Sletter...'},delay:300},
        parameters : {id:this.objectId},
        url : this.options.remove.url,
        $success : function(obj) {
          self.end();
          self.fire('removed');
          self.fire('changed');
        }
      });
    }
  }



  hui.extend(hui.ui.EditManager, _super);
})(hui.ui.Component, hui)
