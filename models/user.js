

const mongoose = require("mongoose");
// const Trip     = require('./models/trip');
const Schema   = mongoose.Schema;


const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, unique: true },
  userFname: String,
  userLname: String,
  userTrips:[{type: Schema.Types.ObjectId, ref: 'Trip'}],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
