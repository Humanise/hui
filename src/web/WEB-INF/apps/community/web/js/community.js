if (!oo) var oo = {};
if (!oo.community) oo.community = {};

oo.community.Chrome = function() {
	this.addBehavior();
}

oo.community.Chrome.get = function() {
	var c = oo.community.Chrome;
	if (!c.instance) {
		c.instance = new c();
	}
	return c.instance;
}

oo.community.Chrome.prototype = {
	addBehavior : function() {
		var self = this;
		var logout = $('logOut');
		if (logout) {
			logout.onclick = function() {
				self.logOut();
				return false;
			}
		}
	},
	logOut : function() {
		CoreSecurity.logOut(function() {
			in2igui.fadeOut($$('.login_info')[0],1000);
			in2igui.showMessage('Du er nu logget ud');
			window.setTimeout(function() {
				in2igui.hideMessage();
			},2000);
		});
	}
}

In2iGui.onDomReady(function() {oo.community.Chrome.get()});