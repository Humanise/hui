var videoView = {
	videoId : null,
	commentPanel : null,
	commentFormula : null,
	
	$click$addToContest : function() {
		if (!this.publicCommentPanel) {
			var p = this.publicCommentPanel = ui.Box.create({closable:true,modal:true,absolute:true});
			p.addToDocument();
			p.add(n2i.build('div',{'class':'mock_contest_payment'}));
		}
		this.publicCommentPanel.show();
	},
	
	$click$addComment : function() {
		if (!this.commentPanel) {
			
			var p = this.commentPanel = ui.Box.create({closable:true,width:400,modal:true,absolute:true,padding:10,title:'Add comment'});
			p.addToDocument();
			var form = this.commentFormula = ui.Formula.create({name:'commentFormula'});
			form.buildGroup({},[
				{type:'TextField',options:{key:'name',label:'Name'}},
				{type:'TextField',options:{key:'text',lines:10,label:'Comment'}}
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
			oo.update({id:'comments'});
			this.commentFormula.reset();
			this.commentPanel.hide();
		}.bind(this));
	},
	$click$refresh : function() {
		this.update('comments');
	},
	deleteComment : function(id) {
		Common.deleteEntity(id,function() {
			oo.update({id:'comments'});
		});
	},
	
	
	$click$showPosterPanel : function() {
		if (!this.posterPanel) {
			var p = this.posterPanel = ui.Box.create({title:'Set poster image',closable:true,width:400,padding:10,modal:true,absolute:true});
			var buttons = ui.Buttons.create({top: 10,align:'center'});
			var cancel = ui.Button.create({name:'cancelPosterUpload',title:'Cancel'});
			var choose = ui.Button.create({text:'Choose image...'});
			buttons.add(choose);
			buttons.add(cancel);
			var upload = ui.Upload.create({
				name:'posterUpload',
				url:'../../../changeVideoPoster.action',
				widget:choose,
				placeholder:{title:'Choose an image for use as the videos poster...',text:'The file must be an JPEG or PNG file'},
				parameters:{videoId:this.videoId}
			});
			p.add(upload);
			p.add(buttons);
			p.addToDocument();
		}
		this.posterPanel.show();
	},
	
	$uploadDidCompleteQueue$posterUpload : function() {
		oo.update({id:'video'});
		ui.get('posterUpload').clear();
		this.posterPanel.hide();
	},
	$click$cancelPosterUpload : function() {
		this.posterPanel.hide();
	},

	$click$deleteVideo : function() {
		if (confirm('Are you sure?')) {
			AppVideosharing.removeVideo(this.videoId,function() {
				document.location='../';
			});
		}
	},
	$click$rateUp : function() {
		if (oo.user.userName=='public') {
			this.ratePublic();
			return;
		}
		AppVideosharing.rateVideoAdditive(this.videoId,.2,function() {
			oo.update({id:['rating','average_rating']});
		});
	},
	$click$rateDown : function() {
		if (oo.user.userName=='public') {
			this.ratePublic();
			return;
		}
		AppVideosharing.rateVideoAdditive(this.videoId,-.2,function() {
			oo.update({id:['rating','average_rating']});
		});
	},
	rate : function(index) {
		if (oo.user.userName=='public') {
			this.ratePublic();
			return;
		}
		var rates = [-1,-.8,-.6,-.4,-.2,0.2,0.4,0.6,0.8,1];
		var rate = rates[index];
		AppVideosharing.rateVideo(this.videoId,rate,function() {
			oo.update({id:['rating','average_rating']});
		});
	},
	
	ratePublic : function() {
		if (!this.ratingPanel) {
			var p = this.ratingPanel = ui.Box.create({closable:true,modal:true,absolute:true});
			p.addToDocument();
			p.add(n2i.build('div',{'class':'mock_rate_signup'}));
		}
		this.ratingPanel.show();
	}
};

ui.listen(videoView);