var express = require('express'),
    passport = require('passport'),
    InstagramStrategy = require('passport-instagram').Strategy,
    request = require('request');

var INSTAGRAM_CLIENT_ID = process.env.HEXAGRAM_CLIENT_ID;
var INSTAGRAM_CLIENT_SECRET = process.env.HEXAGRAM_CLIENT_SECRET;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID,
    clientSecret: INSTAGRAM_CLIENT_SECRET,
    callbackURL: "http://hexagram.gpalmer.me/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    storage[profile.username] = accessToken;
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var storage = {};

var app = express();

app.configure(function() {
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', ensureAuthenticated, function(req, res){
  res.sendfile('index.html');
});

app.get('/login', function(req, res){
  res.sendfile('login.html');
});

app.get('/hex', function(req, res){
  hashtag = req.query.hashtag[0] === '#' ? req.query.hashtag.slice(1) : req.query.hashtag;
  res.redirect('/'+hashtag);
});


app.get('/api/images/:hashtag', function(req, res){
  request((req.query.url || createIgUrl('images', req.params.hashtag, storage[req.user.username])), function(error, response, body) {
    if (error) {
      console.log('ERROR!:', error);
    } else {
      var igResponse = JSON.parse(body);
      res.send({
        media: igResponse.data,
        next_url: igResponse.pagination.next_url});
    }
  });
});

app.get('/api/tags/:tag', function(req, res){
  request(createIgUrl('tags', req.params.tag, storage[req.user.username]), function(error, response, body) {
    if (error) {
      console.log('ERROR!:', error);
    } else {
      var igResponse = JSON.parse(body);
      res.send({
        tags: igResponse.data
      });
    }
  });
});

app.get('/auth/instagram',
  passport.authenticate('instagram'),
  function(req, res) {});

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/:hashtag', ensureAuthenticated, function(req, res) {
  console.log('req.params', req.params);
  console.log('req.query', req.query);
  res.sendfile('hex.html');
});

var port = process.env.PORT || 3000;
app.listen(port);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function createIgUrl(type, hashtag, accessToken) {
  if (type === 'images') {
    return 'https://api.instagram.com/v1/tags/'+hashtag+'/media/recent?access_token='+accessToken;
  } else if (type === 'tags') {
    return 'https://api.instagram.com/v1/tags/search?q='+hashtag+'&access_token='+accessToken;
  }
}