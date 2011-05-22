/**
 * @constructor
 */
hui.ui.Calendar = function(o) {
	this.name = o.name;
	this.options = hui.override({startHour:7,endHour:24},o);
	this.element = hui.get(o.element);
	this.head = hui.firstByTag(this.element,'thead');
	this.body = hui.firstByTag(this.element,'tbody');
	this.date = new Date();
	hui.ui.extend(this);
	this.buildUI();
	this.updateUI();
	if (this.options.source) {
		this.options.source.listen(this);
	}
}

hui.ui.Calendar.prototype = {
	show : function() {
		this.element.style.display='block';
		if (this.options.source) {
			this.options.source.refresh();
		}
	},
	hide : function() {
		this.element.style.display='none';
	},
	/** @private */
	getFirstDay : function() {
		var date = new Date(this.date.getTime());
		date.setDate(date.getDate()-date.getDay()+1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		return date;
	},
	/** @private */
	getLastDay : function() {
		var date = new Date(this.date.getTime());
		date.setDate(date.getDate()-date.getDay()+7);
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		return date;
	},
	clearEvents : function() {
		this.events = [];
		var nodes = hui.byClass(this.element,'in2igui_calendar_event');
		for (var i=0; i < nodes.length; i++) {
			hui.dom.remove(nodes[i]);
		};
		this.hideEventViewer();
	},
	$objectsLoaded : function(data) {
		try {
			this.setEvents(data);
		} catch (e) {
			hui.log(e);
		}
	},
	$sourceIsBusy : function() {
		this.setBusy(true);
	},
	$sourceShouldRefresh : function() {
		return this.element.style.display!='none';
	},
	setEvents : function(events) {
		events = events || [];
		for (var i=0; i < events.length; i++) {
			var e = events[i];
			if (typeof(e.startTime)!='object') {
				e.startTime = new Date(parseInt(e.startTime)*1000);
			}
			if (typeof(e.endTime)!='object') {
				e.endTime = new Date(parseInt(e.endTime)*1000);
			}
		};
		this.setBusy(false);
		this.clearEvents();
		this.events = events;
		var self = this;
		var pixels = (this.options.endHour-this.options.startHour)*40;
		var week = this.getFirstDay().getWeekOfYear();
		var year = this.getFirstDay().getYear();
		hui.each(this.events,function(event) {
			var day = hui.byClass(self.body,'in2igui_calendar_day')[event.startTime.getDay()-1];
			if (!day) {
				return;
			}
			if (event.startTime.getWeekOfYear()!=week || event.startTime.getYear()!=year) {
				return;
			}
			var node = hui.build('div',{'class':'in2igui_calendar_event',parent:day});
			var top = ((event.startTime.getHours()*60+event.startTime.getMinutes())/60-self.options.startHour)*40-1;
			var height = (event.endTime.getTime()-event.startTime.getTime())/1000/60/60*40+1;
			height = Math.min(pixels-top,height);
			hui.setStyle(node,{'marginTop':top+'px','height':height+'px',visibility:'hidden'});
			var content = hui.build('div',{parent:node});
			hui.build('p',{'class':'in2igui_calendar_event_time',text:event.startTime.dateFormat('H:i'),parent:content});
			hui.build('p',{'class':'in2igui_calendar_event_text',text:event.text,parent:content});
			if (event.location) {
				hui.build('p',{'class':'in2igui_calendar_event_location',text:event.location,parent:content});
			}
			
			window.setTimeout(function() {
				hui.ui.bounceIn(node);
			},Math.random()*200)
			hui.listen(node,'click',function() {
				self.eventWasClicked(node);
			});
		});
	},
	/** @private */
	eventWasClicked : function(node) {
		this.showEvent(node);
	},
	setBusy : function(busy) {
		hui.setClass(this.element,'in2igui_calendar_busy',busy);
	},
	/** @private */
	updateUI : function() {
		var first = this.getFirstDay();		
		var days = hui.byClass(this.head,'day');
		for (var i=0; i < days.length; i++) {
			var date = new Date(first.getTime());
			date.setDate(date.getDate()+i);
			hui.dom.setText(days[i],date.dateFormat('l \\d. d M'));
		};
	},
	/** @private */
	buildUI : function() {
		var bar = hui.firstByClass(this.element,'in2igui_calendar_bar');
		this.toolbar = hui.ui.Toolbar.create({labels:false});
		bar.appendChild(this.toolbar.getElement());
		var previous = hui.ui.Button.create({name:'in2iguiCalendarPrevious',text:'',icon:'monochrome/previous'});
		previous.listen(this);
		this.toolbar.add(previous);
		var today = hui.ui.Button.create({name:'in2iguiCalendarToday',text:'Idag'});
		today.click(function() {this.setDate(new Date())}.bind(this));
		this.toolbar.add(today);
		var next = hui.ui.Button.create({name:'in2iguiCalendarNext',text:'',icon:'monochrome/next'});
		next.listen(this);
		this.toolbar.add(next);
		this.datePickerButton = hui.ui.Button.create({name:'in2iguiCalendarDatePicker',text:'Vælg dato...'});
		this.datePickerButton.listen(this);
		this.toolbar.add(this.datePickerButton);
		
		var time = hui.firstByClass(this.body,'in2igui_calendar_day');
		for (var i=this.options.startHour; i <= this.options.endHour; i++) {
			var node = hui.build('div',{'class':'in2igui_calendar_time',html:'<span><em>'+i+':00</em></span>'});
			if (i==this.options.startHour) {
				hui.addClass(node,'in2igui_calendar_time_first');
			}
			if (i==this.options.endHour) {
				hui.addClass(node,'in2igui_calendar_time_last');
			}
			time.appendChild(node);
		};
	},
	$click$in2iguiCalendarPrevious : function() {
		var date = new Date(this.date.getTime());
		date.setDate(this.date.getDate()-7);
		this.setDate(date);
	},
	$click$in2iguiCalendarNext : function() {
		var date = new Date(this.date.getTime());
		date.setDate(this.date.getDate()+7);
		this.setDate(date);
	},
	setDate: function(date) {
		this.date = new Date(date.getTime());
		this.updateUI();
		this.refresh();
		if (this.datePicker) {
			this.datePicker.setValue(this.date);
		}
	},
	$click$in2iguiCalendarDatePicker : function() {
		this.showDatePicker();
	},
	refresh : function() {
		this.clearEvents();
		this.setBusy(true);
		var info = {'startTime':this.getFirstDay(),'endTime':this.getLastDay()};
		this.fire('calendarSpanChanged',info);
		hui.ui.firePropertyChange(this,'startTime',this.getFirstDay());
		hui.ui.firePropertyChange(this,'endTime',this.getLastDay());
	},
	/** @private */
	valueForProperty : function(p) {
		if (p=='startTime') {
			return this.getFirstDay();
		}
		if (p=='endTime') {
			return this.getLastDay();
		}
		return this[p];
	},
	
	////////////////////////////////// Date picker ///////////////////////////
	showDatePicker : function() {
		if (!this.datePickerPanel) {
			this.datePickerPanel = hui.ui.BoundPanel.create();
			this.datePicker = hui.ui.DatePicker.create({name:'in2iguiCalendarDatePicker',value:this.date});
			this.datePicker.listen(this);
			this.datePickerPanel.add(this.datePicker);
			this.datePickerPanel.addSpace(3);
			var button = hui.ui.Button.create({name:'in2iguiCalendarDatePickerClose',text:'Luk',small:true,rounded:true});
			button.listen(this);
			this.datePickerPanel.add(button);
		}
		this.datePickerPanel.position(this.datePickerButton.getElement());
		this.datePickerPanel.show();
	},
	$click$in2iguiCalendarDatePickerClose : function() {
		this.datePickerPanel.hide();
	},
	$dateChanged$in2iguiCalendarDatePicker : function(date) {
		this.setDate(date);
	},
	
	//////////////////////////////// Event viewer //////////////////////////////
	
	showEvent : function(node) {
		if (!this.eventViewerPanel) {
			this.eventViewerPanel = hui.ui.BoundPanel.create({width:270,padding: 3});
			this.eventInfo = hui.ui.InfoView.create(null,{height:240,clickObjects:true});
			this.eventViewerPanel.add(this.eventInfo);
			this.eventViewerPanel.addSpace(5);
			var button = hui.ui.Button.create({name:'in2iguiCalendarEventClose',text:'Luk'});
			button.listen(this);
			this.eventViewerPanel.add(button);
		}
		this.eventInfo.clear();
		this.eventInfo.setBusy(true);
		this.eventViewerPanel.position(node);
		this.eventViewerPanel.show();
		hui.ui.callDelegates(this,'requestEventInfo');
		return;
	},
	updateEventInfo : function(event,data) {
		this.eventInfo.setBusy(false);
		this.eventInfo.update(data);
	},
	click$in2iguiCalendarEventClose : function() {
		this.hideEventViewer();
	},
	hideEventViewer : function() {
		if (this.eventViewerPanel) {
			this.eventViewerPanel.hide();
		}
	}
}

/* EOF */