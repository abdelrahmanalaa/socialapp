var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user"),
    middleware  = require("../middleware");

router.get("/", function(req,res){
    res.render("home");
});

router.get("/login",function(req,res){
    res.render("register.ejs");
});

router.post("/register",function(req,res){
    User.register(new User({email: req.body.email,
                            firstName: req.body.firstname,
                            lastName: req.body.lastname
    }),req.body.password,function(err,user){
        if(err){
             console.error(err);
             req.flash("error","A user with the given email is already registered");
             return res.redirect("/");
        }
        passport.authenticate("local")(req,res,function(){
          req.flash("success","You have been successfully registered")
          res.redirect("/");
      });
    });
});

router.post("/login",passport.authenticate("local",{
    
    failureRedirect: "/login",
    failureFlash: true
}),function(req,res){
    req.flash("success","Welcome " + req.user.firstName + " " + req.user.lastName );
    res.redirect("/");
});

router.get("/logout", middleware.isLogged, function(req,res){
    req.flash("success","Logged you out hope to see you soon!" );
    req.logout();
    res.redirect("/");
});

router.get("/forgetpassword", middleware.isLogged, function(req,res){
    res.render("forgetpass");
});

module.exports = router;