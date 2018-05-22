const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
// User model
const User        = require("../models/user");

const flash       = require("connect-flash");

const ensureLogin = require("connect-ensure-login");



// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

// SIGN UP
authRoutes.post("/signup", (req, res, next) => {
  const username  = req.body.username;
  const password  = req.body.password;
  // const userEmail = req.body.userEmail;
  const userFname = req.body.userFname;
  const userLname = req.body.userLname;
  const userTrips = req.body.userTrips;

  if (username === "" || password === "") {
    res.status(400).json({ message: 'Please indicate username and password' });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'Sorry, that username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
      userFname: userFname,
      userLname: userLname
    });

    newUser.save((err) => {
      if (err) {
        res.status(400).json({ message: 'Something went wrong' });
        return
      }

      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong' });
          return;
        }
        res.status(200).json(req.user);
      });

    });
  });
});


// authRoutes.get("/login", (req, res, next) => {
//   res.render("auth/login", { "message": req.flash("error") });
// });
// ^ROUTES WILL BE THROUGH ANGULAR SO WE DON'T NEED THIS ANYMORE

// LOGIN
// authRoutes.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, theUser, failureDetails) => {
//    console.log('user ============================================', req.session)
//    console.log('failure >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', failureDetails)
//    console.log('err ++++++++++++++++++++++++++++++++++++++++++++++', err)
//     if (err) {
//       res.status(500).json({ message: 'Something went wrong' });
//       return;
//     }

//     if (!theUser) {
//       res.status(401).json(failureDetails);
//       return;
//     }

//     req.login(theUser, (err) => {
//       if (err) {
//         res.status(500).json({ message: 'Something went wrong' });
//         return;
//       }

//       // We are now logged in (notice req.user)
//       res.status(200).json(req.user);
//     });
//   })(req, res, next);
// });




authRoutes.post('/login', (req, res, next) => {
  // console.log(req.body.username)
  User.findOne({ username: req.body.username })
  .then((userFromDb) => {
    console.log("user from db =====>>>>>======>>>>>=====>>>>>>", userFromDb)
    if (userFromDb === null) {
      res.status(400).json({ message: "Username is invalid" });
      return;
    }
    const isPasswordGood = bcrypt.compareSync(req.body.password, userFromDb.password);

    console.log(userFromDb);

    if (isPasswordGood === false) {
      res.status(400).json({ message: "Password is invalid" });
      return;
    }
    req.login(userFromDb, (err) => {
      // clear the "encryptedPassword" before sending the user userInfo// (otherwise it's a security risk)
      userFromDb.password = undefined;

        res.status(200).json({
          isLoggedIn: true,
          userInfo: userFromDb
        });
    });
  })
  .catch((err) => {
    console.log("POST/login ERROR!");
    console.log(err);

    res.status(500).json({ error: "Log in database error" });
  });
});  // Post LogIn




// LOGOUT
authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});


// LOGGED IN
authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {

    res.redirect('/login')
  }
}

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/')
    }
  }
}


// PRIVATE ROUTE
authRoutes.get('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }

  res.status(403).json({ message: 'Unauthorized' });
});


// authRoutes.get("/auth/google", passport.authenticate("google", {
//   scope: ["https://www.googleapis.com/auth/plus.login",
//           "https://www.googleapis.com/auth/plus.profile.emails.read"]
// }));

// authRoutes.get("/auth/google/callback", passport.authenticate("google", {
//   failureRedirect: "/",
//   successRedirect: "/private-page"
// }));

module.exports = authRoutes;
