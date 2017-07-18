var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    middleware  = require("../middleware");

router.get("/profile/:id", middleware.isLogged, function(req, res){
    
    User.findById(req.params.id, function(err, user){
       var status="";
       if(err){
           console.error(err);
       } else {
           
           if(!(req.user._id === req.params.id)) {
                User.getFriends(req.user, {_id: req.params.id } ,function(err, friendships){
                status = friendships[0].status;
                res.render("users/profile", {
                   user: user,
                   status: status
                });
        });
        
           
           }
           else {
             res.render("users/profile", {user: user,
               status: status
           });  
           }
           
       } 
    });
});

router.get("/edit", middleware.isLogged, function(req,res){
    res.render("users/edit");
});

router.put("/edit/:id", middleware.chechOwnerShip, function(req, res){
    var password = req.body.password;
    if(password.length > 1){
        User.findById(req.params.id, function(err, fuser){
            if(err){
                req.flash("error", "Something went wrong");
                return res.redirect("/edit");
            } fuser.setPassword(password, function(err){
                if(err){
                    req.flash("error", "Try another password");
                    return console.error(err);
                } 
                fuser.save();
            });
        });     
    }
   
   User.findByIdAndUpdate(req.user._id, req.body.user, function(err, user){
       if(err){
           return console.error(err);
       } 
       req.flash("success", "Updated successfully!");
       res.redirect("/profile/"+ req.params.id)
   });
});

router.get("/addfriend/:id", function(req, res){
    User.findById(req.params.id, function(err, user){
       if(err){
           return console.error(err.message);
       } 
       User.requestFriend(req.user._id, user._id, function(err){
           if(err){
                return console.error(err);
           }
           res.redirect("/profile/" + req.params.id);
       });
    });
});

module.exports = router;