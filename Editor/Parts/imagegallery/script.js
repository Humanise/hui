var partController = {
	$ready : function() {
		//this.buildWindow();
	},
	buildWindow : function() {
		var form = document.forms.PartForm;
		var win = hui.ui.Window.create({title:'Billedgalleri',width:300,close:false,padding:5,variant:'dark'});
		var formula = hui.ui.Formula.create({name:'formula'});
		formula.buildGroup(null,[
			{type:'DropDown',options:{name:'group',label:'Billedgruppe:',url:'../../Services/Model/Items.php?type=imagegroup',value:form.group.value}},
			{type:'Number',options:{label:'Højde:',name:'height',value:parseInt(form.height.value,10),min:10,max:512}},
			{type:'Checkbox',options:{label:'Indrammet',key:'framed',value:form.framed.value=='true'}},
			{type:'Checkbox',options:{label:'Vis titel',key:'showTitle',value:form.showTitle.value=='true'}}
		]);
		win.add(formula);
		win.show();
	},
	$valueChanged$group : function(value) {
		this.preview();
	},
	$valuesChanged$formula : function(values) {
		document.forms.PartForm.height.value = values.height;
		document.forms.PartForm.group.value = values.group;
		document.forms.PartForm.framed.value = values.framed;
		document.forms.PartForm.showTitle.value = values.showTitle;
		this.preview();
	},
	preview : function() {
		var url = controller.context+'Editor/Services/Parts/Preview.php?type=imagegallery';
		var parms = hui.form.getValues(document.forms.PartForm);
		hui.ui.request({method:'post',url:url,parameters:parms,
			onSuccess:function(t) {
				var node = hui.get('part_imagegallery_container');
				hui.dom.replaceHTML(node,t.responseText);
				hui.dom.runScripts(node);
		}});
	}
}

In2iGhui.ui.listen(partController);