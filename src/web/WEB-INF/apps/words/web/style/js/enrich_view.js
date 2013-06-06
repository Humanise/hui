var enrichView = {
	$ready : function() {
		this._next();
	},
	_next : function() {
		hui.cls.add('rendering','words_enrich_busy')
		hui.ui.request({
			url : oo.appContext+'/getNextEnrichment',
			$object : function(perspective) {
				this._render(perspective);
				hui.cls.remove('rendering','words_enrich_busy')
			}.bind(this)
		})
	},
	_render : function(obj) {
		var html = '<h1>'+hui.string.escape(obj.text)+'</h1>';
		hui.get('rendering').innerHTML = html;
		
		var actions = hui.get('actions');
		hui.dom.clear(actions)
		hui.each(obj.enrichments,function(en,i) {
			var a = hui.build('a',{text:en.label,href:'javascript://',parent:actions});
			hui.listen(a,'click',function() {
				this._do(obj,en);
			}.bind(this))
		}.bind(this))
		for (var i=0; i < obj.enrichments.length; i++) {
			html+='<tr><th>'+obj.enrichments[i].label+'</th><td>'+obj.enrichments[i].value+'</td></tr>';
		};
	},
	_do : function(obj,enrichment) {
		hui.ui.request({
			url : oo.appContext+'/enrich',
			$success : this._next.bind(this),
			json : {wordId:obj.wordId,enrichment:enrichment.value}
		});
	}
}
hui.ui.listen(enrichView);