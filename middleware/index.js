var User = require("../models/user");
module.exports = {
    isLogged: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be logged in!!");
        res.redirect("/login");
    },
    chechOwnerShip: function(req, res, next){
        if(req.isAuthenticated()){
            User.findById(req.user._id, function(err, user){
                if(err){
                    console.error(err);
                }
                else {
                    if(user._id.equals(req.params.id)){
                        next();
                    } else{
                        req.flash("error","DAMN ON YOU Bitch!");
                        res.redirect("/");
                    }
                }
            });
        }
        else {
            res.redirect("/");
        }
    }
};