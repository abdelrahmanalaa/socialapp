var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    middleware  = require("../middleware");

router.get("/profile/:id", middleware.isLogged, function(req, res){
    
    User.findById(req.params.id, function(err, user){
       var status;
       if(err){
           console.error(err);
       } else {
           
           if(!(req.user._id.equals(req.params.id))) {
                User.getFriends(req.user, {_id: req.params.id } ,function(err, friendships){
                
                if(friendships.length >= 1){
                    status = friendships[0].status;
                    res.render("users/profile", {
                   user: user,
                   status: status 
                });    
                }
                else {
                    
                    res.render("users/profile", {
                   user: user,
                   status: "nthng"
                }); 
                }
                
        });
        
           
           }
           else {
             res.render("users/profile", {user: user,
                 status: "nthng"
             });  
           }
           
       } 
    });
});

router.get("/edit", middleware.isLogged, function(req,res){
    res.render("users/edit");
});

router.put("/edit/:id",middleware.chechOwnerShip ,function(req, res){
    var password = req.body.password;
    if(password.length > 1){
        User.findById(req.params.id, function(err, fuser){
            if(err){
                req.flash("error", "Something went wrong");
                return res.redirect("/edit");
            }
            
            fuser.setPassword(password, function(err){
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
       res.redirect("/profile/"+ req.params.id);
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

router.get("/requests", middleware.isLogged, function(req, res){
    
    User.getFriends(req.user, function(err, friendships){
        if(err){
            return console.error(err);
        }
        res.render("users/requests", {friendships: friendships}); 
    });
   
});

router.get("/acceptfriend/:id", function(req, res){
   User.requestFriend(req.user._id, req.params.id, function(err){
       if(err){
           return console.error(err);
       }
       req.flash("success", "you both now are friends");
       res.redirect(req.get('referer'));
   }); 
});

router.get("/removefriend/:id", function(req, res){
    User.findById(req.params.id, function(err, fuser){
        if(err){
            return console.error(err);
        }
    User.removeFriend(req.user,fuser , function(err){
        if(err){
            return console.error(err);
        }
        req.flash("success","you successfully removed the friendship request");
        res.redirect(req.get('referer'));
    });    
    });
    
});

module.exports = router;