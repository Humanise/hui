var videoView = {
	videoId : null,
	commentPanel : null,
	commentFormula : null,
	
	$click$addComment : function() {
		if (!this.commentPanel) {
			
			var p = this.commentPanel = ui.Box.create({closable:true,width:400,modal:true,absolute:true,padding:10,title:'Add comment'});
			p.addToDocument();
			var form = this.commentFormula = ui.Formula.create({name:'commentFormula'});
			form.buildGroup({},[
				{type:'Text',options:{key:'name',label:'Name'}},
				{type:'Text',options:{key:'text',lines:10,label:'Comment'}}
			]);
			p.add(form);
			var buttons = ui.Buttons.create({top: 10,align:'right'});
			var cancel = ui.Button.create({name:'cancelComment',title:'Cancel'});
			var create = ui.Button.create({name:'createComment',text:'Create',highlighted:true});
			buttons.add(cancel);
			buttons.add(create);
			p.add(buttons);
		}
		this.commentPanel.show();
		this.commentFormula.focus();
	},
	$click$cancelComment : function() {
		this.commentPanel.hide();
	},
	$click$createComment : function() {
		var values = this.commentFormula.getValues();
		AppVideosharing.addComment(this.videoId,values.name,values.text,function() {
			document.location.reload();
		});
	},
	$click$refresh : function() {
		jsf.ajax.request('form',null,{render:'form'});
	}
};

ui.listen(videoView);