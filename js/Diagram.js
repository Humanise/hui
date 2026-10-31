/** A diagram
 * @constructor
 */
hui.ui.Diagram = function(options) {
  this.options = hui.override({layout: 'D3'}, options);
  this.name = options.name;
  this.nodes = [];
  this.lines = [];
  this.data = {};
  this.translation = {x:0,y:0};
  this.element = hui.get(options.element);
  this.width = this.element.clientWidth;
  this.height = this.element.clientHeight;
  this.layout = hui.ui.Diagram[this.options.layout];
  this.layout.diagram = this;
  hui.ui.extend(this);
  if (options.source) {
    options.source.listen(this);
  }
  this._init();
};

hui.ui.Diagram.create = function(options) {
  options = hui.override({width: null, height: null}, options);

  options.element = hui.build('div', {
    'class': 'hui_diagram',
    parent: options.parent,
    style: {height: options.height + 'px'}
  });

  return new hui.ui.Diagram(options);
};

hui.ui.Diagram.prototype = {
  _init : function() {
    this.background = hui.ui.Drawing.create({
      width: this.width || 0,
      height: this.height || 0
    });
    this.element.appendChild(this.background.element);
    this.fire('added');
  },
  $$layout : function() {
    var newWidth = this.element.clientWidth;
    var newHeight = this.element.clientHeight;
    if (newWidth === this.width && newHeight === this.height) {
      // Only re-layout if size actually changed
      return;
    }
    this.width = newWidth;
    this.height = newHeight;
    this.background.setSize(this.width,this.height);
    this.layout.resize();
    this.layout.resume();
  },
  _getMagnet : function(from,to,node) {
    var margin = 1;
    var size = node.getSize();
    var center = node.getCenter();
    var topLeft = {
        x : center.x - size.width/2 - margin,
        y : center.y - size.height/2 - margin
      },
      bottomRight = {
        x : topLeft.x + size.width + margin * 2,
        y : topLeft.y + size.height + margin * 2
      };
    var hits = [];
    hits = hui.geometry.intersectLineRectangle(from,to,topLeft,bottomRight);
    if (hits.length>0) {
      return hits[0];
    }
    return to;
  },

  // Data ...

  /** @private */
  $objectsLoaded : function(data) {
    this.setData(data);
  },
  setData : function(data) {
    this.data = data;
    this.clear();
    var nodes = data.nodes,
      lines = data.lines || data.edges;
    if (!nodes || !lines) {
      return;
    }
    var i;
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].type=='icon') {
        this.addIcon(nodes[i]);
      } else {
        this.addBox(nodes[i]);
      }
    }
    for (i = 0; i < lines.length; i++) {
      this.addLine(lines[i]);
    }
    if (this.layout.loaded) {
      this.layout.populate();
    } else {
      this.play();
    }
  },
  /** Deprecated */
  play : function() {
    this.layout.start();
  },
  resume : function() {
    if (this.layout.resume) { this.layout.resume(); }
  },
  expand : function() {
    if (this.layout.expand) { this.layout.expand(); }
  },
  contract : function() {
    if (this.layout.contract) { this.layout.contract(); }
  },
  /** @private */
  $sourceShouldRefresh : function() {
    return hui.dom.isVisible(this.element);
  },
  /** @private */
  $visibilityChanged : function() {
    if (hui.dom.isVisible(this.element)) {
      this.width = this.element.clientWidth;
      this.height = this.element.clientHeight;
      this.background.setSize(this.width,this.height);
      if (this.options.source) {
        this.options.source.refreshFirst();
      }
    }
  },
  clear : function() {
    this.layout.clear();
    this.selection = null;
    this.background.clear();
    this.lines = [];
    for (var i = this.nodes.length - 1; i >= 0; i--) {
      hui.dom.remove(this.nodes[i].element);
    }
    this.nodes = [];
    var lines = hui.get.byClass(this.element,'hui_diagram_line_label');
    for (var j = lines.length - 1; j >= 0; j--) {
      hui.dom.remove(lines[j]);
    }
  },

  addBox : function(options) {
    var box = hui.ui.Diagram.Box.create(options,this);
    this.add(box);
  },

  addIcon : function(options) {
    var box = hui.ui.Diagram.Icon.create(options,this);
    this.add(box);
  },
  add : function(widget) {
    var e = widget.element;
    this.element.appendChild(e);
    widget.setCenter({x: this.width / 2, y : this.height / 2});
    this.nodes.push(widget);
  },
  addLine : function(options) {
    var from = this.getNode(options.from),
      to = this.getNode(options.to);
    if (from === null || to === null) {
      hui.log('Unable to build line...');
      hui.log(options);
      return;
    }
    var fromCenter = this._getCenter(from),
      toCenter = this._getCenter(to);
    var lineNode = this.background.addLine({
        from: fromCenter,
        to: toCenter,
        color: options.color || '#999' ,end:{}
      }),
      line = {
        from: options.from,
        fromNode : from,
        to: options.to,
        toNode : to,
        node: lineNode
      };
    if (options.label) {
      line.label = hui.build('span',{
        parent: this.element,
        'class': 'hui_diagram_line_label',
        text: options.label
      });
      this._updateLine(line);
    }
    this.lines.push(line);
  },


  _getCenter : function(widget) {
    return widget.getCenter();
  },
  getNode : function(id) {
    return this._getNode(id,this.nodes);
  },
  getDataNode : function(id) {
    return this._getNode(id,this.data.nodes);
  },
  _getNode : function(id,nodes) {
    if (nodes) {
      for (var i=0; i < nodes.length; i++) {
        if (nodes[i].id == id) {
          return nodes[i];
        }
      }
    }
    return null;
  },

  // Drawing...

  _updateLine : function(line) {
    if (!line.label) {
      return;
    }
    var from = line.node.getFrom(),
      to = line.node.getTo(),
      label = line.label;
    var middle = { x : from.x+(to.x-from.x)/2, y : from.y+(to.y-from.y)/2 };
    //var deg = Math.atan((from.y-to.y) / (from.x-to.x)) * 180/Math.PI;
    line.label.style.webkitTransform='rotate('+line.node.getDegree()+'deg)';
    //line.label.innerHTML = Math.round(hui.geometry.distance(from,to));
    var width = Math.round(hui.geometry.distance(from,to)-30);
    // TODO: cache width + height
    var w = label.huiWidth = label.huiWidth || label.clientWidth;
    var h = label.huiHeight = label.huiHeight || label.clientHeight;
    w = Math.min(w,width);
    hui.style.set(line.label,{
      left : (middle.x - w / 2) + 'px',
      top : (middle.y - h / 2) + 'px',
      maxWidth : Math.max(0, width) + 'px',
      visibility : width > 10 ? '' : 'hidden'
    });
  },
  __nodeMoved : function(widget) {
    var center = this._getCenter(widget);
    for (var i=0; i < this.lines.length; i++) {
      var line = this.lines[i];
      var magnet, magnet2;
      if (line.from == widget.id) {
        magnet = this._getMagnet(line.node.getTo(),center,widget);
        line.node.setFrom(magnet);
        magnet2 = this._getMagnet(center,this._getCenter(line.toNode),line.toNode);
        line.node.setTo(magnet2);
        this._updateLine(line);
      }
      else if (line.to == widget.id) {
        magnet = this._getMagnet(line.node.getFrom(),center,widget);
        line.node.setTo(magnet);
        magnet2 = this._getMagnet(center,this._getCenter(line.fromNode),line.fromNode);
        line.node.setFrom(magnet2);
        this._updateLine(line);
      }
    }
  },
  __select : function(widget) {
    if (this.selection) {
      this.selection.setSelected(false);
    }
    this.selection = widget;
    this.selection.setSelected(true);
  },
  __nodeOpen : function(widget) {
    this.fire('open',this.getDataNode(widget.id));
  }
};

hui.ui.Diagram.D3 = {
  loaded : false,
  diagram : null,

  _load : function() {
    hui.require(hui.ui.getURL('lib/d3.v3/d3.v3.min.js'),function() {
      this.loaded = true;
      this.start();
    }.bind(this));
  },

  resize : function() {
    if (this.layout) {
      this.layout.size([this.diagram.width,this.diagram.height]);
    }
  },

  start : function() {
    if (!this.loaded) {
      this._load();
      return;
    }
    var diagram = this.diagram,
      nodes = diagram.nodes,
      lines = diagram.lines,
      width = diagram.element.clientWidth,
      height = diagram.element.clientHeight;

    for (var i=0; i < lines.length; i++) {
      lines[i].source = this._findById(nodes,lines[i].from);
      lines[i].target = this._findById(nodes,lines[i].to);
    }

    var force = this.layout = d3.layout.force()
            .linkDistance(100)
            .friction(0.9)
            .gravity(0.1)
            .theta(0.3)
            .linkStrength(0.2)
      .charge(-1000)
      .distance(100)
      .nodes(this.diagram.nodes)
      .links(this.diagram.lines)
      .size([width, height]);

    var ticker = function() {
      var sel = diagram.selection ? diagram.selection.id : null;
      var nodes = force.nodes(),
        links = force.links();
      for (var i=0; i < nodes.length; i++) {
        var node = diagram.nodes[nodes[i].index];
        if (node.id!=sel) {
          node.setCenter(nodes[i]);
        }
      }
      for (var j=0; j < links.length; j++) {
        var link = links[j];
        var source = link.source,
          sourceCenter = link.source.center;
        var target = link.target,
          targetCenter = link.target;
        if (source==diagram.selection) {
          sourceCenter = diagram._getCenter(diagram.selection);
        }
        if (target==diagram.selection) {
          targetCenter = diagram._getCenter(diagram.selection);
        }
        var from = diagram._getMagnet(sourceCenter,targetCenter,source);
        var to = diagram._getMagnet(targetCenter,sourceCenter,target);
        link.node.setFrom(from);
        link.node.setTo(to);
        diagram._updateLine(link);
      }
    };
    force.start();
    force.gravity(0.5);
    for (var k=0; k < 10000; k++) {
      force.tick();
    }
    force.gravity(0.1);

    force.on("tick", ticker);

    force.start();
  },

  resume : function() {
    if (this.layout) { this.layout.start(); }
  },
  expand : function() {
    if (this.layout) {
      this.layout.linkDistance(this.layout.linkDistance() * 1.3);
      this.layout.charge(this.layout.charge() * 1.3);
      this.layout.start();
    }
  },
  contract : function() {
    if (this.layout) {
      this.layout.linkDistance(Math.max(0,this.layout.linkDistance() * 0.9));
      this.layout.charge(Math.min(0,this.layout.charge() * 0.9));
      this.layout.start();
    }
  },

  _findById : function(nodes,id) {
    for (var i = nodes.length - 1; i >= 0; i--){
      if (nodes[i].id===id) {
        return i;
      }
    }
    return null;
  },
  _convert : function(data) {
    var nodes = data.nodes;
    data.links = data.edges;
    for (var i = data.links.length - 1; i >= 0; i--){
      var link = data.links[i];
      link.source = this._findById(nodes,link.from);
      link.target = this._findById(nodes,link.to);
    }
    return data;
  },
  populate : function() {
    this.start();
  },
  clear : function() {
    if (this.layout) {
      this.layout.stop();
    }
  }

};

hui.ui.Diagram.Force = {
  diagram : null,
  _running : false,
  _alpha : 0,
  _temperature : 0,
  _cooling : 0.95,
  _minTemperature : 0.08,
  _velocityBlend : 0.88,
  _maxAcceleration : 7,
  _edgeBounce : 0.12,
  _stateById : null,
  _nodes : null,
  _links : null,
  _size : [0,0],
  _linkDistance : 200,
  _friction : 0.7,
  _gravity : 0.00150,
  _linkStrength : 0.2,
  _charge : -200,
  _boundsPadding : 10,
  _collisionPadding : 10,
  _collisionStrength : 0.55,
  _dynamic : null,

  _nodeKey : function(node,index) {
    return node.id!==undefined ? String(node.id) : String(index);
  },

  _isValidCenter : function(center) {
    return center && isFinite(center.x) && isFinite(center.y);
  },

  _clamp : function(value,min,max) {
    return Math.max(min, Math.min(max, value));
  },

  _getNodePadding : function(node) {
    if (!node || !node.getSize) {
      return this._boundsPadding;
    }
    var size = node.getSize();
    var radius = Math.max(size.width || 0, size.height || 0) / 2;
    return Math.max(this._boundsPadding, radius + 6);
  },

  _getNodeRadius : function(node) {
    if (!node || !node.getSize) {
      return this._collisionPadding;
    }
    var size = node.getSize();
    var radius = Math.max(size.width || 0, size.height || 0) / 2;
    return radius + this._collisionPadding;
  },

  _seedPosition : function(i,n,width,height) {
    var centerX = width / 2;
    var centerY = height / 2;
    if (n <= 1) {
      return {x: centerX, y: centerY};
    }
    var golden = Math.PI * (3 - Math.sqrt(5));
    var t = (i + 0.5) / n;
    var spread = Math.min(width, height) * 0.46;
    var r = Math.sqrt(t) * Math.max(20, spread);
    var angle = i * golden;
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r
    };
  },


  _ensureNodeSpread : function(nodes,width,height) {
    if (!nodes.length) {
      return;
    }
    var centerX = width / 2;
    var centerY = height / 2;
    var closeCount = 0;
    var threshold = Math.max(35, Math.min(width, height) * 0.08);
    for (var i = 0; i < nodes.length; i++) {
      var c = nodes[i].getCenter();
      var dx = c.x - centerX;
      var dy = c.y - centerY;
      if (Math.sqrt(dx * dx + dy * dy) < threshold) {
        closeCount++;
      }
    }
    if (closeCount < Math.max(2, Math.floor(nodes.length * 0.7))) {
      return;
    }
    for (var j = 0; j < nodes.length; j++) {
      nodes[j].setCenter(this._seedPosition(j, nodes.length, width, height));
      if (this._stateById[nodes[j]._forceKey]) {
        this._stateById[nodes[j]._forceKey].vx = 0;
        this._stateById[nodes[j]._forceKey].vy = 0;
      }
    }
  },

  _ensureSimulation : function() {
    var diagram = this.diagram;
    var nodes = this._nodes = diagram.nodes || [];
    this._links = diagram.lines || [];
    var width = diagram.element.clientWidth || diagram.width || 0;
    var height = diagram.element.clientHeight || diagram.height || 0;
    this._size = [width, height];

    var centerX = width / 2;
    var centerY = height / 2;
    var oldState = this._stateById || {};
    this._stateById = {};

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var key = this._nodeKey(node, i);
      var center = diagram._getCenter(node);
      var nearCenter = this._isValidCenter(center) &&
        Math.abs(center.x - centerX) < 1 && Math.abs(center.y - centerY) < 1;
      if (!this._isValidCenter(center) || nearCenter) {
        center = this._seedPosition(i, nodes.length, width, height);
        node.setCenter(center);
      }
      node._forceKey = key;
      var state = oldState[key] || {vx: 0, vy: 0};
      this._stateById[key] = {vx: state.vx || 0, vy: state.vy || 0};
    }

    for (var j = 0; j < this._links.length; j++) {
      var link = this._links[j];
      link.source = link.fromNode || this._findById(nodes, link.from);
      link.target = link.toNode || this._findById(nodes, link.to);
    }
    
    this._ensureNodeSpread(nodes, width, height);
  },

  _tick : function() {
    if (!this._running) {
      return;
    }
    //this._ensureSimulation();
    this._simulate();
    this._render();
    this._alpha *= 0.985;
    this._temperature = Math.max(this._minTemperature, this._temperature * this._cooling);
    if (this._alpha < 0.005 || (this._alpha < 0.03 && this._temperature <= this._minTemperature + 0.01)) {
      this._running = false;
      return;
    }
    hui.onDraw(this._tick.bind(this));
  },

  _simulate : function() {
    var nodes = this._nodes;
    var links = this._links;
    var width = this._size[0];
    var height = this._size[1];
    var n = nodes.length;
    if (!n) {
      return;
    }

    var centerX = width / 2;
    var centerY = height / 2;
    var dyn = this._dynamic || {
      linkDistance: this._linkDistance,
      charge: this._charge,
      gravity: this._gravity,
      friction: this._friction,
      linkStrength: this._linkStrength
    };
    var repulsion = Math.max(1, Math.abs(dyn.charge)) * this._alpha;
    var accelX = [];
    var accelY = [];

    for (var i = 0; i < n; i++) {
      accelX[i] = 0;
      accelY[i] = 0;
    }

    for (var a = 0; a < n; a++) {
      var aCenter = nodes[a].getCenter();
      var aRadius = this._getNodeRadius(nodes[a]);
      for (var b = a + 1; b < n; b++) {
        var bCenter = nodes[b].getCenter();
        var dx = bCenter.x - aCenter.x;
        var dy = bCenter.y - aCenter.y;
        if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
          dx = (((a + 1) * 73856093 + (b + 1) * 19349663) % 7 - 3) * 0.01;
          dy = (((a + 1) * 83492791 + (b + 1) * 2971215073) % 7 - 3) * 0.01;
        }
        var distSq = dx * dx + dy * dy + 0.01;
        var dist = Math.sqrt(distSq);
        var force = repulsion / distSq;
        var fx = dx / dist * force;
        var fy = dy / dist * force;

        // Explicit collision separation so nodes cannot settle on top of each other.
        var minDist = aRadius + this._getNodeRadius(nodes[b]);
        if (dist < minDist) {
          var overlap = minDist - dist;
          var collisionForce = overlap * this._collisionStrength;
          fx += dx / dist * collisionForce;
          fy += dy / dist * collisionForce;
        }

        accelX[a] -= fx;
        accelY[a] -= fy;
        accelX[b] += fx;
        accelY[b] += fy;
      }
    }

    for (var l = 0; l < links.length; l++) {
      var link = links[l];
      var source = link.source;
      var target = link.target;
      if (!source || !target || source === target) {
        continue;
      }
      var si = source.index;
      var ti = target.index;
      if (si===undefined || ti===undefined || si===null || ti===null) {
        si = this._findIndex(nodes, source);
        ti = this._findIndex(nodes, target);
      }
      if (si < 0 || ti < 0) {
        continue;
      }
      var sCenter = source.getCenter();
      var tCenter = target.getCenter();
      var lx = tCenter.x - sCenter.x;
      var ly = tCenter.y - sCenter.y;
      var length = Math.sqrt(lx * lx + ly * ly) || 0.0001;
      var stretch = length - dyn.linkDistance;
      var linkForce = stretch * dyn.linkStrength * this._alpha;
      var lfx = lx / length * linkForce;
      var lfy = ly / length * linkForce;
      accelX[si] += lfx;
      accelY[si] += lfy;
      accelX[ti] -= lfx;
      accelY[ti] -= lfy;
    }

    for (var i2 = 0; i2 < n; i2++) {
      var node = nodes[i2];
      var state = this._stateById[node._forceKey] || {vx: 0, vy: 0};
      var pos = node.getCenter();

      if (node.fixed) {
        state.vx = 0;
        state.vy = 0;
        this._stateById[node._forceKey] = state;
        continue;
      }

      accelX[i2] += (centerX - pos.x) * dyn.gravity * this._alpha;
      accelY[i2] += (centerY - pos.y) * dyn.gravity * this._alpha;
      var ax = this._clamp(accelX[i2], -this._maxAcceleration, this._maxAcceleration);
      var ay = this._clamp(accelY[i2], -this._maxAcceleration, this._maxAcceleration);
      var nextVx = (state.vx + ax) * dyn.friction;
      var nextVy = (state.vy + ay) * dyn.friction;
      state.vx = state.vx * this._velocityBlend + nextVx * (1 - this._velocityBlend);
      state.vy = state.vy * this._velocityBlend + nextVy * (1 - this._velocityBlend);

      // Cooling cap with a soft knee to avoid abrupt stiffness.
      var speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
      if (speed > this._temperature) {
        var excess = speed - this._temperature;
        var limited = this._temperature + excess * 0.2;
        var scale = limited / (speed || 1);
        state.vx *= scale;
        state.vy *= scale;
      }

      var x = pos.x + state.vx;
      var y = pos.y + state.vy;
      var pad = this._getNodePadding(node);

      if (x < pad) {
        x = pad;
        state.vx *= -this._edgeBounce;
      } else if (x > width - pad) {
        x = Math.max(pad, width - pad);
        state.vx *= -this._edgeBounce;
      }
      if (y < pad) {
        y = pad;
        state.vy *= -this._edgeBounce;
      } else if (y > height - pad) {
        y = Math.max(pad, height - pad);
        state.vy *= -this._edgeBounce;
      }

      node.setCenter({x: x, y: y});
      this._stateById[node._forceKey] = state;
    }
  },

  _render : function() {
    var diagram = this.diagram;
    var links = this._links || (diagram ? diagram.lines : []);
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var source = link.source;
      var target = link.target;
      if (!source || !target) {
        continue;
      }
      var sourceCenter = source.getCenter();
      var targetCenter = target.getCenter();
      var from = diagram._getMagnet(sourceCenter, targetCenter, source);
      var to = diagram._getMagnet(targetCenter, sourceCenter, target);
      link.node.setFrom(from);
      link.node.setTo(to);
      diagram._updateLine(link);
    }
  },

  resize : function() {
    this.size([this.diagram.width, this.diagram.height]);
  },

  start : function() {
    if (!this.diagram) {
      return;
    }
    this._ensureSimulation();
    if (!this.diagram.nodes.length) {
      this._render();
      return;
    }
    this._alpha = 1;
    this._temperature = Math.max(8, Math.min(Math.max(this._size[0], this._size[1]) * 0.08, 60));
    if (!this._running) {
      this._running = true;
      this._tick();
    }
  },

  resume : function() {
    this.start();
  },
  expand : function() {
    this.linkDistance(this.linkDistance() * 1.3);
    this.charge(this.charge() * 1.3);
    this.start();
  },
  contract : function() {
    this.linkDistance(Math.max(0, this.linkDistance() * 0.9));
    this.charge(Math.min(0, this.charge() * 0.9));
    this.start();
  },

  size : function(value) {
    if (!arguments.length) {
      return this._size;
    }
    this._size = value;
    return this;
  },

  linkDistance : function(value) {
    if (!arguments.length) {
      return this._linkDistance;
    }
    this._linkDistance = value;
    return this;
  },

  friction : function(value) {
    if (!arguments.length) {
      return this._friction;
    }
    this._friction = value;
    return this;
  },

  gravity : function(value) {
    if (!arguments.length) {
      return this._gravity;
    }
    this._gravity = value;
    return this;
  },

  linkStrength : function(value) {
    if (!arguments.length) {
      return this._linkStrength;
    }
    this._linkStrength = value;
    return this;
  },

  charge : function(value) {
    if (!arguments.length) {
      return this._charge;
    }
    this._charge = value;
    return this;
  },

  _findIndex : function(nodes, node) {
    for (var i = nodes.length - 1; i >= 0; i--) {
      if (nodes[i] === node) {
        return i;
      }
    }
    return -1;
  },

  _findById : function(nodes,id) {
    for (var i = nodes.length - 1; i >= 0; i--){
      if (nodes[i].id===id) {
        return nodes[i];
      }
    }
    return null;
  },
  _convert : function(data) {
    var nodes = data.nodes;
    data.links = data.edges;
    for (var i = data.links.length - 1; i >= 0; i--){
      var link = data.links[i];
      link.source = this._findById(nodes,link.from);
      link.target = this._findById(nodes,link.to);
    }
    return data;
  },
  populate : function() {
    this.start();
  },
  clear : function() {
    this._running = false;
    this._alpha = 0;
    this._temperature = 0;
    this._nodes = null;
    this._links = null;
    this._stateById = null;
  }

};


/** A box in a diagram
 * @constructor
 */
hui.ui.Diagram.Box = function(options) {
  this.options = options;
  this.id = options.id;
  this.name = options.name;
  this.element = hui.get(options.element);
  this.center = {};
  this.size = null;
  hui.ui.extend(this);
  hui.ui.Diagram.util.enableDragging(this);
};

hui.ui.Diagram.Box.create = function(options,diagram) {
  options = hui.override({title: 'Untitled', diagram: diagram}, options);
  var e = options.element = hui.build('div', {'class': 'hui_diagram_box'});
  hui.build('h1',{text: options.title, parent: e});
  if (options.properties) {
    var table = hui.build('table', {parent: e});
    for (var i=0; i < options.properties.length; i++) {
      var p = options.properties[i];
      var tr = hui.build('tr',{parent: table});
      hui.build('th',{parent: tr,text: p.label});
      var td = hui.build('td',{parent: tr,text: p.value || ''});
      if (p.hint) {
        hui.build('em',{parent: td, text: p.hint});
      }
    }
  }
  return new hui.ui.Diagram.Box(options);
};

hui.ui.Diagram.Box.prototype = {
  _syncSize : function() {
    if (this.size) {
      return;
    }
    this.size = {
      width : this.element.offsetWidth,
      height : this.element.offsetHeight
    };
  },
  getSize : function() {
    this._syncSize();
    return this.size;
  },
  getCenter : function() {
    return this.center;
  },
  setCenter : function(point) {
    this._syncSize();
    this.center = {x : point.x, y : point.y};
    this._updateCenter();
  },
  _updateCenter : function() {
    this.element.style.top = Math.round(this.center.y - this.size.height / 2) + 'px';
    this.element.style.left = Math.round(this.center.x - this.size.width / 2) + 'px';
  },
  setSelected : function(selected) {
    hui.cls.set(this.element,'hui_diagram_box_selected', selected);
  }
};

if (hui.browser.webkit) {
  hui.ui.Diagram.Box.prototype._updateCenter = function() {
    this.element.style.WebkitTransform = 'translate3d(' + Math.round(this.center.x - this.size.width/2) + 'px,' + Math.round(this.center.y - this.size.height/2) + 'px,0)';
  };
}




/** A box in a diagram
 * @constructor
 */
hui.ui.Diagram.Icon = function(options) {
  this.options = options;
  this.id = options.id;
  this.name = options.name;
  this.element = hui.get(options.element);
  this.center = {};
  hui.ui.extend(this);
  hui.ui.Diagram.util.enableDragging(this);
};

hui.ui.Diagram.Icon.create = function(options,diagram) {
  options = hui.override({icon:'common/folder',diagram:diagram},options);
  var e = options.element = hui.build('div',{'class':'hui_diagram_icon'});
  e.appendChild(hui.ui.createIcon(options.icon,32));
  if (options.title) {
    hui.build('strong',{parent: e, text: options.title});
  }
  return new hui.ui.Diagram.Icon(options);
};

hui.ui.Diagram.Icon.prototype = {
  _syncSize : function() {
    if (this.size) {
      return;
    }
    this.size = {
      width : this.element.offsetWidth,
      height : this.element.offsetHeight
    };
  },
  getSize : function() {
    this._syncSize();
    return this.size;
  },
  getCenter : function() {
    return this.center;
  },
  setCenter : function(point) {
    var e = this.element;
    e.style.top = Math.round(point.y - e.clientHeight / 2) + 'px';
    e.style.left = Math.round(point.x - e.clientWidth / 2) + 'px';
    this.center = {x : point.x, y : point.y};
  },
  setSelected : function(selected) {
    hui.cls.set(this.element, 'hui_diagram_icon_selected', selected);
  }
};

/** Utilities **/

hui.ui.Diagram.util = {
  enableDragging : function(obj) {
    var diagram = obj.options.diagram;
    hui.cls.add(obj.element, 'hui_diagram_dragable');
    var dragState = null;
    hui.drag.register({
      touch : true,
      element : obj.element,
      onStart : function() {
        hui.cls.add(obj.element,'hui_diagram_dragging');
        obj.fixed = true;
      },
      onNotMoved : function() {
        diagram.__select(obj);
        diagram.fire('select', obj.id);
      },
      onBeforeMove : function(e) {
        diagram.__nodeMoved(obj);
        e = hui.event(e);
        obj.element.style.zIndex = hui.ui.nextPanelIndex();
        var pos = obj.getCenter();
        var size = obj.getSize();
        pos = {left: pos.x - size.width / 2, top: pos.y - size.height / 2};
        var diagramPosition = hui.position.get(diagram.element);
        dragState = {
          left : e.getLeft() - pos.left,
          top : e.getTop()-pos.top
        };
        obj.element.style.right = 'auto';
      },
      onMove : function(e) {
        var top = (e.getTop()-dragState.top);
        var left = (e.getLeft()-dragState.left);
        var size = obj.getSize();
        top += size.height/2;
        left += size.width/2;
        obj.setCenter({x:left,y:top});
        obj.px = left;
        obj.py = top;
        diagram.__nodeMoved(obj);
      },
      onEnd : function() {
        hui.cls.remove(obj.element,'hui_diagram_dragging');
        obj.fixed = false;
      }
    });
    hui.listen(obj.element,'dblclick',function(e) {
      diagram.__nodeOpen(obj);
    });
  }
};