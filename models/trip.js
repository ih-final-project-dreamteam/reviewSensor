const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const tripSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  tripName: { type: String, required: true },
  startDate: Date,
  endDate: Date,
  tripNotes: String,
  hotel: Object
},  
{
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;