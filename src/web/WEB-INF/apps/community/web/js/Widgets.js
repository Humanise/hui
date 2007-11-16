if (!OO) var OO = {};
if (!OO.Community) OO.Community = {};

OO.Community.Message = function() {
	this.style='smile';
	this.body = null;
	this.contents = null;
}

OO.Community.Message.prototype.setContents = function(contents) {
	this.contents = contents;
}

OO.Community.Message.prototype.build = function() {
	if (this.message) return;
	this.message = document.createElement('div');
	this.message.className="message message_large "+this.style;
	this.message.style.display='none';
	this.message.style.opacity='0';
	this.body = document.createElement('div');
	this.body.className="message_body";
	this.body.appendChild(this.contents);
	var clear = document.createElement('div');
	clear.className='clear';
	this.body.appendChild(clear);
	this.message.appendChild(this.body);
	document.body.appendChild(this.message);
}

OO.Community.Message.prototype.show = function() {
	this.build();
	this.message.style.display='';
	$ani(this.message,'opacity',1,200);
	$ani(this.message,'margin-top','10px',200);
}

OO.Community.Message.prototype.hide = function() {
	if (!this.message) return;
	$ani(this.message,'opacity',0,200,{hideOnComplete:true});
	$ani(this.message,'margin-top','0px',200);
}

OO.Community.Message.buildButton = function(text,delegate) {
	var a = document.createElement('a');
	a.className='button';
	var span1 = document.createElement('span');
	var span2 = document.createElement('span');
	a.appendChild(span1);
	span1.appendChild(span2);
	span2.appendChild(document.createTextNode(text));
	if (delegate.buttonWasClicked) {
		a.onclick=function() {
			delegate.buttonWasClicked();
		}
	}
	return a;
}

OO.Community.Message.buildHeader = function(text) {
	var header = document.createElement('h1');
	header.appendChild(document.createTextNode(text));
	return header;
}

OO.Community.Message.buildParagraph = function(text) {
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(text));
	return p;
}