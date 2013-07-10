Hexagram!
============

>"Wow! Check out that super sweet hexagonal Instagram image gallery!" <cite>--Everyone</cite>

A fullscreen, scrolling honeycomb-style image collage hooked up with the Instagram API

For your viewing pleasure:
<a href="http://hexagram.gpalmer.me" target="_blank">http://hexagram.gpalmer.me</a>

---
### Description:
What began as a challenge from a local company, ended up as brand new way to experience Instagram images and videos...or any collection of images and video for that matter. When given the opportunity to explore ways of dynamically displaying a feed of images, I chose to create a hexagonal tesselation. After plenty of time spent revisiting geometry from years past, it became clear that hexagons in the browser are quite tricky.

For more on the story behind the development, <a href="http://gpalmer.me/blog/2013/07/05/hexagram/" target="_blank">check out my blog!</a>

---
### Options:
Each instance of the HoneycombGallery can be created with it's own set of customizable options which will be extended into the options object. (Note: options are limited in the example app above and are passed in using query string parameters as opposed to arguments on instantiation). Available options are:

- `hashtag` *(string)* The hashtag title of your album

- `highRes` *(boolean - optional)* If true, will use fullsize images in honeycomb. Featured images will always be fullsize. (Note: may cause performance slowdown) Default: false

- `allowVideo` *(boolean - optional)* If true, will render videos in honeycomb. Featured videos will still play on highlight. (Note: may cause performance slowdown) Default: true

- `scrollSpeed` *(string - optional)* Can be 'slow', 'medium' or 'fast'. Default: 'slow'

- `feature` *(boolean - optional)* True to periodically feature images. Default: true

- `numRows` *(number - optional)* The number of hexagon rows in tesselation not including top/bottom special rows. Default: 5

- `padding` *(number - optional)* The amount of padding between each hexagon. Default: 20

- `topRow` *(object - optional)* Set available options for top row of tesselation
  - `backgroundOne` *(string - optional)* String of valid CSS to be inserted as background of every odd hexagon in top row (e.g. color, url)
  - `backgroundTwo` *(string - optional)* String of valid CSS to be inserted as background of every even hexagon in top row (e.g. color, url)

- `bottomRow` (object) Set available options for bottom row of tesselation
  - `backgroundOne` (string) String of valid CSS to be inserted as background of every odd hexagon in top row (e.g. color, url)
  - `backgroundTwo` (string) String of valid CSS to be inserted as background of every even hexagon in top row (e.g. color, url)

---
### Example:
When using the above options, you would create a new HoneycombGallery instance passing options similar to the below example.

    new HoneycombGallery({
      hashtag: 'sfgiants',
      feature: false,
      highRes: true,
      topRow: {
        backgroundOne: 'slategray',
        backgroundTwo: '#ff6e00'
      },
      bottomRow: {
        backgroundOne: '#ff6e00',
        backgroundTwo: 'url(http://images.ak.instagram.com/profiles/profile_6150408_75sq_1359997984.jpg)',
      }
    });

---
### iframes:

The HoneycombGallery has been tested and will also work within an `<iframe>` if you'd like to place a smaller version somewhere on your page

Example:

    <iframe src="hex.html" height="500px" width="1000px" seamless></iframe>

---
### Feature Roadmap:

- Generalize for ease of use with any collection of images

- Minor style tweaks:
  - Incorporate LESS/SASS or some CSS compiler
  - Font size dependant on window size
  - Usernames not showing over videos

- Optimizations:
  - Some Handlebars
  - Auto-scroll without using SetInterval
  - Remove unseen hexagons from DOM after dissappearing from page
  - Hexagon videos play only when visible on screen and pause when off
  - Backbone or some MV* framework?

- More options:
  - Vertical scroll
  - Allow small messages or text in top and bottom rows in addition to hashtags
