var express = require('express'),
    passport = require('passport'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session),
    bodyParser = require('body-parser');

var settings = require('./config');
var app = express();

// Configure the app
app.use(require('compression')());
app.disable('x-powered-by');
app.set('views', settings.get('www:viewsDir'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('method-override')());

app.use(require('serve-favicon')(settings.get("www:favicon")));
app.use(express.static(settings.get('www:staticDir')));

app.use(session({
    secret: "Hq*bm,YL8tRczgN",
    cookie: { secure: true },
    resave: true,
    saveUninitialized: true,
    store: new redisStore({
        url: settings.get('redis:url'),
        maxAge  : new Date(Date.now() + 17200000), //1 Hour
        expires : new Date(Date.now() + 17200000), //1 Hour
        prefix: "sess:"
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// Mount routes to the app.
var Routes = require(settings.path.www('routes'))(settings);
app.use('/', Routes);

// Start listening for requests
var server = app.listen(settings.get('www:port'), function(){
    console.log("Server started at " + server.address().port);
});
