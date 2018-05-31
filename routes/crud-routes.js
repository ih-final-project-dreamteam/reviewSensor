const express = require("express");
const crudRoutes = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Trip = require("../models/trip");
const flash = require("connect-flash");


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
    .then((updatedTrip) => {
      var tripStartDate = new Date(req.body.startDate);
      console.log(tripStartDate);
      var today = new Date();
      today.setDate(today.getDate() -1);
      // testDate.setDate(testDate.getDate() - 2);
      console.log('dfdsafdsfdsafdasdfsdfsafmdsamdmdmsddmssdmsdmdsmssmdmsadmdsmsmsadmsdmsasmdsmssm')
      console.log('ashdashhasdfaksdfhadahsjfadshjfkhajsdf',tripStartDate);
      console.log('today: ', today);
      console.log('check if tru', (tripStartDate.setDate(tripStartDate.getDate() - 2) <= today));
      if (tripStartDate.setDate(tripStartDate.getDate() - 2) <= today) {
        const accountSid = process.env.twilioSid; // Your Account SID from www.twilio.com/console
        const authToken = process.env.twilioToken;   // Your Auth Token from www.twilio.com/console
        const client = require('twilio')(accountSid, authToken);
        client.messages.create({
          to: '+17867684353', // Text this number
          from: '+19543290573', // From a valid Twilio number
          body: `Trip Reminder! Trip Name: ${JSON.stringify(req.body.tripName)}, Start Date: ${JSON.stringify(req.body.startDate)}, End Date: ${JSON.stringify(req.body.endDate)}, Trip Notes: ${JSON.stringify(req.body.tripNotes)}`
        })
          .then((message) => console.log(message))
          .done();
}
        res.json(updatedTrip)
      })
  .catch((err) => {
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