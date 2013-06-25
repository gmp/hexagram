honeycomb.js
============

>"Wow! Check out that super sweet honeycomb image gallery!" <cite>--Everyone</cite>

A fullscreen, scrolling honeycomb-style image collage hooked up with Pixlee's API (http://www.pixlee.com/)

Note: In it's current state you will need to provide your own Pixlee API key in options (see below)

---
### HowTo honeycomb in 3 easy steps:

1. Set up the head:

    ```html
    <head>
      <title>honeycomb.js</title>
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
      <link href="http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css" rel="stylesheet">
      <link rel="stylesheet" type="text/css" href="hex.css">
      <script src="hex.js"></script>
    </head>
    ```

2. Rub the body right:

    ```html
    <body>
      <div class="honeycomb"></div>
      <div class="highlight">
        <div class="featured"></div>
      </div>
    </body>
    ```

3. Tell that computer you want a new HoneycombGallery (see options below)

    ```html
      <script>
        new HoneycombGallery([options]);
      </script>
    </body>
    ```

---
### Options:

When instantiating a new HoneycombGallery, provide the following information in an options object

- `apiUrl` *(string)* The base URL directing to your Pixlee account. Ex: "://api.pixlee.com/v1/-USERNAME-/albums/"

- `apiKey` *(string)* Your unique Pixlee API key

- `albumID` *(number)* The album ID of the Pixlee album you'd like to display

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

    new HoneycombGallery({
      apiUrl: '', // required
      apiKey: '', // required
      albumID: 1242, // required,
      numRows: 7,
      padding: 0,
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

The above will also work within an `<iframe>` if you'd like to place a smaller version somewhere on your page

Example:

    <iframe src="hex.html" height="500px" width="1000px" seamless></iframe>

---
### Feature Roadmap:

- Generalize for ease of use with any collection of images

- Minor style tweaks:
  - Font size dependant on window size
  - Usernames not showing over videos

- Optimizations:
  - Auto-scroll without using SetInterval
  - Remove unseen hexagons from DOM after dissappearing from page
  - Hexagon videos play only when visible on screen and pause when off

- More options:
  - Vertical scroll
  - Allow small messages or text in top and bottom rows in addition to hashtags
