// salon model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  locationLink: { type: String },
  phone: { type: Number, required: true },
  logo: { type: String },
  description: { type: String },
  services: [
    { serviceName: { type: String, required: true }, servicePrice: { type: Number, required: true } }
  ],
  ratings: {
    averageRating: Number,
    totalVotes: Number
  },
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true }

});

module.exports = mongoose.model('Salon', salonSchema);

