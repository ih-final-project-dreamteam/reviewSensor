const express = require("express");
const authRoutes = express.Router();
//model decleration 
const User = require("../models/user");
const Trip = require("../models/trip");
const Hotel = require("../models/hotel");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const flash = require("connect-flash"); // https://www.npmjs.com/package/connect-flash
//======================================================

//USER SIGNUP ROUTE========================================

authRoutes.post("/signup", (req, res, next) => {

  // console.log(req.body)
  const username  = req.body.username;
  const password  = req.body.password;
  const userEmail = req.body.userEmail;
  const userFname = req.body.userFname;
  const userLname = req.body.userLname;
  const userTrips = req.body.userTrips;

  if (username === "" || password === "") { res.status(400).json({ message: 'Provide username and password'});
    return;
  }

  User.findOne({ username: username}, "username", (err, user) => {
    if (user !== null) { res.status(400).json({ message: 'The username already exists'});
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
      userEmail: userEmail,
      userFname: userFname,
      userLname: userLname,
      userTrips: [],
    });

    newUser.save((err) => {
      if (err) { res.status(400).json({ message: 'Something went wrong'});
        return
      }


      req.login(newUser, (err) => {
        if (err) { res.status(500).json({ message: 'Something went wrong'});
          return;
        }
        res.status(200).json(req.user);
      });

    });
  });
});

//=========================================================================

//USER LOGIN ROUTE==============================================================

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }

      // We are now logged in (notice req.user)
      res.status(200).json(req.user);
    });
  })(req, res, next);
});
//=========================================================================

// CHECK IF THE USER IS LOGGEDIN OR NOT====================================

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized Action, your are not logged in' });
});
//=========================================================================

// PRIVATE VIEW: USER ACCOUNT==============================================
authRoutes.get('/user-account', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'Welcome back'}); // `${{username}}`
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});
//=========================================================================

//USER SIGN OUT============================================================
authRoutes.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});
//=========================================================================
module.exports = authRoutes;


