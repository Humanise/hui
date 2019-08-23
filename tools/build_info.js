var fs = require('fs');
var dom = require('xmldom').DOMParser
var xpath = require('xpath')
var ns = 'http://www.w3.org/2001/XMLSchema'

//var parser = require('xml2json');

class Schema {

  constructor() {
    this.components = [];
    this.stray = [];
  }

  addComponent(component) {
    this.components.push(component);
  }
}

class Component {

  constructor() {
    this.xml = {
      name: null,
      _type: null,
      attributes: []
    }
    this.js = {
      name: null
    }
    this.xsl = []
  }

}

class SchemaParser {

  _getTypesByName(document) {
    var mapping = {};
    var allTypes = document.getElementsByTagNameNS(ns,'complexType');
    for (var i = 0; i < allTypes.length; i++) {
      mapping[allTypes.item(i).getAttribute('name')] = allTypes.item(i);
    }
    return mapping;
  }

  _findChildElements(element, nodeName) {
    var found = [];
    var ch = element.childNodes;
    for (var i = 0; i < ch.length; i++) {
      var child = ch.item(i);
      if (child.localName == nodeName) {
        found.push(child);
      }
    }
    return found;
  }

  _extractComponentsFromSchema(document) {
    var types = this._getTypesByName(document);
    var schema = new Schema();
    var elements = this._findChildElements(document.documentElement,'element');
    elements = Array.prototype.slice.call(document.getElementsByTagNameNS(ns,'element'))
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var name = element.getAttribute('name');
      var type = element.getAttribute('type');
      if (schema.components.find((c) => { return c.xml.name == name && c.xml._type == type })) {
        console.log('Skipping: ', name, type)
        continue;
      }
      //var types = []//xpath.select('//complexType[@name=\'' + type + '\']', document);
      var component = new Component();
      component.xml.name = name;
      component.xml._type = type;
      var typeNode = types[type];
      if (typeNode) {
        var attributes = this._findChildElements(typeNode,'attribute');
        component.xml.attributes = attributes.map(function(attr) {
          return {
            'name': attr.getAttribute('name'),
            'type': attr.getAttribute('type')
          }
        });
      }
      schema.addComponent(component)
    }
    return schema;
  }

  parse() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.parseSchema().then((schema) => {
        self.findJavaScriptControllers().then((ctrls) => {
          ctrls.forEach((ctrl) => {
            var found = false;
            schema.components.forEach((component) => {
              if (component.xml.name && component.xml.name.replace(/\-/g,'') == ctrl.toLowerCase()) {
                component.js.name = ctrl;
                found = true;
              }
            });
            if (!found) {
              var x = new Component();
              x.js.name = ctrl;
              schema.addComponent(x);
            }
          })
          self.findXslPaths().then((paths) => {
            paths.forEach((path) => {
              var names = self.extractNamesFromXpath(path.match)
              var found = false;
              schema.components.forEach((component) => {
                if (component.xml.name) {
                  if (names.indexOf(component.xml.name) !== -1) {
                    component.xsl.push(path)
                    found = true;
                  }
                }
              })
              if (!found) {
                var stray = new Component();
                stray.xsl.push(path);
                schema.components.push(stray);
                schema.stray.push(path);
              }
            });
            resolve(schema);
          })
        })
      })
    })
  }

  extractNamesFromXpath(xpath) {
    return xpath.replace(/\[[^\]]+]/g, "").split('/').filter((word) => {return word.trim().length > 0});
  }

  parseSchema() {
    var self = this;
    return new Promise(function(resolve, reject) {
      fs.readFile( 'xslt/schema.xsd', function(error, data) {
        if (error) {
          reject(error)
        } else {
          var doc = new dom().parseFromString(data.toString());
          resolve(self._extractComponentsFromSchema(doc));
        }
      });
    })
  }

  findJavaScriptControllers() {
    return new Promise(function(resolve, reject) {
      fs.readdir('js/', function (error, files) {
        var files = files.map(function(name) {
          var found = name.match(/[A-Z][A-Za-z]+/);
          return found ? found[0] : null
        }).filter(function(name) { return name!==null});
        resolve(files);
      })
    })
  }

  findXslPaths() {
    var self = this;
    return new Promise(function(resolve, reject) {
      fs.readFile( 'xslt/gui.xsl', function(error, data) {
        if (error) {
          reject(error)
        } else {
          var doc = new dom().parseFromString(data.toString());
          resolve(self._parseXsl(doc));
        }
      });
    })
  }
  _parseXsl(doc) {
    var found = [];
    var templates = doc.getElementsByTagNameNS('http://www.w3.org/1999/XSL/Transform','template');
    for (var i = 0; i < templates.length; i++) {
      var template = templates.item(i);
      var match = template.getAttribute('match');
      if (!match) continue;
      var parts = match.replace(/[a-z]+:/g,'').split('|').map((part) => {return part.trim()});
      parts.forEach((part) => {
        found.push({
          match: part
        })
      })
    }
    return found;
  }
}

new SchemaParser().parse().then((schema) => {
  console.log(schema);
  fs.writeFile('info/info.json', JSON.stringify(schema, null, 2), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
})
