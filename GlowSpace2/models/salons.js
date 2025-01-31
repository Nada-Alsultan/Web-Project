const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: Number, required: true },
  logo: { type: String, required: true },
  description: { type: String, required: true },
  services : [
    { serviceName: { type: String, required: true }, servicePrice: { type: Number, required: true } }
  ]
});

const salon = mongoose.model('Salon', salonSchema);

module.exports = salon;