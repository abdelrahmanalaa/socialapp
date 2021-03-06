var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash              = require("connect-flash"),
    passport        = require("passport"),
    indexRoutes     = require("./routes/index"),
    usersRoutes     = require("./routes/users"),
    User            = require("./models/user"),
    friends         = require("mongoose-friends"),
    methodOverride  = require("method-override"),
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
app.use(methodOverride("_method"));
app.use("/",indexRoutes);
app.use(usersRoutes);

app.listen(process.env.PORT, function(){
    console.log("serving!!");
});