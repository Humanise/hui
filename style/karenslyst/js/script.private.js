if(!op){var op={}}op.preview=false;op.page=op.page||{id:null,path:null,template:null};op.ignite=function(){if(!this.preview){document.onkeydown=function(j){j=hui.event(j);if(j.returnKey&&j.shiftKey){j.stop();var i;i=function(m){m=hui.event(m);if(m.returnKey){hui.unListen(document,"keyup",i);if(!hui.browser.msie&&!op.user.internal){m.stop();op.showLogin()}else{window.location=(op.page.path+"Editor/index.php?page="+op.page.id)}}};hui.listen(document,"keyup",i)}return true};hui.request({url:op.context+"services/statistics/",parameters:{page:op.page.id,referrer:document.referrer,uri:document.location.href}})}if(hui.browser.msie7){hui.onReady(function(){hui.cls.add(document.body.parentNode,"msie7")})}if(hui.browser.msie7||hui.browser.msie6){var g=hui.get.byClass(document.body,"shared_frame");for(var e=0;e<g.length;e++){g[e].style.width=g[e].clientWidth+"px";g[e].style.display="block"}var l=hui.get.byClass(document.body,"document_row");for(var e=l.length-1;e>=0;e--){var k=hui.build("table",{"class":l[e].className,style:l[e].style.cssText});var f=hui.build("tbody",{parent:k});var h=hui.build("tr",{parent:f});var c=hui.get.byClass(l[e],"document_column");for(var d=0;d<c.length;d++){var a=c[d];var b=hui.build("td",{"class":a.className,parent:h,style:a.style.cssText});while(a.firstChild){b.appendChild(a.firstChild)}}l[e].parentNode.insertBefore(k,l[e]);hui.dom.remove(l[e])}}};op.showLogin=function(){if(!this.loginBox){if(this.loadingLogin){hui.log("Aborting, the box is loading");return}this.loadingLogin=true;hui.ui.showMessage({text:{en:"Loading...",da:"Indlæser..."},busy:true,delay:300});hui.ui.require(["Formula","Button","TextField"],function(){hui.ui.hideMessage();var h=this.loginBox=hui.ui.Box.create({width:300,title:{en:"Access control",da:"Adgangskontrol"},modal:true,absolute:true,closable:true,curtainCloses:true,padding:10});this.loginBox.addToDocument();var f=this.loginForm=hui.ui.Formula.create();f.listen({$submit:function(){if(!h.isVisible()){return}var b=f.getValues();op.login(b.username,b.password)}});var e=f.buildGroup(null,[{type:"TextField",options:{label:{en:"Username",da:"Brugernavn"},key:"username"}},{type:"TextField",options:{label:{en:"Password",da:"Kodeord"},key:"password",secret:true}}]);var a=e.createButtons();var c=hui.ui.Button.create({text:{en:"Forgot password?",da:"Glemt kode?"}});c.listen({$click:function(){document.location=op.context+"Editor/Authentication.php?forgot=true"}});a.add(c);var d=hui.ui.Button.create({text:{en:"Cancel",da:"Annuller"}});d.listen({$click:function(){f.reset();h.hide();document.body.focus()}});a.add(d);a.add(hui.ui.Button.create({text:{en:"Log in",da:"Log ind"},highlighted:true,submit:true}));this.loginBox.add(f);this.loginBox.show();window.setTimeout(function(){f.focus()},100);this.loadingLogin=false;op.startListening();var i=new hui.Preloader({context:hui.ui.context+"hui/icons/"});i.addImages("common/success24.png");i.load()}.bind(this))}else{this.loginBox.show();this.loginForm.focus()}};op.startListening=function(){hui.listen(window,"keyup",function(c){c=hui.event(c);if(c.escapeKey&&this.loginBox.isVisible()){this.loginBox.hide();var b=hui.get.firstByTag(document.body,"a");if(b){b.focus();b.blur()}document.body.blur()}}.bind(this))};op.login=function(b,a){if(hui.isBlank(b)||hui.isBlank(a)){hui.ui.showMessage({text:{en:"Please fill in both fields",da:"Udfyld venligst begge felter"},duration:3000});this.loginForm.focus();return}hui.ui.request({message:{start:{en:"Logging in...",da:"Logger ind..."},delay:300},url:op.context+"Editor/Services/Core/Authentication.php",parameters:{username:b,password:a},$object:function(c){if(c.success){hui.ui.showMessage({text:{en:"You are now logged in",da:"Du er nu logget ind"},icon:"common/success",duration:4000});op.igniteEditor()}else{hui.ui.showMessage({text:{en:"The user was not found",da:"Brugeren blev ikke fundet"},icon:"common/warning",duration:4000})}},$failure:function(){hui.ui.showMessage({text:{en:"An internal error occurred",da:"Der skete en fejl internt i systemet"},icon:"common/warning",duration:4000})}})};op.igniteEditor=function(){window.location=(op.page.path+"Editor/index.php?page="+op.page.id)};op.showImage=function(a){if(!this.imageViewer){this.imageViewer=hui.ui.ImageViewer.create({maxWidth:2000,maxHeight:2000,perimeter:40,sizeSnap:10});this.imageViewer.listen(op.imageViewerDelegate)}this.imageViewer.clearImages();this.imageViewer.addImage(a);this.imageViewer.show()};op.registerImageViewer=function(b,a){hui.get(b).onclick=function(){op.showImage(a);return false}};op.imageViewerDelegate={$resolveImageUrl:function(c,e,a){var b=c.width?Math.min(e,c.width):e;var d=c.height?Math.min(a,c.height):a;return op.page.path+"services/images/?id="+c.id+"&width="+b+"&height="+d+"&format=jpg&quality=100"}};if(op.part===undefined){op.part={}}op.feedback=function(b){hui.require(op.page.path+"style/basic/js/Feedback.js",function(){op.feedback.Controller.init(b)})};window.define&&define("op");op.part.Formula=function(a){this.element=hui.get(a.element);this.id=a.id;this.inputs=a.inputs;hui.listen(this.element,"submit",this._send.bind(this))};op.part.Formula.prototype={_send:function(h){hui.stop(h);var g=[];for(var f=0;f<this.inputs.length;f++){var b=this.inputs[f];var j=hui.get(b.id);var c=b.validation;if(c.required){if(hui.isBlank(j.value)){hui.ui.showMessage({text:c.message,duration:2000});j.focus();return}}if(c.syntax=="email"&&!hui.isBlank(j.value)){var k=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\\n".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA\n-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;if(!k.test(j.value)){hui.ui.showMessage({text:c.message,duration:2000});j.focus();return}}g.push({label:b.label,value:j.value})}var a=op.page.path+"services/parts/formula/";var d={id:this.id,fields:g};hui.ui.showMessage({text:"Sender besked...",busy:true});hui.ui.request({url:a,json:{data:d},$success:this._success.bind(this),$failure:this._failure.bind(this)})},_success:function(){hui.ui.showMessage({text:"Beskeden er nu sendt",icon:"common/success",duration:2000});this.element.reset()},_failure:function(){hui.ui.showMessage({text:"Beskeden kunne desværre ikke afleveres",duration:5000})}};window.define&&define("op.part.Formula");op.part.Image=function(b){var a=this.element=hui.get(b.element);var e=a.src;var d=a.parentNode;d.style.position="relative";d.style.display="block";var c=hui.build("img",{src:a.src+"&contrast=-20&brightness=80&blur=30",style:"position: absolute; left: 0; top: 0;",parent:d});hui.animate({node:c,duration:1000,delay:1000,ease:hui.ease.flicker,css:{opacity:0}});hui.listen(c,"mouseover",function(){hui.animate({node:c,duration:500,delay:0,ease:hui.ease.fastSlow,css:{opacity:1}})});hui.listen(c,"mouseout",function(){hui.animate({node:c,duration:1000,delay:1000,ease:hui.ease.flicker,css:{opacity:0}})})};window.define&&define("op.part.Image");op.part.Poster=function(a){this.options=hui.override({duration:1500,interval:5000,delay:0},a);this.name=a.name;this.element=hui.get(a.element);this.container=hui.get.firstByClass(this.element,"part_poster_pages");this.pages=hui.get.byClass(this.element,"part_poster_page");this.index=0;this.indicators=[];this._buildNavigator();if(!this.options.editmode){window.setTimeout(this._callNext.bind(this),this.options.delay)}hui.listen(this.element,"click",this._onClick.bind(this));hui.ui.extend(this)};op.part.Poster.prototype={_buildNavigator:function(){this.navigator=hui.build("div",{"class":"part_poster_navigator",parent:this.element});for(var a=0;a<this.pages.length;a++){this.indicators.push(hui.build("a",{parent:this.navigator,data:a,href:"javascript://","class":a==0?"part_poster_current":""}))}},next:function(){var a=this.index+1;if(a>=this.pages.length){a=0}this.goToPage(a)},previous:function(){var a=this.index-1;if(a<0){a=this.pages.length-1}this.goToPage(a)},setPage:function(a){if(a===null||a===undefined||a==this.index||this.pages.length-1<a){return}this.pages[this.index].style.display="none";this.pages[a].style.display="block";this.index=a;for(var b=0;b<this.indicators.length;b++){hui.cls.set(this.indicators[b],"part_poster_current",b==a)}},goToPage:function(a){if(a==this.index){return}window.clearTimeout(this.timer);var b={container:this.container,duration:this.options.duration};b.hide={element:this.pages[this.index],effect:"slideLeft"};hui.cls.remove(this.indicators[this.index],"part_poster_current");this.index=a;b.show={element:this.pages[this.index],effect:"slideRight"};hui.cls.add(this.indicators[this.index],"part_poster_current");hui.transition(b);if(!this.options.editmode){this._callNext()}this.fire("pageChanged",a)},_callNext:function(){this.timer=window.setTimeout(this.next.bind(this),this.options.interval)},_onClick:function(c){c=hui.event(c);var b=c.findByTag("a");if(b&&hui.cls.has(b.parentNode,"part_poster_navigator")){this.goToPage(parseInt(b.getAttribute("data")))}}};window.define&&define("op.part.Poster");op.part.Map=function(a){this.options=hui.override({maptype:"roadmap",zoom:8},a);this.container=hui.get(a.element);hui.ui.onReady(this.initialize.bind(this))};op.part.Map.defered=[];op.part.Map.onReady=function(a){hui.log("onReady... loaded:"+this.loaded);if(this.loaded){a()}else{this.defered.push(a)}if(this.loaded===undefined){this.loaded=false;window.opMapReady=function(){hui.log("ready");for(var b=0;b<this.defered.length;b++){this.defered[b]()}window.opMapReady=null;this.loaded=true}.bind(this);hui.require("https://maps.googleapis.com/maps/api/js?sensor=false&callback=opMapReady")}};op.part.Map.types={roadmap:"ROADMAP",terrain:"TERRAIN"};op.part.Map.prototype={initialize:function(){hui.log("init");op.part.Map.onReady(this.ready.bind(this))},ready:function(){var b={zoom:this.options.zoom,center:new google.maps.LatLng(-34.397,150.644),mapTypeId:google.maps.MapTypeId[this.options.type.toUpperCase()],scrollwheel:false};var e=this.options.markers;if(this.options.center){b.center=new google.maps.LatLng(this.options.center.latitude,this.options.center.longitude)}this.map=new google.maps.Map(this.container,b);if(this.options.center){var a=new google.maps.Marker({position:new google.maps.LatLng(this.options.center.latitude,this.options.center.longitude),map:this.map,icon:new google.maps.MarkerImage(op.context+"style/basic/gfx/part_map_pin.png",new google.maps.Size(29,30),new google.maps.Point(0,0),new google.maps.Point(8,26))});var d=hui.get.firstByClass(this.element,"part_map_text");if(d){var c=new google.maps.InfoWindow({content:hui.build("div",{text:d.innerHTML,"class":"part_map_bubble"})});c.open(this.map,a)}return;var a=new google.maps.Marker({position:new google.maps.LatLng(this.options.center.latitude,this.options.center.longitude),map:this.map})}}};window.define&&define("op.part.Map");op.part.Movie=function(a){this.options=a;this.element=hui.get(a.element);this._attach()};op.part.Movie.prototype={_attach:function(){hui.listen(this.element,"click",this._activate.bind(this));var e=hui.get.firstByClass(this.element,"part_movie_poster");if(e){var d=e.getAttribute("data-id");if(d){var a=window.devicePixelRatio||1;var b=op.context+"services/images/?id="+d+"&width="+(e.clientWidth*a)+"&height="+(e.clientHeight*a);e.style.backgroundImage="url("+b+")"}else{var c=e.getAttribute("data-vimeo-id");if(c){this._vimeo(c,e)}}}},_activate:function(){var a=hui.get.firstByClass(this.element,"part_movie_body");var b=hui.get.firstByTag(this.element,"noscript");if(b){a.innerHTML=hui.dom.getText(b)}a.style.background=""},_vimeo:function(e,d){var a="callback_"+e;var c="http://vimeo.com/api/v2/video/"+e+".json?callback="+a;window[a]=function(f){d.style.backgroundImage="url("+f[0].thumbnail_large+")"};var b=hui.build("script",{type:"text/javascript",src:c,parent:document.head})}};window.define&&define("op.part.Movie");hui.transition=function(c){var e=c.hide,b=c.show;var a=hui.transition[b.effect],d=hui.transition[e.effect];hui.style.set(c.container,{height:c.container.clientHeight+"px",position:"relative"});hui.style.set(e.element,{width:c.container.clientWidth+"px",position:"absolute",boxSizing:"border-box"});hui.style.set(b.element,{width:c.container.clientWidth+"px",position:"absolute",display:"block",visibility:"hidden",boxSizing:"border-box"});hui.animate({node:c.container,css:{height:b.element.clientHeight+"px"},duration:c.duration+10,ease:hui.ease.slowFastSlow,onComplete:function(){hui.style.set(c.container,{height:"",position:""})}});d.beforeHide(e.element);d.hide(e.element,c.duration,function(){hui.style.set(e.element,{display:"none",position:"static",width:""})});a.beforeShow(b.element);hui.style.set(b.element,{display:"block",visibility:"visible"});a.show(b.element,c.duration,function(){hui.style.set(b.element,{position:"static",width:""})})};hui.transition.css=function(a){this.options=a};hui.transition.css.prototype={beforeShow:function(a){hui.style.set(a,this.options.hidden)},show:function(a,c,b){hui.animate({node:a,css:this.options.visible,duration:c,ease:hui.ease.slowFastSlow,onComplete:b})},beforeHide:function(a){hui.style.set(a,this.options.visible)},hide:function(a,c,b){hui.animate({node:a,css:this.options.hidden,duration:c,ease:hui.ease.slowFastSlow,onComplete:function(){b();hui.style.set(a,this.options.visible)}.bind(this)})}};hui.transition.dissolve=new hui.transition.css({visible:{opacity:1},hidden:{opacity:0}});hui.transition.scale=new hui.transition.css({visible:{opacity:1,transform:"scale(1)"},hidden:{opacity:0,transform:"scale(.9)"}});hui.transition.slideLeft=new hui.transition.css({visible:{opacity:1,marginLeft:"0%"},hidden:{opacity:0,marginLeft:"-100%"}});hui.transition.slideRight=new hui.transition.css({visible:{opacity:1,marginLeft:"0%"},hidden:{opacity:0,marginLeft:"100%"}});op.SearchField=function(a){a=this.options=hui.override({placeholderClass:"placeholder",placeholder:""},a);this.field=hui.get(a.element);this.field.onfocus=function(){if(this.field.value==a.placeholder){this.field.value="";hui.cls.add(this.field,a.placeholderClass)}else{this.field.select()}}.bind(this);this.field.onblur=function(){if(this.field.value==""){hui.cls.add(this.field,a.placeholderClass);this.field.value=a.placeholder}}.bind(this);this.field.onblur()};window.define&&define("op.SearchField");op.Dissolver=function(a){a=this.options=hui.override({wait:4000,transition:2000,delay:0},a);this.pos=Math.floor(Math.random()*(a.elements.length-0.00001));this.z=1;a.elements[this.pos].style.display="block";window.setTimeout(this.next.bind(this),a.wait+a.delay)};op.Dissolver.prototype={next:function(){this.pos++;this.z++;var b=this.options.elements;if(this.pos==b.length){this.pos=0}var a=b[this.pos];hui.style.setOpacity(a,0);hui.style.set(a,{display:"block",zIndex:this.z});hui.animate(a,"opacity",1,this.options.transition,{ease:hui.ease.slowFastSlow,onComplete:function(){window.setTimeout(this.next.bind(this),this.options.wait)}.bind(this)})}};window.define&&define("op.Dissolver");