(function (_super) {

  var ns = 'hui_presentation';

  /**
   * Vertical rows
   * @class
   * @augments hui.ui.Component
   * @param {Object} options
   */
  hui.ui.Presentation = function(options) {
    _super.call(this, options);
    this.items = [];
    this.images = [];
    hui.cls.add(this.element,'hui-is-light');
    this.nativeScroll = !!navigator.userAgent.match('iPhone|iPad|iPod|Safari') && !window.chrome && hui.browser.webkitVersion > 603;
    //this.nativeScroll = false;
    this._attach();
  };

  hui.ui.Presentation.create = function(options) {
    options = options || {};
    var makeIcon = function(body, size) {
      return '<svg class="' + ns + '_icon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '">' + body + '</svg>';
    };
    var close = makeIcon(
      '<line class="' + ns + '_line" x1="1" y1="1" x2="31" y2="31"/>' +
      '<line class="' + ns + '_line" x1="1" y1="31" x2="31" y2="1"/>'
    );
    close = makeIcon('<path class="' + ns + '_line" d="M1,1l30,30 M1,31L31,1"/>', 32);
    close = makeIcon('<path class="' + ns + '_line" d="M1,1l20,20 M1,21L21,1"/>', 22);
    var right = makeIcon('<path class="' + ns + '_line" d="M8.5,31l15-15L8.5,1"/>', 32);
    var left = makeIcon('<path class="' + ns + '_line" d="M23.5,1l-15,15l15,15"/>', 32);
    options.element = hui.build('div', {
      'class' : ns,
      html : '<div class="' + ns + '_viewer id-viewer"><div class="' + ns + '_items id-items"></div></div>' +
        '<div class="' + ns + '_thumbnails id-thumbs"></div>'+
        '<div class="' + ns + '_close id-close">' + close + '</div>'+
        '<div class="' + ns + '_arrow ' + ns + '_next id-next">' + right + '</div>'+
        '<div class="' + ns + '_arrow ' + ns + '_previous id-previous">' + left + '</div>',
      parent: document.body
    });
    if (!hui.browser.touch) {
      hui.cls.add(options.element,'hui-is-mouse');
    }
    return new hui.ui.Presentation(options);
  };

  hui.ui.Presentation.prototype = {
    position: 0,
    index : 0,
    width: 0,
    animating: false,
    nodes : {
      viewer : '.id-viewer',
      items : '.id-items',
      thumbs : '.id-thumbs',
      close : '.id-close',
      next : '.id-next',
      previous : '.id-previous'
    },
    _attach : function() {
      hui.on(this.nodes.close,'tap',this.close, this);
      hui.on(this.nodes.next,'tap',this.next, this);
      hui.on(this.nodes.previous,'tap',this.previous, this);
      hui.on(this.nodes.thumbs,'tap',this._tapThumbs, this);
      if (this.nativeScroll) {
        hui.cls.add(this.element,'hui-is-native-scroll');
        this._attachNative();
      } else {
        this._attachDrag();
      }
    },
    close : function(e) {
      if (e) hui.event(e).stop();
      hui.cls.remove(this.element,'hui-is-open');
      this._lockScroll(false);
    },
    _attachNative : function() {
      var x,y;
      var moved = false;
      hui.listen(this.element,'touchstart',function(e) {
        moved = false;
      }.bind(this));
      hui.listen(this.element,'touchmove',function(e) {
        if (e.touches && e.touches.length == 2) {
          if (x===undefined) {x = e.pageX;}
          if (y===undefined) {y = e.pageY;}
          var img = this.images[this.index];
          var newX = e.pageX - x + img.x;
          var newY = e.pageY - y + img.y;
          var scale = (e.scale) * (img.scale);
          img.newScale = scale;
          img.newX = newX;
          img.newY = newY;
          img.node.style.transform =  'scale(' + scale + ') translate(' + (newX)/scale + 'px,' + (newY)/scale + 'px)';
        }
        if (e.touches && e.touches.length > 1) {
          e.preventDefault();
        }
        moved = true;
        //console.log('Scale', e.scale);
      }.bind(this));
      hui.listen(this.element,'touchend',function(e) {
        x = y = undefined;
        this.images.forEach(function(img) {
          if (img.newScale) {
            img.scale = img.newScale;
            img.newScale = undefined;
          }
          if (img.newX) {
            img.x = img.newX;
            img.newX = undefined;
          }
          if (img.newY) {
            img.y = img.newY;
            img.newY = undefined;
          }
        });
        if (!moved && hui.dom.isDescendantOrSelf(e.target, this.nodes.viewer)) {
          var img = this.images[this.index];
          if (img.scale != 1) {
            img.node.style.transition = 'transform .3s';
            img.node.style.transform = 'scale(1) translate(0px,0px)';
            setTimeout(function() {
              img.node.style.transition = '';
            },350);
            img.scale = 1;
            img.x = img.y = 0;
          } else {
            this._toggleThumbs();
          }
        }
      }.bind(this));
      var timer;
      var scrollEnd = function() {
        var width = this.nodes.viewer.clientWidth;
        var scrl = this.nodes.viewer.scrollLeft;
        this.index = Math.round(scrl / width);
      }.bind(this);
      hui.listen(this.nodes.viewer,'scroll',function(e) {
        //console.log('Scroll', e);
        clearTimeout(timer);
        timer = setTimeout(scrollEnd,150);
      });
    },
    _originalScroll : 0,
    _lockScroll : function(lock) {
      if (lock) {
        this._originalScroll = document.body.scrollTop;
      }
      lock = lock ? 'hidden' : '';
      document.body.parentNode.style.overflow = lock;
      document.body.style.overflow = lock;
      if (!lock) {
        document.body.scrollTop = this._originalScroll;
      }
    },
    /** Go to the previous image
     * @param {Boolean} user If it is initiated by the user
     */
    previous : function(e) {
      if (e) hui.stop(e);
      this.index--;
      var num = 1;
      if (this.index < 0) {
        this.index = this.items.length - 1;
        num = this.items.length;
      }
      this._goToImage(true,num,true);
    },
    /** Go to the next image
     * @param {Boolean} user If it is initiated by the user
     */
    next : function(e) {
      if (e) hui.stop(e);
      this.index++;
      var num = 1;
      if (this.index==this.items.length) {
        this.index = 0;
        num = this.items.length;
      }
      this._goToImage(true,num,true);
    },
    show : function(params) {
      params = params || {};
      if (params.source) {
        var pos = hui.position.get(params.source);
        hui.cls.add(this.element,'hui-is-minimized');
      }
      hui.cls.add(this.element,'hui-is-open');
      this._calculateSize();
      if (params.items) {
        this.items = params.items;
        this._rebuild();
      }
      if (hui.isNumber(params.index)) {
        this.index = params.index;
        this._goToImage(false, 0, false);
      }
      this._lockScroll(true);
    },
    _tapThumbs : function(e) {
      e = hui.event(e);
      var thumb = e.findByClass(ns + '_thumbnail');
      if (thumb) {
        var index = parseInt(thumb.getAttribute('data'),10);
        this._goTo(index);
      }
    },
    _rebuild : function() {
      this.images = [];
      this.nodes.items.innerHTML = '';
      this.nodes.thumbs.innerHTML = '';
      for (var i = 0; i < this.items.length; i++) {
        var url = hui.ui.callDelegates(this,'getPreview',{item: this.items[i], index: i});
        var item = hui.build('div',{parent : this.nodes.items, 'class' : ns+'_item'});
        var image = hui.build('div',{parent : item, 'class' : ns+'_image'});
        var content = hui.build('div',{parent : image, 'class' : ns+'_image_content'});
        var thumb = hui.build('div',{parent : this.nodes.thumbs, 'class' : ns+'_thumbnail', data:i});
        if (url) {
          content.style.backgroundImage = 'url(' + url + ')';
          thumb.style.backgroundImage = 'url(' + url + ')';
        }
        this.images.push({node:content,scale:1,x:0,y:0});
      }
      hui.cls.set(this.element, 'hui-is-multiple', this.items.length > 1);
      this._updateImages();
    },
    _updateImages : function() {
      if (!this.items.length) { return; }
      var width = this.nodes.viewer.clientWidth,
        height = this.nodes.viewer.clientHeight,
      thumbs = hui.get.children(this.nodes.thumbs);
      var thumbSize = thumbs[0].clientWidth;
      var load = function(url,node) {
        var img = new Image();
        img.onload = function() {
          node.style.backgroundImage = "url('" + url + "')";
        };
        img.src = url;
      };
      var ratio = window.devicePixelRatio > 1 ? 2 : 1;
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var url = hui.ui.callDelegates(this,'getImage',{item: item, width: width * ratio, height: height * ratio});
        load(url, this.images[i].node);
        //images[i].style.backgroundImage = "url('" + url + "')";
        var thmbUrl = hui.ui.callDelegates(this,'getImage',{item: item, width: thumbSize * ratio, height: thumbSize * ratio});
        load(thmbUrl, thumbs[i]);
        //thumbs[i].style.backgroundImage = "url('" + url + "')";
      }
    },
    _calculateSize : function() {
      this.width = this.nodes.viewer.clientWidth;
    },
    $$layout : function() {
      this._calculateSize();
      this._updateImages();
    },
    _draw : function() {
      this.nodes.items.style.transform = 'translate3d(' + this.position + 'px,0,0)';
    },
    _attachDrag : function() {
      var initial = 0;
      var left = 0;
      var scrl = 0;
      var viewer = this.nodes.viewer;
      var inner = this.nodes.items;
      var max = 0;
      var stmp;
      var currentSlide;
      var speed = 0;
      hui.drag.attach({
        touch : true,
        element : viewer,
        $check : function() {
          return !this.animating;
        }.bind(this),
        $startMove : function(e) {
          initial = e.getLeft();
          scrl = this.position;
          max = (this.items.length-1) * this.width * -1;
          stmp = e.event.timeStamp;
          speed = 0;
        }.bind(this),
        $move : function(e) {
          var latestLeft = left;
          left = e.getLeft();
          var pos = (scrl - (initial - left));
          if (pos > 0) {
            pos = (Math.exp(pos * -0.013) -1) * -80;
          }
          if (pos < max) {
            pos = (Math.exp((pos - max) * 0.013) -1) * 80 + max;
          }
          this.position = pos;
          var dur = (e.event.timeStamp - stmp);
          var curSpeed = dur > 0 ? (latestLeft - left) / dur : 0;
          speed = (speed + curSpeed) / 2;
          //console.log(speed);
          stmp = e.event.timeStamp;
          this._draw();
        }.bind(this),
        $endMove : function(e) {
          var func = (initial - left) < 0 ? Math.floor : Math.ceil;
          this.index = func(this.position * -1 / this.width);
          var num = this.items.length - 1;
          if (this.index==this.items.length) {
            this.index = 0;
            this.index = this.items.length - 1;
          } else if (this.index < 0) {
            this.index = this.items.length - 1;
            this.index = 0;
          } else {
            num = 1;
          }

          this._goToImage(true,num,false,true, Math.abs(speed));
        }.bind(this),
        $notMoved : this._toggleThumbs.bind(this)
      });
    },
    _toggleThumbs : function() {
      if (this.items.length > 1) {
        hui.cls.toggle(this.element,'hui-is-thumbnails');
      }
    },
    _goTo : function(index) {
      if (this.index == index) {
        return;
      }
      var diff = Math.abs(this.index - index);
      this.index = index;
      this._goToImage(true, diff, false);
    },
    _goToImage : function(animate,num,user,drag,speed) {
      if (this.nativeScroll) {
        var viewer = this.nodes.viewer,
          scrl = viewer.clientWidth * this.index;
        if (animate) {
          hui.animate({
            node: viewer,
            duration: 500,
            property: 'scrollLeft',
            value: scrl,
            ease: hui.ease.fastSlow
          });
        } else {
          if (hui.browser.webkitVersion < 603) {
            setTimeout(function() {
              viewer.scrollTo(scrl,0);
            });
          } else {
            this.nodes.viewer.scrollLeft = scrl;
          }
        }
        return;
      }
      speed = speed || 2;
      var initial = this.position;
      var target = this.position = this.index * (this.width) * -1;
      if (animate) {
        var duration, ease;
        if (drag) {
          duration = 300 / speed;
          ease = hui.ease.quadOut;
          duration = Math.min(800,Math.max(200, duration));
        }
        else if (num > 1) {
          duration = Math.min(num * 500, 2000);
          ease = hui.ease.fastSlow;
        } else {
          var end = this.index === 0 || this.index === this.items.length - 1;
          ease = (end ? hui.ease.elastic : hui.ease.fastSlow);
          if (!user) {
            ease = hui.ease.fastSlow;
          }
          duration = (end ? 1000 : 1000 / speed);
        }
        this.animating = true;
        hui.animate({
          node : this.nodes.items,
          //css : {marginLeft : target + 'px'},
          duration : duration,
          ease : ease,
          $render : function(node,v) {
            this.position = initial + (target - initial) * v;
            this._draw();
          }.bind(this),
          $complete : function() {
            this.animating = false;
          }.bind(this)
        });
      } else {
        this._draw();
      }
    }
  };

  hui.extend(hui.ui.Presentation, _super);

  hui.define('hui.ui.Presentation', hui.ui.Presentation);

})(hui.ui.Component);