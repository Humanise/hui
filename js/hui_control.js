hui._controllers = [];

hui.control = function(recipe) {
  /*
  for (variable in recipe) {
    if (recipe.hasOwnProperty(variable)) {
      var found = variable.match(/^([a-z]+)!\s*([a-zA-Z]+)$/);
      if (found) {
        recipe['$' + found[1] + '$' + found[2]] = recipe[variable];
      }
      found = variable.match(/^([a-zA-Z]+)\.([a-zA-Z]+)!$/);
      if (found) {
        recipe['$' + found[2] + '$' + found[1]] = recipe[variable];
      }
    }
  }*/
  if (recipe['#name']) {
    hui._controllers[recipe['#name']] = recipe;
  }
  var ready = recipe.$ready || recipe['ready!'];
  recipe.$ready = undefined;
  recipe['ready!'] = undefined;
  hui.on(function() {
    if (recipe.nodes) {
      recipe.nodes = hui.collect(recipe.nodes, document.body);
    }

    if (recipe.components) {
      for (name in recipe.components) {
        if (recipe.components.hasOwnProperty(name)) {
          recipe.components[name] = hui.ui.get(recipe.components[name]);
        }
      }
    }
    ready && ready.bind(recipe)();
  });
  hui.ui.listen(recipe);
}

hui.controller = function(name) {
  return this._controllers[name];
}