In2iGui.ObjectList = function(id,name) {
	this.id = id;
	this.name = name;
	this.element = $id(id);
	this.body = this.element.getElementsByTagName('tbody')[0];
	this.template = [];
	this.objects = [];
	In2iGui.enableDelegating(this);
}

In2iGui.ObjectList.prototype.ignite = function() {
	this.addObject({id:0});
}

In2iGui.ObjectList.prototype.addObject = function(data,addToEnd) {
	if (this.objects.length==0 || addToEnd) {
		var obj = new In2iGui.ObjectList.Object(this.objects.length,data,this);
		this.objects.push(obj);
		this.body.appendChild(obj.getElement());
	} else {
		var last = this.objects.pop();
		var obj = new In2iGui.ObjectList.Object(last.index,data,this);
		last.index++;
		this.objects.push(obj);
		this.objects.push(last);
		this.body.insertBefore(obj.getElement(),last.getElement())
	}
}
In2iGui.ObjectList.prototype.addObjects = function(data) {
	for (var i=0; i < data.length; i++) {
		this.addObject(data[i]);
	};
	N2i.log(this.objects);
}

In2iGui.ObjectList.prototype.getObjects = function(data) {
	var list = [];
	for (var i=0; i < this.objects.length-1; i++) {
		list.push(this.objects[i].getData());
	};
	return list;
}

In2iGui.ObjectList.prototype.registerTemplateItem = function(key,type) {
	this.template.push({key:key,type:type});
}

In2iGui.ObjectList.prototype.objectDidChange = function(obj) {
	if (obj.index>=this.objects.length-1) {
		this.addObject({},true);
	}
	N2i.log(this.getObjects());
}

/********************** Object ********************/

In2iGui.ObjectList.Object = function(index,data,list) {
	this.data = data;
	this.index = index;
	this.list = list;
	this.fields = {};
}

In2iGui.ObjectList.Object.prototype.getElement = function() {
	if (!this.element) {
		var self = this;
		this.element = document.createElement('tr');
		for (var i=0; i < this.list.template.length; i++) {
			var key = this.list.template[i].key;
			var cell = document.createElement('td');
			var input = N2i.create('input',{'class':'text'});
			cell.appendChild(input);
			this.element.appendChild(cell);
			var field = new N2i.TextField(input);
			field.in2iGuiObjectListKey = key;
			field.setValue(this.data[key]);
			field.setDelegate(this);
			this.fields[key] = field;
		};
	}
	return this.element;
}

In2iGui.ObjectList.Object.prototype.valueDidChange = function(field) {
	this.data[field.in2iGuiObjectListKey] = field.getValue();
	this.list.objectDidChange(this);
}

In2iGui.ObjectList.Object.prototype.getData = function() {
	return this.data;
}