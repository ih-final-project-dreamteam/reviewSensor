const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const hotelSchema = new Schema(// most of th information should come from Yelp API and Watson 
{
  hotelname: String,
  hotelAddress: {
    address1: String,
    address2: String,
    city: String,
    state: { type: String, uppercase: true, enum: statesArray},
    zipcode: { type: Number, maxlength: 5 }
  },
  hotelPhone: String, // for the () , - , or +  to show up
  DollarSign: { type: String, enum : ['$','$$','$$$','$$$$']},
  hotelPictures: String,
  hotelReviews: [{}],
  hotelNumberOfReviews: Number
},
{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;