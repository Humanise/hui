/** A progress indictator that shows progress from 0% to 100%
  @constructor
*/
hui.ui.ProgressIndicator = function(options) {
  this.element = hui.get(options.element);
  this.options = hui.override({opacity : .1}, options);
  this.size = options.size;
  this.name = options.name;
  this.value = 0;
  this._renderedValue = 0;
  hui.ui.extend(this);
  this._init();
};

/** Creates a new progress bar:
  @param o {Object} Options : {small:false}
*/
hui.ui.ProgressIndicator.create = function(options) {
  options = options || {};
  options.element = hui.build('div',{'class':'hui_progressindicator',style:'display: inline-block; vertical-align: middle; width:'+options.size+'px;height:'+options.size+'px;'});
  return new hui.ui.ProgressIndicator(options);
};

hui.ui.ProgressIndicator.prototype = {
  _init : function() {
    this.drawing = hui.ui.Drawing.create({parent:this.element,width:this.size,height:this.size});
    this.arc = this.drawing.addArc({
      center : {x:this.size/2,y:this.size/2},
        startDegrees : -90,
      endDegrees : -90,
        innerRadius : this.size/4,
      outerRadius : this.size/2,
      fill : 'rgba(0,0,0,' + this.options.opacity + ')'
    });
  },
  setValue : function(value) {
    if (value==this.value) {
      return;
    }
    var start = this._renderedValue;
    var dur = Math.max(200,Math.abs(value-start)*1000);
    hui.animate({
      node : this.element,
      duration : dur,
      ease: hui.ease.cubicOut,
      callback : function(node,pos) {
        var p = start+(value-start)*pos;
        this._renderedValue = p;
        this._draw(p);
      }.bind(this)
    });
    this.value = value;
  },
  _draw : function(value) {
    this.arc.update({
      center : {x:this.size/2,y:this.size/2},
      startDegrees : -90,
      endDegrees : Math.min(-90 + value * 360, 269.9999),
      innerRadius : this.size/3,
      outerRadius : this.size/2,
      fill : '#eee'
    });
  },
  reset : function() {
    var start = this._renderedValue;
    this._renderedValue = this.value = 0;
    hui.animate({
      node : this.element,
      duration : 300,
      ease : hui.ease.fastSlow,
      callback : function(node,pos) {
        var x = 1 - pos;
        this.arc.update({
          center : {x:this.size/2,y:this.size/2},
          startDegrees : -90,
          endDegrees : Math.min(-90 + (start+(1-start)*pos) * 360, 269.9999),
          innerRadius : this.size/4 * x,
          outerRadius : this.size/2 * x,
          fill : '#eee'
        });
      }.bind(this)
    });
  }
};