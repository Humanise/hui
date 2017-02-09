/**
 * A preloader for images
 * @constructor
 * @param options {Object}
 * @param options.context {String} Prefix for all URLs
 */
hui.Preloader = function(options) {
  this.options = options || {};
  this.delegate = {};
  this.images = [];
  this.loaded = 0;
};

hui.Preloader.prototype = {
  /** Add images either as a single url or an array of urls */
  addImages : function(imageOrImages) {
    if (typeof(imageOrImages)=='object') {
      for (var i=0; i < imageOrImages.length; i++) {
        this.images.push(imageOrImages[i]);
      }
    } else {
      this.images.push(imageOrImages);
    }
  },
  /**
   * Set the delegate (listener)
   * @param {Object} listener
   */
  setDelegate : function(listener) {
    this.delegate = listener;
  },
  /**
   * Start loading images beginning at startIndex
   */
  load : function(startIndex) {
    startIndex = startIndex || 0;
    var self = this;
    this.obs = [];
    var onLoad = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidLoad');};
    var onError = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidGiveError');};
    var onAbort = function() {self._imageChanged(this.huiPreloaderIndex,'imageDidAbort');};
    for (var i=startIndex; i < this.images.length+startIndex; i++) {
      var index=i;
      if (index>=this.images.length) {
        index = index-this.images.length;
      }
      var img = new Image();
      img.huiPreloaderIndex = index;
      img.onload = onLoad;
      img.onerror = onError;
      img.onabort = onAbort;
      img.src = (this.options.context ? this.options.context : '')+this.images[index];
      this.obs.push(img);
    }
  },
  _imageChanged : function(index,method) {
    this.loaded++;
    if (this.delegate[method]) {
      this.delegate[method](this.loaded,this.images.length,index);
    }
    if (this.loaded==this.images.length && this.delegate.allImagesDidLoad) {
      this.delegate.allImagesDidLoad();
    }
  }
};