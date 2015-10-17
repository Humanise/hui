oo.Map = function(options) {
	this.options = options;
	this.element = hui.get(options.element);
	this.name = options.name;
	hui.ui.extend(this);
	if (options.dynamic) {
		hui.ui.onReady(this._init.bind(this));		
	} else {
		hui.ui.onReady(this._initStatic.bind(this));
	}
	hui.log('New map');
	this._addBehavior();
}

oo.Map.prototype = {
	_addBehavior : function() {
		hui.listen(this.element,'click',function(e) {
			e = hui.event(e);
			var a = e.findByTag('a');
			if (a) {
				if (hui.cls.has(a,'oo_map_pin')) {
					this._showPanel(a);
				} else if (hui.cls.has(a,'oo_map_add')) {
					this._edit(a);
				} else if (hui.cls.has(a,'oo_map_edit')) {
					this._edit(a);
				}
			}
		}.bind(this))		
	},
	_initStatic : function() {
		hui.log('Init static');
		var loc = this.options.location;
		if (loc) {
			var url = 'http://maps.googleapis.com/maps/api/staticmap?center='+loc.latitude+','+loc.longitude+'&zoom=14&size='+(this.element.offsetWidth)+'x'+(this.element.offsetHeight)+'&maptype=terrain&sensor=false';
			this.element.style.backgroundImage='url(\''+url+'\')';
		}
	},
	_init : function() {
		hui.log('Init dynamic');
		var options = this.options;
		var myLatlng = new google.maps.LatLng(options.location.latitude, options.location.longitude);
		var myOptions = {
			zoom: 15,
			center: myLatlng,
			disableDefaultUI : true,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		}
		var map = new google.maps.Map(this.element, myOptions);
		var marker = new google.maps.Marker({
			position : myLatlng, 
			map : map
		});
	},
	_showPanel : function(target) {
		var panel = hui.ui.BoundPanel.create({variant:'light',modal:'transparent'});
		panel.add(hui.build('div',{'class':'oo_map_info',html:this.options.info}))
		panel.show({target:target});
	},
	_edit : function() {
		if (!this._editPanel) {
			var panel = this._editPanel = hui.ui.BoundPanel.create({variant:'light',modal:'transparent',padding:10});
			var form = this._editForm = hui.ui.Formula.create();
			var group = form.buildGroup(null,[
				{label:'Title',type:'TextField',options:{key:'title'}},
				{label:'Location',type:'LocationField',options:{key:'location'}}
			]);
			var buttons = group.createButtons();
			buttons.add(hui.ui.Button.create({text:'Cancel',small:true,listener:{
				$click : function() {
					panel.hide();
				}
			}}));
			buttons.add(hui.ui.Button.create({text:'Delete',small:true,confirm:{text:'Are you sure?'},listener:{
				$click:this._delete.bind(this)
			}}));
			buttons.add(hui.ui.Button.create({text:'Save',highlighted:true,small:true,listener:{
				$click:this._update.bind(this)
			}}));
			panel.add(form);
		}
		this._editForm.setValues({location:this.options.location});
		this._editPanel.show({target:this.element});
	},
	_delete : function() {
		this._editForm.reset();
		this._editPanel.hide();
		this.fire('valueChanged',{callback:this._reload.bind(this)});
	},
	_update : function() {
		var values = this._editForm.getValues();
		this._editForm.reset();
		this._editPanel.hide();
		this.fire('valueChanged',{location:values.location,callback:this._reload.bind(this)});
	},
	_reload : function() {
		hui.cls.add(this.element,'oo_map_busy');
		oo.update({id:this.element.id,$success : function() {
			//hui.ui.showMessage({text:'The map is updated',icon:'common/success'});
		}});
	}
};