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
      name: undefined,
      file: undefined,
      modern: undefined
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
    return new Promise((resolve, reject) => {
      this.parseSchema().then(schema => {
        this.findXslPaths().then(paths => {
          paths.forEach(path => {
            var names = this.extractNamesFromXpath(path.match)
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

class ScriptAnalyzer {

  analyze() {
    return new Promise((resolve, reject) => {
      var components = [];

      var files = fs.readdirSync("js/");
      files.forEach(file => {
        const data = fs.readFileSync( 'js/' + file);
        const js = data.toString();
        let oldSchool = js.match(/hui\.ui\.([A-Z][a-zA-Z]+) = function/)
        let newSchool = js.match(/hui\.component\(\w*['"]([A-Za-z]+)/);
        //if (oldSchool) console.log('  -- old', oldSchool[1])
        //if (newSchool) console.log('  -- new', newSchool[1])
        //if (!newSchool && !oldSchool) console.log('  -- none')
        var name = newSchool || oldSchool;
        if (name) {
          components.push({
            name: name[1],
            file: file
          })
        }
      })
      resolve(components);
    });
  }
}

class StyleAnalyzer {

  analyze() {
    return new Promise((resolve, reject) => {
      var components = [];

      var files = fs.readdirSync("css/");
      files.forEach(file => {
        const data = fs.readFileSync( 'css/' + file);

        var name = newSchool || oldSchool;
        if (name) {
          components.push({
            name: name[1],
            modern: !!newSchool,
            file: file
          })
        }
      })
      resolve(components);
    });
  }
}

class Registry {
  components = [];

  addComponent(params) {
    var c = new Component();
    if (params.js) {
      c.js = params.js;
    }
    if (params.xml) {
      c.xml = params.xml;
    }
    if (params.xsl) {
      c.xsl = params.xsl;
    }
    this.components.push(c)
  }

  mergeXML(xml) {
    xml.components.forEach(toMerge => {
      const found = this.components.find(c => c.js.name && toMerge.xml.name && c.js.name.toLowerCase() == toMerge.xml.name.replace(/\-/g,''))
      if (found) {
        found.xml = toMerge.xml
        found.xsl = toMerge.xsl
      } else {
        this.addComponent({xml:toMerge.xml, xsl:toMerge.xsl})
      }
    })
  }

  mergeScripts(scripts) {
    scripts.forEach(script => {
      const found = this.components.find(c => c.js.name == script.name || (c.xml.name && c.xml.name.replace(/\-/g,'') == script.name.toLowerCase() ))
      if (found) {
        found.js.name = script.name;
        found.js.file = script.file;
        found.js.modern = script.modern;
      } else {
        this.addComponent({js:script})
      }
    })
  }
}

var registry = new Registry();

new SchemaParser().parse().then(schema => {
  registry.mergeXML(schema)
}).then(() => {
  return new ScriptAnalyzer().analyze()
}).then(components => {
  registry.mergeScripts(components);
}).then(() => {
  fs.writeFileSync('info/info.json', JSON.stringify(registry, null, 2));
  console.log('Registry written!');
});




