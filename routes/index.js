var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User     = require("../models/user");

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
             req.flash(err.m)
             return res.redirect("/login");
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

router.get("/logout",function(req,res){
    req.flash("success","Logged you out hope to see you soon!" );
    req.logout();
    res.redirect("/");
});

module.exports = router;