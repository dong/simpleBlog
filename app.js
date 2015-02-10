var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride     = require("method-override");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var config = require("config");
var utils = require("./lib/utils");
var mongooseConnection = utils.connectToDatabase(mongoose, config.db);
var passport = require('passport');
var session = require("express-session");
var sessionStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var flash = require("connect-flash")

var app = express();

var routes = require('./routes/index');
var routes = require('./routes/blog');
var users = require('./routes/users');


app.set("port", process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { layout: true }); // I will use jade's layout structure(i.e master page)


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride() ); // Simulate DELETE and PUT

var redis_url = "redis://localhost:10307/"
app.use(session({
    secret: 'password',
    store: new sessionStore({url:redis_url}),
    saveUninitialized: false, // don't create session until something stored,
    resave: false // don't save session if unmodified
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require("./lib/views"));

app.use(express.static(path.join(__dirname, 'public')));



require("./models/Article")(mongooseConnection);
require("./models/Tag")(mongooseConnection);
require("./models/User")(mongooseConnection);
require("./models/Comment")(mongooseConnection);

app.use('/', routes);
app.use('/users', users);

//require("./controllers/IndexController")(app);
require("./controllers/IndexController")(app);
require("./controllers/ProjectsController")(app);
require("./controllers/ContactController")(app);
require("./controllers/BlogController")(app, mongooseConnection);
require("./controllers/ArticleController")(app, mongooseConnection);
require("./controllers/CommentController")(app, mongooseConnection);
require("./controllers/UserController")(app, mongooseConnection);

require("./lib/passport")();

app.get("*", function(req, res) {
     res.render("index",{
         page_title: "Home",
     });
 });

app.listen(app.get("port"), function () {
        console.log("Express server listening on port " + app.get("port"));
});

module.exports = app;


