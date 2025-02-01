const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salonSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
    logo : { type: String, required: false },
    
    services: [{
        serviceName: { type: String, required: false },
        servicePrice: { type: Number, required: false }
    }],
    schedule: [{
        day: { type: String, required: false },
        openTime: { type: String, required: false },
        closeTime: { type: String, required: false }
    }]
});

module.exports = mongoose.model('Salon', salonSchema);

