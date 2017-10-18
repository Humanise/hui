(function (_super) {

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.StyleEditor = function(options) {
    _super.call(this, options);
    this.value = null;
    this.components = options.components;
    this._attach();
  }

  hui.ui.StyleEditor.create = function(options) {
    options = options || {};
    var element = hui.build('div.hui_styleeditor',{html:'<div class="hui_styleeditor_list"></div>'});
    options.element = element;
    return new hui.ui.StyleEditor(options);
  }

  hui.ui.StyleEditor.prototype = {
    nodes : {
      list : '.hui_styleeditor_list'
    },
    _attach : function() {
      var self = this;
      hui.on(this.element, 'click', function(e) {
        e = hui.event(e);
        var query = e.findByClass('hui_styleeditor_query');
        if (query) {
          self.editQuery(parseInt(query.getAttribute('data-index'), 10));
        }
      })
      var button = hui.ui.Button.create({text:'Add', small:true});
      this.element.appendChild(button.element);
      button.listen({$click:this.add.bind(this)})
    },
    editQuery : function(index) {
      var query = this.value.queries[index];
      var win = hui.ui.Window.create({
        title : this._getQueryDescription(query),
        width: 400,
        padding: 10
      });
      var self = this;
      var overflow = hui.ui.Overflow.create({height: 400});
      win.add(overflow);
      hui.each(this.components,function(component) {
        var form = hui.ui.Formula.create();
        form.buildGroup({above:false},[{
          type : 'DropDown', label: 'Display:', options : {key:'display', value:'', items:[
            {value:'',text:'Unchanged'}, {value:'block',text:'Block'}, {value:'flex',text:'Flex'}
          ]}
        },{
          type : 'DropDown', label: 'Flex direction:', options : {key:'flex-direction', value:'', items:[
            {value:'',text:'Unchanged'},
            {value:'row',text:'Row'},{value:'row-reverse',text:'Row reverse'},{value:'Column',text:'column'},{value:'column-reverse',text:'Column reverse'},
            {value:'inherit',text:'Inherit'}, {value:'initial',text:'Initial'}, {value:'unset',text:'Unset'}, {value:'revert',text:'Revert'}
          ]}
        },{
          type : 'StyleLength', label: 'Width:', options : {key:'width', value:''}
        },{
          type : 'ColorInput', label: 'Text color:', options : {key:'color', value:''}
        },{
          type : 'StyleLength', label: 'Max width:', options : {key:'max-width', value:''}
        },{
          type : 'StyleLength', label: 'Min width:', options : {key:'min-width', value:''}
        }])
        overflow.add(hui.build('div',{text:component.description}));
        form.setValues(self._getComponentValues(query, component));
        overflow.add(form);
        var values = {};
        form.listen({
          $valuesChanged : function(values) {
            var rules = self._getRulesFor({query:index, component:component.name});
            hui.log(component.name, values, rules);
            hui.each(rules,function(rule) {
              if (values[rule.name]!==undefined) {
                rule.value = values[rule.name];
                values[rule.name] = undefined;
              }
            })
            hui.each(values,function(key,value) {
              // TODO We filter out unnamed (could be text filed inside color or other stuff)
              if (key.indexOf('unnamed')!==0 && !hui.isBlank(value)) {
                rules.push({name:key, value:value});
              }
            })
            self.fireValueChange();
          }
        })
      })
      win.show();
    },
    _getComponentValues : function(query,component) {
      var values = {};
      if (query.components) {
        var found = query.components.find(function(other) {return other.name == component.name});
        if (found) {
          found.rules.forEach(function(rule) {
            values[rule.name] = rule.value;
          })
        }
      }
      return values;
    },
    add : function() {
      this.value.queries.push({components:[]});
      this.draw();
    },
    setValue : function(value) {
      this.value = value;
      this.draw();
    },
    _getRulesFor : function(params) {
      var query = this.value.queries[params.query];
      var comps = query.components;
      for (var i = 0; i < comps.length; i++) {
        if (comps[i].name == params.component) {
          if (!comps[i].rules) {
            comps[i].rules = [];
          }
          return comps[i].rules;
        }
      }
      var rules = [];
      query.components.push({name:params.component, rules:rules})
      return rules;
    },
    draw : function() {
      this.nodes.list.innerHTML = '';
      if (this.value && this.value.queries) {
        for (var i = 0; i < this.value.queries.length; i++) {
          var query = this.value.queries[i];
          hui.build('div.hui_styleeditor_query',{text:this._getQueryDescription(query), parent: this.nodes.list, 'data-index':i})
        }
      }
    },
    _getQueryDescription : function(query) {
      var text = [];
      var props = ['max-width','min-width','max-height','min-height'];
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (query[prop]) {
          text.push(prop + ': ' + query[prop]);
        }
      }
      if (!text.length) {
        text.push('Anything')
      }
      return text.join(', ');
    },
    $$childSizeChanged : function() {
    },
    $$layout : function() {
    }
  }

  hui.extend(hui.ui.StyleEditor, _super);

})(hui.ui.Component);