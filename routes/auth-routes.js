const express     = require("express");
const authRoutes  = express.Router();
const passport    = require("passport");
// User model
const User        = require("../models/user");
const Trip        = require("../models/trip");

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
    res.status(400).json({ message: 'Please indicate your email and password' });
    return;
  }

  User.findOne({ username:username }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'An account already exists for that email. Log in.' });
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


authRoutes.post('/login', (req, res, next) => {
  // console.log("post login: ", req.body)
  User.findOne({ username: req.body.username })
  .then((userFromDb) => {
    // console.log("user from db =====>>>>>======>>>>>=====>>>>>>", userFromDb)
    if (userFromDb === null) {
      res.status(400).json({ message: "That email is invalid. Try again." });
      return;
    }
    const isPasswordGood = bcrypt.compareSync(req.body.password, userFromDb.password);

    // console.log(userFromDb);

    if (isPasswordGood === false) {
      res.status(400).json({ message: "That password is invalid. Try again." });
      return;
    }
    req.login(userFromDb, (err) => {
      // clear the "encryptedPassword" before sending the user userInfo// (otherwise it's a security risk)
      userFromDb.password = undefined;
// console.log("do i have user here: ", userFromDb)
        res.status(200).json(
          // isLoggedIn: true,
          // userInfo: userFromDb
          userFromDb
        );
    });
  })
  .catch((err) => {
    console.log("POST/login ERROR!");
    console.log(err);

    res.status(500).json({ error: "Log in database error" });
  });
});  // Post LogIn




// LOGOUT
authRoutes.delete('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});


// LOGGED IN
authRoutes.get('/loggedin', (req, res, next) => {
  console.log("user in backend: ", req.user);
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
    res.status(403).json({ message: 'Unauthorized' });
});


authRoutes.get('/dashboard/:userId', (req, res, next) => {
 
  setTimeout(function () {
  Trip.find({userId: req.params.userId})
  .then((listOfUserTrips)=>{
    res.json(listOfUserTrips);
  })
  .catch((err)=>{
    res.json(err)
  })
}, 200);
});

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {

//     res.redirect('/login')
//   }
// }

// function checkRoles(role) {
//   return function(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === role) {
//       return next();
//     } else {
//       res.redirect('/')
//     }
//   }
// }


// PRIVATE ROUTE
// authRoutes.get('/private', (req, res, next) => {
//   if (req.isAuthenticated()) {
//     res.json({ message: 'This is a private message' });
//     return;
//   }

//   res.status(403).json({ message: 'Unauthorized' });
// });



module.exports = authRoutes;