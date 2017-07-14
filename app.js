var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash              = require("connect-flash"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    indexRoutes     = require("./routes/index"),
    User            = require("./models/user"),
    app             = express();
mongoose.connect("mongodb://localhost/social");    
app.set("view engine", "ejs");    
app.use(bodyParser.urlencoded({extended: true}));    
app.use(express.static(__dirname + "/public"));
app.use(flash());

// passport configuration
app.use(require("express-session")({
    secret: "Holy Moly!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use("/",indexRoutes);

app.listen(process.env.PORT, function(){
    console.log("serving!!");
});