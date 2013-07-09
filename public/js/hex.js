var HoneycombGallery;

(function() {

  // query string parse for params
  var getQueryParam = function(param) {
    var query = window.location.search;
    query = query.slice(1);
    var params = query.split('&');
    for (var i = 0; i < params.length; i++) {
      var pair = params[i].split('=');
      if (pair[0] === param) {
        return pair[1];
      }
    }
    return;
  };

  var rows = getQueryParam('rows') || 4;
  var pad = getQueryParam('pad') || 10;
  var bg1 = getQueryParam('bg1') || 'rgba(0,0,0,0.8)';
  var bg2 = getQueryParam('bg2') || 'rgba(0,0,0,0.8)';

  // zero out scroll onload
  var zeroOut = function() {
    window.scroll(0, 0);
  };
  window.onload = zeroOut;

  HoneycombGallery = function(options) {

    // extend default options with options provided by user
    $.extend(this.options, options);

    // grab honeycomb elements
    this.$body = $('body');
    this.$honeycomb = $('.honeycomb');
    this.$featured = $('.featured');
    this.$border = $('<div class="border">');


    // collection of current images
    this._imgCollection = [];

    // IG limits response media to 20 at a time 
    // this is a request counter to submit n subsequent requests for images
    this.requestCounter = 10;

    // initialize honeycomb
    this.init();

  };

  // default options
  HoneycombGallery.prototype.options = {
    hashtag: window.location.pathname.substr(1),
    scrollSpeed: 'slow',
    allowVideo: true,
    highRes: false,
    feature: true,
    numRows: rows,
    padding: pad,
    topRow: {
      backgroundOne: bg1,
      backgroundTwo: bg2
    },
    bottomRow: {}
  };

  // get dimensions of current window
  HoneycombGallery.prototype.dimensions = {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth
  };

  // intialize honeycomb
  HoneycombGallery.prototype.init = function() {

    // context for setTimeout/setInterval functions
    var self = this;

    // set honeycomb height to window height
    this.$honeycomb.css({'height': this.dimensions.windowHeight});

    // set body width to expand as long as needed
    this.$body.css({'width' : '999999999999px'});


    // calculate hexagon height
    // h = 2windowHeight / numRows + 1
    // to account for padding we first subtract half of one side of the equalateral triangle created by each tesselation
    // then we add back the length of one side of the triangle split evenly among the number of rows to allow the top and bottom of the honeycomb to be even with window
    this.dimensions.hexHeight = (2 * this.dimensions.windowHeight) / (this.options.numRows + 1) - (this.options.padding/Math.sqrt(3)) + (2 * this.options.padding/(Math.sqrt(3)*this.options.numRows));

    // calculate hexagon width
    // w = h * sqrt(3)
    // to account for padding we simply add it to our width
    this.dimensions.hexWidth = (this.dimensions.hexHeight * Math.sqrt(3)) + this.options.padding;

    this.getImages(this.renderHoneycomb);

    // allow the page 2 seconds to load before starting auto-scroll
    setTimeout(function(){
      self.electricSlide();
    }, 2000);

    // begin highlighting images every 10 seconds if option set to true
    if (self.options.feature) {
      setTimeout(function() {
        self.highlightImg();
      }, 10000);
    }

    // setInterval to restart get more images process every 5 minutes
    setInterval(function() {
      self.getImages(self.addToHoneyComb);
    }, 60000 * 5);
  };


  HoneycombGallery.prototype.getImages = function(callback, data) {

    // context for success function
    var self = this;

    // setup of data object
    data = data || {};

    // jQuery ajax request with callback on success
    // set honeycomb image collection to response
    $.ajax({
      url: '/api/images' + window.location.pathname,
      data: data,
      success: function(response){
        console.log(response);
        self._imgCollection = self._imgCollection.concat(response.media);
        callback.call(self, response.media);
        if (self.requestCounter) {
          self.getImages(self.addToHoneyComb, {url: response.next_url});
          self.requestCounter--;
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  };


  HoneycombGallery.prototype.renderHoneycomb = function(images) {
    var media,
        mediaUrl,
        $row,
        hexHtml,
        topRowBG,
        bottomRowBG,
        topRowHtml = '',
        bottomRowHtml = '',
        $topRow,
        $bottomRow,
        counter = 0;

    $topRow = $('<div class="hex-row" id="top-row" style="top:'+(-((this.dimensions.hexHeight/2) + (this.options.padding/Math.sqrt(3)/2)))+'px;"></div>');

    if (this.options.numRows % 2) {
      $bottomRow = $('<div class="hex-row" id="bottom-row" style="top:'+(this.options.numRows * ((this.dimensions.hexHeight/2) + (this.options.padding/Math.sqrt(3)/2)))+'px;"></div>');
    } else {
      $bottomRow = $('<div class="hex-row" id="bottom-row" style="top:'+(this.options.numRows * ((this.dimensions.hexHeight/2) + (this.options.padding/Math.sqrt(3)/2)))+'px; left:'+(this.dimensions.hexWidth/2)+'px"></div>');
    }

    for (var i = 0; i < this.options.numRows; i++) {

      // determine if current row is odd or even
      if (i % 2 === 0) {
        $row = $('<div class="hex-row" id="row-'+i+'" style="top:'+(i * ((this.dimensions.hexHeight/2) + (this.options.padding/Math.sqrt(3)/2)))+'px; left:'+(this.dimensions.hexWidth/2)+'px"></div>');
      } else {
        $row = $('<div class="hex-row" id="row-'+i+'" style="top:'+(i * ((this.dimensions.hexHeight/2) + (this.options.padding/Math.sqrt(3)/2)))+'px;"></div>');
      }

      // reset hexHtml to empty string for concatenting
      hexHtml = '';

      // split images evenly among rows and create correct HTML for images and videos
      for (var j = 0, l = Math.floor(images.length/this.options.numRows); j < l; j++) {

        // create top row of honeycomb on first loop
        if (i === 0) {
          topRowBG = j % 2 ? this.options.topRow.backgroundTwo : this.options.topRow.backgroundOne;
          topRowHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                          '<div class="hex-inner1">'+
                            '<div class="hex-inner2 inner-special" style="background: '+topRowBG+'">'+
                              '<span class="overlay bottom-right hashtag">#'+this.options.hashtag+'</span>'+
                            '</div>'+
                          ' </div>'+
                        ' </div>';
        }

        // create bottom row of honeycomb on last loop
        if (i === this.options.numRows - 1) {
          bottomRowBG = j % 2 ? this.options.bottomRow.backgroundTwo : this.options.bottomRow.backgroundOne;
          bottomRowHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                              '<div class="hex-inner1">'+
                              '<div class="hex-inner2 inner-special" style="background: '+bottomRowBG+'"></div>'+
                            '</div>'+
                          '</div>';
        }

        // select next image or video from collection and create row
        media = images[counter];

        // filter media urls and element types based on available options
        if (this.options.allowVideo && media.type === 'video') {
          hexHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                         '<div class="hex-inner1">'+
                           '<div class="hex-inner2">'+
                             '<span class="overlay bottom-right username"><i class="icon-instagram"></i> @'+media.user.username+'</span>'+
                             '<video class="background" src="'+media.videos.low_resolution.url+'" preload="auto" loop autoplay muted>'+
                           '</div>'+
                        ' </div>'+
                      ' </div>';
          counter++;
        } else if (!this.options.highRes || media.type === 'video') {
          mediaUrl = media.type === 'video' ? media.videos.low_resolution.url : media.images.thumbnail.url;
          hexHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                         '<div class="hex-inner1">'+
                           '<div class="hex-inner2" style="background-image: url('+mediaUrl+')">'+
                             '<span class="overlay bottom-right username"><i class="icon-instagram"></i> @'+media.user.username+'</span>'+
                           '</div>'+
                        ' </div>'+
                      ' </div>';
          counter++;
        } else {
          hexHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                         '<div class="hex-inner1">'+
                           '<div class="hex-inner2" style="background-image: url('+media.images.low_resolution.url+')">'+
                             '<span class="overlay bottom-right username"><i class="icon-instagram"></i> @'+media.user.username+'</span>'+
                           '</div>'+
                        ' </div>'+
                      ' </div>';
          counter++;
        }
      }

      // append top row on first loop
      if (i === 0) {
        $topRow.append(topRowHtml);
        this.$honeycomb.append($topRow);
      }

      // append concatenated html string to row and append row to honeycomb
      $row.append(hexHtml);
      this.$honeycomb.append($row);

      // append bottom row at end of last loop
      if (i === this.options.numRows - 1) {
        $bottomRow.append(bottomRowHtml);
        this.$honeycomb.append($bottomRow);
      }
    }
  };

  HoneycombGallery.prototype.addToHoneyComb = function(images) {
    var media,
        mediaUrl,
        $row,
        hexHtml,
        topRowBG,
        bottomRowBG,
        topRowHtml = '',
        bottomRowHtml = '',
        $topRow = $('#top-row'),
        $bottomRow = $('#bottom-row'),
        counter = 0;


    for (var i = 0; i < this.options.numRows; i++) {

      $row = $('#row-'+i);
      hexHtml = '';

      for (var j = 0, l = Math.floor(images.length/this.options.numRows); j < l; j++) {

        // create and append top row of honeycomb on first loop
        if (i === 0) {
          topRowBG = j % 2 ? this.options.topRow.backgroundTwo : this.options.topRow.backgroundOne;
          topRowHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                          '<div class="hex-inner1">'+
                            '<div class="hex-inner2 inner-special" style="background: '+topRowBG+'">'+
                              '<span class="overlay bottom-right hashtag">#'+this.options.hashtag+'</span>'+
                            '</div>'+
                          ' </div>'+
                        ' </div>';
        }

        // create and append bottom row of honeycomb on last loop
        if (i === this.options.numRows - 1) {
          bottomRowBG = j % 2 ? this.options.bottomRow.backgroundTwo : this.options.bottomRow.backgroundOne;
          bottomRowHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                              '<div class="hex-inner1">'+
                              '<div class="hex-inner2 inner-special" style="background: '+bottomRowBG+'"></div>'+
                            '</div>'+
                          '</div>';
        }

        // select next image or video from collection and create row
        media = images[counter];
        if (this.options.allowVideo && media.type === 'video') {
          hexHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                         '<div class="hex-inner1">'+
                           '<div class="hex-inner2">'+
                             '<span class="overlay bottom-right username"><i class="icon-instagram"></i> @'+media.user.username+'</span>'+
                             '<video class="background" src="'+media.videos.low_resolution.url+'" preload="auto" loop autoplay muted>'+
                           '</div>'+
                        ' </div>'+
                      ' </div>';
          counter++;
        } else if (!this.options.highRes || media.type === 'video') {
          mediaUrl = media.type === 'video' ? media.videos.low_resolution.url : media.images.thumbnail.url;
          hexHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                         '<div class="hex-inner1">'+
                           '<div class="hex-inner2" style="background-image: url('+mediaUrl+')">'+
                             '<span class="overlay bottom-right username"><i class="icon-instagram"></i> @'+media.user.username+'</span>'+
                           '</div>'+
                        ' </div>'+
                      ' </div>';
          counter++;
        } else {
          hexHtml += '<div class="hexagon" style="width:'+this.dimensions.hexWidth+'px; height:'+this.dimensions.hexHeight+'px">'+
                         '<div class="hex-inner1">'+
                           '<div class="hex-inner2" style="background-image: url('+media.images.low_resolutions.url+')">'+
                             '<span class="overlay bottom-right username"><i class="icon-instagram"></i> @'+media.user.username+'</span>'+
                           '</div>'+
                        ' </div>'+
                      ' </div>';
          counter++;
        }
      }

      // append new hexagons to honeycomb
      $row.append(hexHtml);
    }

    $topRow.append(topRowHtml);
    $bottomRow.append(bottomRowHtml);
  };

  HoneycombGallery.prototype.electricSlide = function() {
    var scrollBy, millis;
    if (this.options.scrollSpeed === "slow") {
      millis = 50;
    } else if (this.options.scrollSpeed === "medium") {
      millis = 25;
    } else if (this.options.scrollSpeed === "fast") {
      millis = 10;
    }
    window.slide = setInterval(function() {
      window.scrollBy(1, 0);
    }, millis);
  };

  HoneycombGallery.prototype.highlightImg = function() {

    // context for setTimeout
    var self = this;


    if (self._imgCollection.length) {
      var random = Math.floor(Math.random() * self._imgCollection.length),
          media = this._imgCollection[random],
          rotate = Math.floor(Math.random() * 2) ? Math.random() * 11 : Math.random() * -11,
          $media,
          $username = $('<div class="overlay featured-username"><i class="icon-instagram"></i> @'+media.user.username+'</div>'),
          $description = '';

      // if media has a description create description element
      if (media.caption.text) {
        $description = $('<p class="overlay image-description">'+media.caption.text+'</p>');
      }

      // fade out background
      this.$honeycomb.css({'opacity': 0.3});

      // if media is image
      if (media.type === "image") {

        // setup img element
        $media = $('<img>').attr('src', media.images.standard_resolution.url)
                           .css({'height': (this.dimensions.windowHeight * 0.7)});

        // set timeout to end highlight in 5 seconds and begin another in 10 seconds
        setTimeout(function() {
          self.$honeycomb.css({'opacity': 1.0});
          self.$featured.css({'-webkit-transform': 'rotate(0deg)'}).empty();

          setTimeout(function() {
            self.highlightImg();
          }, 10000);

        }, 5000);

      // if media is video
      } else if (media.type === "video") {

        // setup video element
        $media = $('<video autoplay>');
        $media.attr('src', media.videos.standard_resolution.url)
              .css({'height': (this.dimensions.windowHeight * 0.7)})
              // listen for video to end before stopping highlight and setting another to begin in 10 seconds
              .on('ended', function() {
                self.$honeycomb.css({'opacity': 1.0});
                self.$featured.css({'-webkit-transform': 'rotate(0deg)'}).empty();
                setTimeout(function() {
                  self.highlightImg();
                }, 10000);
              });
      }

      // setup featured media elements to be 70% of window height
      this.$border.empty()
          .append($username)
          .append($media)
          .append($description);

      // append rotated media elements to featured div
      this.$featured.css({'-webkit-transform': 'rotate('+rotate+'deg)'})
          .append(this.$border.css({'opacity': 1}));

    // if images are not yet in collection set timeout to run again in 5 seconds
    } else {
      setTimeout(function() {
        self.highlightImg();
      }, 5000);
      console.log('no images in the collection!');
    }
  };

}());
