const express     = require("express");
const crudRoutes  = express.Router();
const passport    = require("passport");
const User        = require("../models/user");
const Trip        = require("../models/trip");
const flash       = require("connect-flash");

const ensureLogin = require("connect-ensure-login");


crudRoutes.post('/create/trip', (req, res, next) => {
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

});

crudRoutes.post(`/trip/update/:tripId`, (req, res, next) => {
  Trip.findByIdAndUpdate(req.params.tripId, req.body)
    .then((updatedTrip)=>{
      res.json(updatedTrip)
    })
    .catch((err)=>{
      res.json(err)
    })
});

crudRoutes.post(`/trip/delete/:tripId`, (req, res, next) => {
  Trip.findByIdAndRemove(req.params.tripId)
  .then((deletedTask) => {
    res.json(deletedTask);
  })
  .catch((err) => {
    res.json(err);
  })
})
  

module.exports = crudRoutes;