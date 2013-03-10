var line1,circle,arc;
	hui.onReady(function() {
		var d = hui.ui.Drawing.create({width:500,height:500,parent:'drawing'});
	
		var center = {x:250,y:250};
	
	
		var arc1 = d.addArc({center : center,fill : 'rgba(0,0,0,.08)'});
		var arc2 = d.addArc({center : center,fill : 'rgba(0,0,0,.05)'});
		var arc3 = d.addArc({center : center,fill : 'rgba(0,0,0,.08)'});
		var arc4 = d.addArc({center : center,fill : 'rgba(0,0,0,.05)'});
		
		var circle = d.addCircle({cx:250,cy:250,r:0,fill:'rgba(0,0,0,.1)',width:0});
		startArc(arc1,-90,0,0)
		startArc(arc2,0,90,10)
		startArc(arc3,90,180,0)
		startArc(arc4,180,270,10)
		startCircle(circle)
		var title = hui.get('title');
		var text = hui.dom.getText(title);
		hui.dom.clear(title);
		var chars = [];
		for (var i=0; i < text.length; i++) {
			chars.push(hui.build('span',{text:text[i],parent:title,style:{opacity:0}}));
		};
		for (var i=0; i < chars.length; i++) {
			var x = Math.random()*2000;
			hui.animate({node:chars[i],css:{opacity:1},delay:1500+x,ease:hui.ease.flicker,duration:4000-x})
			
		};
		hui.animate({node:'slogan',css:{opacity:1,paddingTop:'0px'},delay:6000,ease:hui.ease.fastSlow,duration:2000})
	})
	
	var skew = 30;
	
	function startCircle(shape) {
		hui.animate({ node : shape,
			delay: 2000,
			duration: 2000,
			ease : hui.ease.elastic,
			$render : function(shape,pos) {
				shape.setRadius(pos*50)
			},
			$complete : function() { loopCircle(shape);}
		})
	}
	
	function loopCircle(shape) {
		var x = Math.random()*-20;
		hui.animate({ node : shape,
			//delay : 2000 * Math.random(),
			duration: 2000 + 2000 * Math.random(),
			ease : hui.ease.slowFastSlow,
			$render : function(shape,pos) {
				shape.setRadius(50 + Math.sin(pos*Math.PI)*x)
			},
			$complete : function() { loopCircle(shape);}
		})
	}
	
	function startArc(arc,start,end,extra) {
		var ran = Math.random()*3000;
		var turns = Math.round(Math.random()*3)+1;
		hui.animate({ node : arc,
			duration : 8000-ran,
			delay : ran,
			ease : hui.ease.elastic,
			$render : function(node,pos) {
				arc.update({
			  		startDegrees : (start+3)*pos + 360*turns*pos + skew,
					endDegrees : (end+-3) + 360*turns*pos + skew,
					innerRadius : 120 + pos*-60,
					outerRadius : 120 + pos*-60 + pos*(70+extra)
				})
			},
			$complete : function() { loopArc(arc,start,end,extra);}
		})
	}
	
	
	function loopArc(arc,start,end,extra) {
		var dir = Math.random()>.5 ? 1 : -1;
		var turns = Math.random()>.5 ? 1 : 2;
		var delay = Math.random()*500;
		var radiusBulge = Math.random()*60 - 30;
		var innerBulge = Math.random() * 60 - 30 * Math.random();
		var dur = Math.round(Math.random()*3)+1;
		hui.animate({ node : arc,
			delay : delay,
			duration : 1500 * dur - delay,
			ease : hui.ease.slowFastSlow,
			$render : function(node,pos) {
				arc.update({
			  		startDegrees : start+3 + 360 * pos * turns * dir + skew,
					endDegrees : end-3 + 360 * pos * turns * dir + skew + 30*turns*Math.sin(pos*Math.PI),
					innerRadius : 60 + Math.sin(pos*Math.PI) * innerBulge + 45*Math.sin(pos*Math.PI),
					outerRadius : (130+extra) + Math.sin(pos*Math.PI) * radiusBulge
				})
			},
			$complete : function() { loopArc(arc,start,end,extra);}
		})
	}