// const mongoose = require("mongoose");
// const Schema   = mongoose.Schema;

// const tripSchema = new Schema({
//   triptName: { type: String, required: true },
//   startDate: Date,
//   endDate: Date,
//   tripNotes: String,
//   userId: {type: Schema.Types.ObjectId, ref: 'User'},
//   userFavorites: [{type: Schema.Types.ObjectId, ref: 'Hotel'}],//this need to be modified to take yelp information
// //   flightInfo
// },  
// {
//   timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
// });

// const Trip = mongoose.model("Trip", tripSchema);

// module.exports = Trip;