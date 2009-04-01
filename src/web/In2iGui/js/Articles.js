In2iGui.Articles = function(o) {
	this.options = o;
	this.name = o.name;
	this.element = $(o.element);
	if (o.source) {
		o.source.addDelegate(this);
	}
}

In2iGui.Articles.prototype = {
	$articlesLoaded : function(doc) {
		var a = doc.getElementsByTagName('article');
		for (var i=0; i < a.length; i++) {
			var e = new Element('div',{'class':'in2igui_article'});
			var c = a[i].childNodes;
			for (var j=0; j < c.length; j++) {
				if (n2i.dom.isElement(c[j],'title')) {
					e.insert(new Element('h2').update(n2i.dom.getNodeText(c[j])));
				} else if (n2i.dom.isElement(c[j],'paragraph')) {
					var p = new Element('p').update(n2i.dom.getNodeText(c[j]));
					if (c[j].getAttribute('dimmed')==='true') {
						p.addClassName('in2igui_dimmed');
					}
					e.insert(p);
				}
			};
			this.element.insert(e);
		};
	}
}

/* EOF */