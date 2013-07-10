Hexagram!
============

>"Wow! Check out that super sweet hexagonal Instagram image gallery!" <cite>--Everyone</cite>

A fullscreen, scrolling honeycomb-style image collage hooked up with the Instagram API

For your viewing pleasure:
<a href="http://hexagram.gpalmer.me" target="_blank">http://hexagram.gpalmer.me</a>

---
### Description:
What began as a challenge from a local company, ended up as brand new way to experience Instagram images and videos...or any collection of images and video at that. When given the opportunity to explore ways of dynamically displaying a feed of images, I chose to create a hexagonal display. After plenty of revisiting geometry from years past, it became clear that hexagons in the browser are quite tricky


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
