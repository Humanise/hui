var controller = {
	$ready : function() {
		if (window.top!=window.self) {
			window.top.location=window.self.location;
		} else {
			username.focus();
		}
		if (hui.browser.msie && (!hui.browser.msie8 && !hui.browser.msie9)) {
			hui.ui.alert({
				emotion:'gasp',
				title:'Din software er forældet',
				text:'Systemet understøtter ikke Internet Explorer tidligere end version 8. Opgrader venligst til en nyere version eller fortsæt på eget ansvar.'
			});
		}
		if (hui.location.getBoolean('logout')) {
			hui.ui.showMessage({text:'Du er nu logget ud',icon:'common/success',duration:2000});
		}
		hui.ui.request({
			url : '../hui/info/preload.json',
			onJSON : function(obj) {
				var p = new hui.Preloader({context:hui.ui.context+'/hui'});
				p.addImages(obj);
				p.setDelegate({
					imageDidLoad : function(count,total) {
						hui.log(count/total);
					}
				});
				p.load();
			}
		});
	},
	$submit$formula : function() {
		hui.ui.showMessage({text:'Logger ind...',busy:true,delay:100});
		hui.ui.request({
			url:'Services/Core/Authentication.php',
			onSuccess:'login',
			parameters:formula.getValues(),
			onFailure:function() {
				hui.ui.showMessage({text:'Der skete en fejl internt i systemet!',icon:'common/warning',duration:4000});
			}
		});
	},
	$success$login : function(data) {
		if (data.success) {
			hui.ui.showMessage({text:'Du er nu logget ind, øjeblik...',icon:'common/success',delay:200});
			var page = hui.location.getParameter('page');
			document.location=page===null ? './index.php' : '.?page='+page;
		} else {
			hui.ui.showMessage({text:'Brugeren blev ikke fundet!',icon:'common/warning',duration:2000});
			formula.focus();
		}
	},
	
	$click$forgot : function() {
		hui.ui.changeState('recover');
		recoveryForm.focus();
	},
	
	$submit$recoveryForm : function() {
		var text = recoveryForm.getValues()['nameOrMail'];
		hui.ui.showMessage({text:'Leder efter bruger, og sender e-mail...',busy:true});
		hui.ui.request({
			url:'Services/Core/RecoverPassword.php',
			onSuccess:'recovery',
			parameters:{text:text},
			onFailure:function() {
				hui.ui.showMessage({text:'Der skete en fejl internt i systemet!',icon:'common/warning',duration:4000});
			}
		});
	},
	$success$recovery : function(data) {
		if (data.success) {
			hui.ui.hideMessage();
			hui.ui.changeState('recoveryMessage');
		} else {
			hui.ui.showMessage({text:data.message,icon:'common/warning',duration:4000});
		}
	}
}