
In2iGui.VideoPlayer = function(options) {
	this.options = options;
	this.element = $(options.element);
	this.name = options.name;
	this.state = {duration:0,time:0,loaded:0};
	this.handlers = [In2iGui.VideoPlayer.HTML5,In2iGui.VideoPlayer.QuickTime];
	this.handler = null;
	In2iGui.extend(this);
	if (this.options.video) {
		In2iGui.onReady(function() {
			this.setVideo(this.options.video);
		}.bind(this));
	}
}

In2iGui.VideoPlayer.prototype = {
	setVideo : function(video) {
		this.handler = this.getHandler(video);
		this.element.update(this.handler.element);
		this.buildController();
	},
	getHandler : function(video) {
		for (var i=0; i < this.handlers.length; i++) {
			var handler = this.handlers[i];
			if (handler.isSupported(video)) {
				return new handler(video,this);
			}
		};
		if (video.type=='video/quicktime') {
			return new new In2iGui.VideoPlayer.QuickTime(video);
		} else if (video.type=='video/mp4') {
			return new new In2iGui.VideoPlayer.HTML5(video);
		}
	},
	buildController : function() {
		var e = new Element('div',{'class':'in2igui_videoplayer_controller'});
		this.playButton = new Element('a',{href:'javascript:void(0);','class':'in2igui_videoplayer_playpause'}).insert('wait!');
		this.playButton.observe('click',this.playPause.bind(this));
		this.status = new Element('span',{'class':'in2igui_videoplayer_status'});
		e.insert(this.playButton).insert(this.status);
		this.element.insert(e);
	},
	onCanPlay : function() {
		this.playButton.update('Play');
	},
	onLoad : function() {
		this.state.loaded = this.state.duration;
		this.updateStatus();
	},
	onDurationChange : function(duration) {
		this.state.duration = duration;
		this.updateStatus();
	},
	onTimeChange : function(time) {
		this.state.time = time;
		this.updateStatus();
	},
	onLoadProgressChange : function(progress) {
		this.state.loaded = progress;
		this.updateStatus();
	},
	playPause : function() {
		if (this.handler.isPlaying()) {
			this.pause();
		} else {
			this.play();
		}
	},
	play : function() {
		this.handler.play();
	},
	pause : function() {
		this.handler.pause();
	},
	updateStatus : function() {
		this.status.innerHTML = this.state.time+' / '+this.state.duration+' / '+this.state.loaded;
	}
}

///////// HTML5 //////////

In2iGui.VideoPlayer.HTML5 = function(video,player) {
	var e = this.element = new Element('video',{width:video.width,height:video.height,src:video.src});
	e.observe('load',player.onLoad.bind(player));
	e.observe('canplay',player.onCanPlay.bind(player));
	e.observe('durationchange',function(x) {
		player.onDurationChange(e.duration);
	});
	e.observe('timeupdate',function() {
		player.onTimeChange(this.element.currentTime);
	}.bind(this));
}

In2iGui.VideoPlayer.HTML5.isSupported = function(video) {
	if (n2i.browser.webkitVersion>528 && (video.type==='video/quicktime' || video.type==='video/mp4')) {
		return true;
	}
	return false;
}

In2iGui.VideoPlayer.HTML5.prototype = {
	pause : function() {
		this.element.pause();
	},
	play : function() {
		this.element.play();
	},
	getTime : function() {
		return this.element.currentTime;
	},
	isPlaying : function() {
		return !this.element.paused;
	}
}

///////// QuickTime //////////

In2iGui.VideoPlayer.QuickTime = function(video,player) {
	this.player = player;
	var e = this.element = new Element('object',{width:video.width,height:video.height+16,data:video.src,type:'video/quicktime'});
	e.update('<param value="true" name="controller"/>'
		+'<param value="true" name="enablejavascript"/>'
		+'<param value="undefined" name="posterframe"/>'
		+'<param value="false" name="showlogo"/>'
		+'<param value="false" name="autostart"/>'
		+'<param value="true" name="cache"/>'
		+'<param value="white" name="bgcolor"/>'
		+'<param value="false" name="aggressivecleanup"/>'
		+'<param value="true" name="saveembedtags"/>'
		+'<param value="true" name="postdomevents"/>');
		
	e.observe('qt_canplay',player.onCanPlay.bind(player));
	e.observe('qt_load',player.onLoad.bind(player));
	e.observe('qt_progress',function() {
		player.onLoadProgressChange(e.GetMaxTimeLoaded()/3000);
	});
	e.observe('qt_durationchange',function(x) {
		player.onDurationChange(e.GetDuration()/3000);
	});
	e.observe('qt_timechanged',function() {
		player.onTimeChange(e.GetTime());
	})
}

In2iGui.VideoPlayer.QuickTime.isSupported = function() {
	return true;
}

In2iGui.VideoPlayer.QuickTime.prototype = {
	pause : function() {
		window.clearInterval(this.observer);
		this.element.Stop();
	},
	play : function() {
		this.element.Play();
		this.observer = window.setInterval(this.observeVideo.bind(this),100);
	},
	observeVideo : function() {
		this.player.onTimeChange(this.element.GetTime()/3000);
	},
	getTime : function() {
		return this.element.GetTime();
	},
	isPlaying : function() {
		return this.element.GetRate()!==0;
	}
}

/* EOF */