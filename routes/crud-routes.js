const express     = require("express");
const crudRoutes  = express.Router();
const passport    = require("passport");
// User model
const User        = require("../models/user");
const Trip        = require("../models/trip");
const flash       = require("connect-flash");

const ensureLogin = require("connect-ensure-login");


crudRoutes.post('/create/trip', (req, res, next) => {
    console.log('body', req.body)
    console.log("crud route!")
    req.body.startDate = new Date(req.body.startDate);
    req.body.endDate = new Date(req.body.endDate);
    req.body.startDate.setDate(req.body.startDate.getDate() + 1)
    req.body.endDate.setDate(req.body.endDate.getDate() + 1)
    const newTrip = new Trip(req.body);
    newTrip.save((err) => {
        if (err) {
          res.status(400).json({ message: 'Something went wrong' });
          return
        }
    });
//  setTimeout( function() {
//     Trip.find({userId: req.body.userId})
//     .then(trip => {
//         console.log('trip',trip);
//         User.findById(req.body.userId)
//         .then(user => {
//             console.log('user',user)
//             user.userTrips.push(trip._id);
//         })
//     })
// },3000)

  });
  

  module.exports = crudRoutes;