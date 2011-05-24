/** A data source
 * @constructor
 */
hui.ui.Source = function(options) {
	this.options = hui.override({url:null,dwr:null,parameters:[],lazy:false},options);
	this.name = options.name;
	this.data = null;
	this.parameters = this.options.parameters;
	hui.ui.extend(this);
	if (options.delegate) {
		this.listen(options.delegate);
	}
	this.busy=false;
	hui.ui.onReady(this.init.bind(this));
};

hui.ui.Source.prototype = {
	/** @private */
	init : function() {
		var self = this;
		hui.each(this.parameters,function(parm) {
			var val = hui.ui.bind(parm.value,function(value) {
				self.changeParameter(parm.key,value);
			});
			parm.value = self.convertValue(val);
		});
		if (!this.options.lazy) {
			this.refresh();
		}
	},
	/** @private */
	convertValue : function(value) {		
		if (value && value.getTime) {
			return value.getTime();
		}
		return value;
	},
	/** Refreshes the data source */
	refresh : function() {
		if (this.delegates.length==0) {
			return;
		}
		for (var i=0; i < this.delegates.length; i++) {
			var d = this.delegates[i];
			if (d['$sourceShouldRefresh'] && d['$sourceShouldRefresh']()==false) {
				return;
			}
		};
		if (this.busy) {
			this.pendingRefresh = true;
			return;
		}
		this.pendingRefresh = false;
		var self = this;
		if (this.options.url) {
			var prms = {};
			for (var j=0; j < this.parameters.length; j++) {
				var p = this.parameters[j];
				prms[p.key] = p.value;
			};
			this.busy=true;
			hui.ui.callDelegates(this,'sourceIsBusy');
			hui.request({
				method:'post',
				url:this.options.url,
				parameters:prms,
				onSuccess : function(t) {self.parse(t)},
				onException : function(e,t) {
					hui.log('Exception while loading source...')
					hui.log(e)
				},
				onFailure : function(t) {
					hui.ui.callDelegates(self,'sourceFailed');
				}
			});
		} else if (this.options.dwr) {
			var pair = this.options.dwr.split('.');
			var facade = eval(pair[0]);
			var method = pair[1];
			var args = facade[method].argumentNames();
			for (var k=0; k < args.length; k++) {
				if (this.parameters[k]) {
					args[k]=this.parameters[k].value===undefined ? null : this.parameters[k].value;
				}
			};
			args[args.length-1]=function(r) {self.parseDWR(r)};
			this.busy=true;
			hui.ui.callDelegates(this,'sourceIsBusy');
			facade[method].apply(facade,args);
		}
	},
	/** @private */
	end : function() {
		this.busy=false;
		if (this.pendingRefresh) {
			this.refresh();
		} else {
			hui.ui.callDelegates(this,'sourceIsNotBusy');
		}
	},
	/** @private */
	parse : function(t) {
		if (t.responseXML && t.responseXML.documentElement && t.responseXML.documentElement.nodeName!='parsererror') {
			this.parseXML(t.responseXML);
		} else {
			var str = t.responseText.replace(/^\s+|\s+$/g, ''),
				json = null;
			if (str.length>0) {
				json = hui.fromJSON(t.responseText);
			}
			this.fire('objectsLoaded',json);
		}
		this.end();
	},
	/** @private */
	parseXML : function(doc) {
		if (doc.documentElement.tagName=='items') {
			this.data = hui.ui.parseItems(doc);
			this.fire('itemsLoaded',this.data);
		} else if (doc.documentElement.tagName=='list') {
			this.fire('listLoaded',doc);
		} else if (doc.documentElement.tagName=='articles') {
			this.fire('articlesLoaded',doc);
		}
	},
	/** @private */
	parseDWR : function(data) {
		this.data = data;
		this.fire('objectsLoaded',data);
		this.end();
	},
	addParameter : function(parm) {
		this.parameters.push(parm);
	},
	changeParameter : function(key,value) {
		value = this.convertValue(value);
		for (var i=0; i < this.parameters.length; i++) {
			var p = this.parameters[i]
			if (p.key==key) {
				p.value=value;
			}
		};
		window.clearTimeout(this.paramDelay);
		this.paramDelay = window.setTimeout(function() {
			this.refresh();
		}.bind(this),100)
	}
}

/* EOF */