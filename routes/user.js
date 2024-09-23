const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
 const {savaRedirectUrl } = require("../middleWare.js") ; 

router.get("/signup", (req, res) => {
    res.render("users/signUp.ejs");
});


router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // Auto log in fuctions 
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wonderlust");
            res.redirect("/listings");
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup")
    }
})
);

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


router.post(
    "/login",
     savaRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }),
  async  (req, res) => {
        req.flash("success", "Welcome to Wonderlust! ");
        let  redirectUrl = res.locals.redirectUrl || "/listings" ; 
        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out now");
        res.redirect("/listings");
    })
});



module.exports = router; 