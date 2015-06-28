/** A graph
 * @constructor
 */
hui.ui.Graph = function(options) {
	this.options = options;
	this.name = options.name;
	this.element = hui.get(options.element);
	this.ready = false;
	this.defered = [];
	
	var impls = {force:hui.ui.Graph.Protoviz,graffle:hui.ui.Graph.Raphael,d3:hui.ui.Graph.D3};
	
	this.impl = impls[this.options.layout];
	
	hui.ui.extend(this);
	hui.log('Initializing implementation...');
	this.impl.init(this);
	if (options.source) {
		options.source.listen(this);
	}
}

hui.ui.Graph.prototype = {
	setData : function(data) {
		this._defer(function() {
			this.impl.setData(data);
		}.bind(this));
	},
	_defer : function(func) {
		if (this.ready) {
			func();
		} else {
			hui.log('Defering function')
			this.defered.push(func);
		}
	},
	/** @private */
	$objectsLoaded : function(data) {
		hui.log('Data loaded');
		this.setData(data);
	},
	/** @private */
	implIsReady : function() {
		hui.log('Implementation is ready!');
		this.ready = true;
		for (var i=0; i < this.defered.length; i++) {
			this.defered[i]();
		};
	},
	/** @private */
	implNodeWasClicked : function(node) {
		this.fire('clickNode',node);
	},
	/** @private */
	$sourceShouldRefresh : function() {
		return hui.dom.isVisible(this.element);
	},
	refresh : function() {	
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	show : function() {
		this.element.style.display='block';
		this.refresh();
	},
	hide : function() {
		this.element.style.display='none';
	},
	/** @private */
	$visibilityChanged : function() {
		if (this.options.source && hui.dom.isVisible(this.element)) {
			// If there is a source, make sure it is initially 
			this.options.source.refreshFirst();
		}
	},
	/** @private */
	$$layout : function() {
		hui.log('graph.layoutChanged');
		window.setTimeout(function(){
			this.impl.resize(this.element.parentNode.clientWidth,this.element.parentNode.clientHeight);
		}.bind(this),100);
	}
}

/** @namespace */
hui.ui.Graph.Protoviz = {
	init : function(parent) {
		this.parent = parent;
		hui.require(hui.ui.context+'/hui/lib/protovis-3.2/protovis-r3.2.js',function() {
			var w = document.body.clientWidth,
  			h = document.body.clientHeight;

			this.vis = new pv.Panel()
				.canvas(this.parent.element)
			    .width(this.parent.element.clientWidth)
			    .height(this.parent.element.clientHeight)
			    .fillStyle("white")
			    .event("mousedown", pv.Behavior.pan())
			    .event("mousewheel", pv.Behavior.zoom());
			hui.log('Protoviz initialized')
			parent.implIsReady();
		}.bind(this))		
	},
	_convert : function(data) {
		var result = {nodes:[],links:[]};
		for (var i=0; i < data.nodes.length; i++) {
			var node = data.nodes[i];
			result.nodes.push(node)
		};
		for (var i=0; i < data.edges.length; i++) {
			var edge = data.edges[i];
			result.links.push({source:this.getIndex(edge.from,data.nodes),target:this.getIndex(edge.to,data.nodes),label:edge.label});
		};
		return result;
	},
	getIndex : function(id,nodes) {
		for (var i=0; i < nodes.length; i++) {
			if (id===nodes[i].id) {
				return i;
			}
		};
	},
	setData : function(data) {
		var colors = pv.Colors.category19();
		data = this._convert(data);
		
		var force = this.vis.add(pv.Layout.Force)
		    .nodes(data.nodes)
		    .links(data.links);
		
		
		force.link.add(pv.Line).lineWidth(2).anchor("center").add(pv.Label).text(function() {this.anchorTarget.label});

		force.node.add(pv.Dot)
		    .size(function(d) {return 40;return (d.linkDegree + 4) * Math.pow(this.scale, -1.5)})
		    .fillStyle(function(d) {return d.fix ? "brown" : colors(d.group)})
		    .strokeStyle(function() {return this.fillStyle().darker()})
		    .lineWidth(1)
		    .title(function(d) {return d.label || ''})
		    .event("mousedown", pv.Behavior.drag())
		    .event("click", function(x) {console.log(data.nodes[x.index])})
		    .event("drag", force);

		force.node.add(pv.Label).text(function(d) {return d.label}).textAlign('center').textBaseline('middle');
		
		//force.link.add(pv.Label).text(function(d) {return d.label}).textAlign('left').textBaseline('middle');

		this.vis.render();
	}
	
}

/** @namespace */
hui.ui.Graph.D3 = {
	init : function(parent) {
		this.parent = parent;
		var self = this;
		hui.require(hui.ui.context+'/hui/lib/d3/d3.js',function() {
			hui.log('d3 loaded');
			hui.require(hui.ui.context+'/hui/lib/d3/d3.geom.js',function() {
				hui.log('d3.geom loaded');
				hui.require(hui.ui.context+'/hui/lib/d3/d3.layout.js',function() {
					hui.log('d3.layout loaded');
					self._init();
					parent.implIsReady();
				})
			})
		});
	},
	resize : function(width,height) {
		if (this.vis) {
			this.vis.attr('width',width);
			this.vis.attr('height',height);
		}
		if (this.layout) {
			this.layout.size([width,height]);
			this.layout.start();
		}
	},
	_init : function() {
		hui.log('Creating visualization...');
		var w = this.parent.element.clientWidth,
	    h = this.parent.element.clientHeight,
	    fill = d3.scale.category20();
	
		this.vis = d3.select(this.parent.element)
			.append("svg:svg")
			.attr("width", w)
			.attr("height", h);
		
	},
	_onClickNode : function(node) {
		this.parent.implNodeWasClicked(node);
	},
	_findById : function(nodes,id) {
		for (var i = nodes.length - 1; i >= 0; i--){
			if (nodes[i].id===id) {
				return i;
			}
		};
		return null;
	},
	_convert : function(data) {
		var nodes = data.nodes;
		data.links = data.edges;
		for (var i = data.links.length - 1; i >= 0; i--){
			var link = data.links[i];
			link.source = this._findById(nodes,link.from);
			link.target = this._findById(nodes,link.to);
		};
		return data;		
	},
	
	clear : function() {
		if (this.layout) {
			this.layout.stop();
			this.vis.remove();
			this._init();
		}
	},
	
	setData : function(data) {
		this.clear();
		var w = this.parent.element.clientWidth,
	    h = this.parent.element.clientHeight;
		var json = this._convert(data);
		
		var force = this.layout = d3.layout.force()
			.charge(-200)
			.gravity(0.10)
			.distance(100)
			.nodes(json.nodes)
			.links(json.links)
			.size([w, h]);
		var link = this.vis.selectAll("line.link")
			.data(json.links)
			.enter().append("svg:line")
			.attr("class", "hui_graph_link")
			.style("stroke-width", function(d) { return d.label=='Friends' ? 3 : 1 })
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
	
		var node = this.vis.selectAll("circle.node")
			.data(json.nodes)
			.enter()
			.append("svg:g")
			.attr('class','hui_node')
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.style("fill",'none')
			.call(force.drag);
			node.on('click',this._onClickNode.bind(this));
		var self = this;	
		node.each(function(individual) {
			var x = d3.select(this);
			var icon = self.buildIcon(individual.icon,x);
		})
//			node.attr("transform", "translate("+(w*Math.random())+","+(h*Math.random())+")")
		
			/*var circle = node
				.append('svg:circle').attr('r',10)
				.attr("class", "node")
				//.attr("cx", function(d) { return d.x; })
	      		//.attr("cy", function(d) { return d.y; })
	     		.style("fill", function(d) { return fill(d.group); })
	      		;*/
		var text = node
			.append('svg:text')
			.attr('class','hui_graph_label')
			.attr("dx", "13")
			.attr("dy", "5")
			.text(function(d) { return d.label; })
	
		node.append("svg:title").text(function(d) { return d.name; });
	
	  	this.vis.style("opacity", 1e-6)
	    	.transition()
			.duration(2000)
			.style("opacity", 1);
	
		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });
	
	    	node.attr("transform", function(d) { return "translate("+d.x+","+d.y+")" })
		});
		force.start()
		hui.log('Starting...');
	},
	buildIcon : function(icon,parent) {
		if (icon=='monochrome/person') {
			var node = parent.append('svg:path').attr('class','hui_graph_icon');
			node.attr('d','M-9.315,10c0,0-0.575-2.838,1.863-3.951c1.763-0.799,2.174-0.949,2.512-1.2 c0.138-0.087,0.263-0.198,0.438-0.351c0.661-0.561,0.562-1.324,1.038-1.562c0.474-0.225,0.424,0.238,0.524,0 c0.101-0.225-0.075-1.799,0-1.551c0.062,0.252-0.863-1.636-0.901-2.611C-3.888-2.439-4.702-2.99-4.613-3.651 c0.212-1.513,1.472-2.322,1.472-2.322s-2.423-0.454-1.36-1.478c1.062-1.012,1.474-1.4,2.6-2.076c1.138-0.663,2.674-0.599,4.163,0 C3.749-8.914,4.124-8.489,4.61-7.602c0.425,0.762,0.45,1.326,0.413,1.813C4.986-5.314,5.049-4.926,5.049-4.926 s0.499,0.112,0.513,0.837c0.013,0.687-0.175,1.699-0.551,2.162C4.861-1.752,4.599-1.114,4.197-0.264 C3.812,0.574,3.3,1.898,3.3,1.898s0.012,0.725,0,0.926c-0.039,0.45,0.649,0.012,0.962,0.512c0.312,0.501,0.1,0.85,0.799,1.162 c0.688,0.312,2.639,1.562,3.588,2.151C9.762,7.337,9.262,10,9.262,10H-9.315z').attr('fill-rule','evenodd');
		} else if (icon=='monochrome/folder') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:polygon').attr('fill','#fff').attr('points','9.464,-3.309 9.464,-6.384 -0.354,-6.384 -3.433,-9.462 -9.462,-9.462 -9.462,-3.309 -11.153,-3.309 -9.329,9.462 9.331,9.462 11.153,-3.309');
			node.append('svg:polygon').attr('points','-9.999,-2.309 -8.461,8.462 8.464,8.462 10.001,-2.309');
			node.append('svg:polygon').attr('points','8.464,-5.384 -0.769,-5.384 -3.846,-8.462 -8.461,-8.462 -8.461,-5.384 -8.461,-3.846 8.464,-3.846');
			//node.append('svg:rect').attr('cx','0').attr('cy','0').attr('r','12').attr('fill','#fff');
			//node.append('svg:polygon').attr('points','-10,-2 -8.461,8 8.461,8 10,-2');
			//node.append('svg:polygon').attr('points','8,-5 -0.77,-5 -3.846,-8 -8,-8 -8,-5.384 -8,-4 8,-4');
		} else if (icon=='monochrome/image') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:rect').attr('x','-11').attr('y','-9').attr('width','22').attr('height','18').attr('fill','#fff');
			node.append('svg:path').attr('d','M8-6V6H-8V-6H8 M10-8h-20V8h20V-8L10-8z');
			node.append('svg:circle').attr('cx','-2.818').attr('cy','-2.693').attr('r','1.875');
			node.append('svg:path').attr('d','M-7,5H7v-5.033L4.271-3.625L1.585,2.18L0,0.561c0,0-2.193,0.814-2.917,2.064c-1.151-0.625-1.776,0-1.776,0L-7,5z');
		} else if (icon=='monochrome/news') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('d','M10.523-9.273l-1.25-1.25C8.967-10.831,8.559-11,8.125-11s-0.842,0.169-1.148,0.477L5.625-9.173 l-1.352-1.351C3.968-10.83,3.56-11,3.125-11c-0.367,0-0.727,0.126-1.014,0.354L0-8.956l-2.109-1.688 C-2.396-10.873-2.757-11-3.124-11c-0.435,0-0.843,0.169-1.149,0.477l-1.352,1.351l-1.352-1.351C-7.283-10.831-7.691-11-8.125-11 s-0.842,0.169-1.148,0.477l-1.25,1.25C-10.831-8.967-11-8.559-11-8.125v16.25c0,0.434,0.169,0.841,0.477,1.148l1.25,1.25 c0.307,0.307,0.715,0.476,1.148,0.476s0.842-0.169,1.148-0.476l1.352-1.351l1.352,1.351c0.309,0.308,0.716,0.476,1.149,0.476 c0.366,0,0.726-0.125,1.012-0.354L0,8.956l2.109,1.688C2.394,10.873,2.755,11,3.125,11c0.44,0,0.852-0.172,1.157-0.485l1.343-1.342 l1.352,1.351c0.307,0.307,0.715,0.476,1.148,0.476s0.842-0.169,1.148-0.476l1.25-1.25C10.831,8.966,11,8.559,11,8.125v-16.25 C11-8.559,10.831-8.967,10.523-9.273z').attr('fill','#fff');
			node.append('svg:path').attr('d','M9.816-8.566l-1.25-1.25c-0.244-0.244-0.639-0.244-0.883,0L5.625-7.759L3.566-9.816c-0.225-0.226-0.583-0.245-0.832-0.047 L0-7.675l-2.734-2.188c-0.248-0.198-0.606-0.179-0.832,0.047l-2.059,2.058l-2.059-2.058c-0.244-0.244-0.639-0.244-0.883,0 l-1.25,1.25C-9.934-8.449-10-8.291-10-8.125v16.25c0,0.166,0.066,0.324,0.184,0.441l1.25,1.25c0.244,0.244,0.639,0.244,0.883,0 l2.059-2.058l2.059,2.058c0.226,0.225,0.584,0.244,0.832,0.047L0,7.676l2.734,2.188C2.85,9.956,2.987,10,3.125,10 c0.161,0,0.321-0.061,0.441-0.184l2.059-2.058l2.059,2.058c0.244,0.244,0.639,0.244,0.883,0l1.25-1.25 C9.934,8.449,10,8.291,10,8.125v-16.25C10-8.291,9.934-8.449,9.816-8.566z M-1.25,3.75H-7.5V-2.5h6.25V3.75z M7.5,3.75H0V2.5h7.5 V3.75z M7.5,1.25H0V0h7.5V1.25z M7.5-1.25H0V-2.5h7.5V-1.25z M7.5-3.75h-15V-5h15V-3.75z');
		} else if (icon=='monochrome/warning') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('d','M10.672,7.15L2.321-9.432C1.913-10.386,0.984-11-0.057-11c-0.882,0-1.693,0.445-2.173,1.19 c-0.099,0.156-0.176,0.309-0.234,0.459l-8.152,16.403C-10.867,7.46-11,7.929-11,8.411C-11,9.839-9.841,11-8.416,11H8.416 C9.841,11,11,9.839,11,8.411C11,7.969,10.887,7.533,10.672,7.15z').attr('fill','#fff');
			node.append('svg:path').attr('d','M9.8,7.639L1.411-9.013C1.175-9.592,0.607-10-0.057-10c-0.558,0-1.049,0.291-1.333,0.731 c-0.062,0.1-0.116,0.206-0.156,0.316L-9.744,7.543C-9.908,7.795-10,8.091-10,8.411C-10,9.286-9.294,10-8.416,10H8.416 C9.291,10,10,9.286,10,8.411C10,8.13,9.928,7.867,9.8,7.639 M1.613-5.456L1.166,3.906H-1.15l-0.444-9.362H1.613z M0.009,8.869 h-0.02c-1.077,0-1.808-0.792-1.808-1.855c0-1.1,0.751-1.855,1.827-1.855c1.077,0,1.788,0.756,1.81,1.855 C1.818,8.077,1.107,8.869,0.009,8.869');
		} else if (icon=='monochrome/globe') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','11').attr('fill','#fff');
			node.append('svg:path').attr('d','M0.048-9.91c-5.496,0-9.955,4.456-9.955,9.954S-5.448,10,0.048,10 S10,5.542,10,0.044S5.544-9.91,0.048-9.91 M6.974-5.686C7.083-5.721,7.47-5.287,7.556-5.406c0.113-0.149-0.407-0.515-0.407-0.668 c0-0.21,0.978,0.964,1.032,1.057c0.013,0.021-0.27-0.136-0.276-0.108C7.883-4.966,7.852-4.809,7.813-4.65 C7.402-4.612,6.57-5.55,6.974-5.686 M2.82,4.227c-0.755,0.929-0.313,1.975-1.71,2.39C0.392,6.831,0.7,8.332-0.506,7.959 c0.069,0.07,0.069,0.171,0.239,0.28c-0.266,0.19-0.57,0.228-0.885,0.322c0.077,0.088,0.285,0.672,0.468,0.605 C-2.344,10-2.666,6.858-3.027,6c-0.271-0.653-1.199-0.954-1.596-1.555C-4.869,4.069-5.025,3.651-5.262,3.27 c-0.565-0.908,0.843-1.993,0.208-2.791C-5.307,0.159-5.762,0.667-6.25,0.026c-0.127-0.167-0.172-0.534-0.226-0.732 C-6.811-0.622-7.312-1.351-7.42-1.242c-0.375,0.375-0.934-0.514-0.891-0.845c0.128-0.971-0.375-1.522,0.148-2.444 c0.793-1.392,1.738-2.674,3.156-3.475c0.827-0.467,2.369-1.355,3.358-1.085C-1.83-9.02-3.658-8.137-3.457-8.079 c0.175,0.052,0.582-0.202,0.69,0.064c0.003,0.118-0.025,0.225-0.089,0.323c0.203,0.299,1.448-0.978,1.707-1.078 c0.506-0.2,0.744,0.327,1.312,0.132c0.396-0.135,0.213,0.623,0.172,0.623c0.066,0,0.53-0.203,0.503,0.042 C0.77-7.379-1.377-8.058-1.604-7.367c-0.061,0.188,0.697-0.175,0.82-0.063c-0.051,0.083-0.109,0.16-0.173,0.236 c0.059,0.117,0.523,0.265,0.573,0.158C-0.434-6.93-1.781-6.76-2.012-6.664c-0.393,0.162-1.07,0.585-1.436,0.911 c-0.217,0.197-0.126,0.482-0.376,0.659c-0.274,0.194-0.561,0.381-0.811,0.608C-4.96-4.19-4.667-3.286-5.028-3.119 c0.102-0.047-0.356-1.584-0.97-0.84C-6.243-3.661-6.733-3.787-7.11-3.42c-0.335,0.327-0.454,0.969-0.391,1.412 c0.149,1.05,0.815-0.293,1.221-0.293c0.271,0-0.46,0.972-0.247,1.128C-6.086-0.85-5.801-1.399-5.96-0.417 c-0.236,1.433,2.149,0.1,2.071-0.053c0.112,0.226-0.282,0.441-0.009,0.629c0.11,0.075,0.096-0.386,0.17-0.464 c0.24-0.251,0.339,0.118,0.551,0.202c0.269,0.11,1.516,0.09,1.595,0.495c0.206,1.011,2.215,0.385,1.633,1.951 c0.065-0.041,0.134-0.066,0.208-0.078c0.485,0.127,0.933,0.55,1.366,0.498C2.539,2.651,3.563,3.32,2.82,4.227 M7.309,0.806 c-1.176-1.099-1.178-3.391-0.12-4.486c-0.12-0.761,0.75-0.87,1.163-0.548c0.3,0.23,0.628,0.978,0.741,1.332 c0.683,2.116,0.578,4.827-0.563,6.78C8.935,3.006,8.911,2.22,9.108,1.319C9.436-0.147,7.744,1.213,7.309,0.806');
		} else if (icon=='monochrome/dot') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','11').attr('fill','#fff');
			node.append('svg:circle').attr('cx','0').attr('cy','0').attr('r','10');
		} else if (icon=='monochrome/page') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:polygon').attr('fill','#fff').attr('points','-9,11 -9,-11 3,-11 9,-5 9,11');
			node.append('svg:polygon').attr('points','3,-9.5 3,-5 7.5,-5');
			node.append('svg:polygon').attr('points','-8,-10 2,-10 2,-4 8,-4 8,10 -8,10');

			node.append('svg:rect').attr('x','-6').attr('y','-8').attr('width','6').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','-5').attr('width','6').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','-2').attr('width','12').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','7').attr('width','12').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','4').attr('width','12').attr('height','1').attr('fill','#fff');
			node.append('svg:rect').attr('x','-6').attr('y','1').attr('width','12').attr('height','1').attr('fill','#fff');
		} else if (icon=='monochrome/hierarchy') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('fill','#fff').attr('d','M8.574,4L3.527,0.971V-11h-7V0.939L-8.575,4H-11v7h22V4H8.574z');
			node.append('svg:polygon').attr('points','8.297,5 2.526,1.537 2.526,-2.5 0.651,-2.5 0.651,-5 2.526,-5 2.526,-10 -2.474,-10 -2.474,-5 -0.599,-5 -0.599,-2.5 -2.474,-2.5 -2.474,1.505 -8.298,5 -10,5 -10,10 -5,10 -5,5 -5.868,5 -1.702,2.5 -0.599,2.5 -0.599,5 -2.474,5 -2.474,10 2.526,10 2.526,5 0.651,5 0.651,2.5 1.702,2.5 5.869,5 5,5 5,10 10,10 10,5');
		} else if (icon=='monochrome/email') {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:path').attr('fill','#fff').attr('d','M10.727-1.695C10.727-7.086,6.645-11,1.02-11c-6.696,0-11.746,5.137-11.746,11.949 C-10.727,7.549-5.713,11-0.76,11c2.283,0,3.872-0.314,5.668-1.121L5.707,9.52L4.701,6.158C8.271,5.922,10.727,2.76,10.727-1.695z');
			node.append('svg:path').attr('d','M4.498,8.967C2.773,9.742,1.281,10-0.76,10c-4.771,0-8.967-3.418-8.967-9.051C-9.727-4.912-5.445-10,1.02-10 c5.086,0,8.707,3.479,8.707,8.305c0,4.225-2.355,6.869-5.459,6.869c-1.35,0-2.328-0.719-2.471-2.211H1.74 C0.82,4.398-0.445,5.174-1.996,5.174c-1.84,0-3.219-1.408-3.219-3.764c0-3.535,2.613-6.695,6.754-6.695 c1.262,0,2.699,0.314,3.391,0.688L4.066,0.748c-0.258,1.695-0.059,2.473,0.748,2.5c1.234,0.057,2.787-1.523,2.787-4.855 c0-3.766-2.414-6.639-6.867-6.639c-4.426,0-8.248,3.42-8.248,8.938c0,4.828,3.045,7.529,7.328,7.529 c1.467,0,3.045-0.318,4.193-0.893L4.498,8.967z M1.969-2.9C1.74-2.957,1.422-3.016,1.078-3.016c-1.898,0-3.391,1.867-3.391,4.08 c0,1.092,0.488,1.781,1.408,1.781c1.092,0,2.213-1.35,2.443-3.018L1.969-2.9z');
		} else {
			var node = parent.append('svg:g').attr('class','hui_graph_icon');
			node.append('svg:polygon').attr('fill','#fff').attr('points','0.09,-11 -9.182,-11 -9.182,11 9.182,11 9.182,-1.909');
			node.append('svg:polygon').attr('points','0.91,-8.182 0.91,-2.727 6.365,-2.727');
			node.append('svg:polygon').attr('points','-8.182,-10 -0.91,-10 -0.91,-0.909 8.182,-0.909 8.182,10 -8.182,10');
		}
		
	}
}

/** @namespace */
hui.ui.Graph.Raphael = {
	init : function(parent) {
		this.parent = parent;
		hui.require(hui.ui.context+'/hui/lib/raphael-min.js',function() {
			hui.log('Raphael is loadd');
			this._extend();
			parent.implIsReady()
		}.bind(this));
	},
	_extend : function() {
		hui.log('Extending Raphael...')
		Raphael.fn.connection = function (obj1, obj2, line, bg, text) {
			if (obj1.line && obj1.from && obj1.to) {
				line = obj1;
				obj1 = line.from;
				obj2 = line.to;
			}
			var bb1 = obj1.getBBox(),
				bb2 = obj2.getBBox(),
				p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
				{x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
				{x: bb1.x - 1, y: bb1.y + bb1.height / 2},
				{x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
				{x: bb2.x + bb2.width / 2, y: bb2.y - 1},
				{x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
				{x: bb2.x - 1, y: bb2.y + bb2.height / 2},
				{x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
				d = {}, dis = [];
			for (var i = 0; i < 4; i++) {
				for (var j = 4; j < 8; j++) {
					var dx = Math.abs(p[i].x - p[j].x),
						dy = Math.abs(p[i].y - p[j].y);
					if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
						dis.push(dx + dy);
						d[dis[dis.length - 1]] = [i, j];
					}
				}
			}
			if (dis.length == 0) {
				var res = [0, 4];
			} else {
				res = d[Math.min.apply(Math, dis)];
			}
			var x1 = p[res[0]].x,
				y1 = p[res[0]].y,
				x4 = p[res[1]].x,
				y4 = p[res[1]].y;
			dx = Math.max(Math.abs(x1 - x4) / 2, 10);
			dy = Math.max(Math.abs(y1 - y4) / 2, 10);
			var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
				y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
				x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
				y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
			var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
			if (line && line.line) {
				line.bg && line.bg.attr({path: path});
				line.line.attr({path: path});
				line.text.attr({x:x1+(x4-x1)/2,y:y4+(y1-y4)/2});
			} else {
				var color = typeof line == "string" ? line : "#000";
				return {
					line: this.path(path).attr({stroke: color, fill: "none", "stroke-width": 2, "stroke-opacity": .5}),
					from: obj1,
					to: obj2,
					text : this.text(x1+(x4-x1)/2, y4+(y1-y4)/2,text).attr({fill:'#fff'})
				};
			}
		}
	},

 	setData : function (data) {
		hui.log(data);
	    var dragger = function () {
	        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
	        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
	        this.animate({"fill-opacity": .8}, 500);
	    },
        move = function (dx, dy) {
			var x = this.ox + dx,
				y = this.oy + dy;
            var att = this.type == "rect" ? {x: x, y: y} : {cx: this.ox + dx, cy: this.oy + dy};
            this.attr(att);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
			this.text.attr({x:x+(this.getBBox().width/2),y:y+15});
            r.safari();
        },
        up = function () {
            this.animate({"fill-opacity": .1}, 500);
        },
		el = this.parent.element,
		width = el.clientWidth,
		height = el.clientHeight,
        r = Raphael(el, width, height),
        connections = [],
		shapes = [],
		idsToShape = {};
		for (var i=0; i < data.nodes.length; i++) {
			var node = data.nodes[i],
				left = Math.random()*(width-100)+50,
				top = Math.random()*(height-100)+50,
				shape = r.rect(left, top, 20, 30, 5),
				text = r.text(left,top+15,node.label),
				box = text.getBBox();
			text.attr({x:left+(box.width+20)/2,fill:'#fff'});
			shape.attr({width:box.width+20});
			shape.text = text;
			shapes.push(shape);
			idsToShape[node.id] = shape;
		};
	    for (var i = 0, ii = shapes.length; i < ii; i++) {
	        var color = "#fff";//Raphael.getColor();
	        shapes[i].attr({fill: "#559DFF", stroke: color, "fill-opacity": .1, "stroke-width": 2, cursor: "move"});
	        shapes[i].drag(move, dragger, up);
	    }
		
		for (var i=0; i < data.edges.length; i++) {
			var edge = data.edges[i];
			connections.push(r.connection(idsToShape[edge.from], idsToShape[edge.to], "#fff",null,edge.label));
		};
	}
}