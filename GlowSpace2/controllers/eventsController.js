const bcrypt = require('bcrypt-nodejs');
const Admin = require('../models/admin');
const Salon = require('../models/salons');


exports.getAdd = async (req, res) => {
    try {
        // Assuming `req.user` holds the logged-in admin data and there's a salonId reference
        const salon = await Salon.findOne({ admin: req.session.admin._id });
        if (!salon) {
            return res.status(404).send("Salon not found for this admin");
        }
        res.render('events/add-service', { salon: salon });
    } catch (error) {
        console.error('Failed to fetch salon:', error);
        res.status(500).render('error', { message: 'Failed to load salon data' });
    }
};

exports.postAdd = async (req, res) => {
    const { serviceName, servicePrice, description } = req.body;
    try {
        // Use the salon ID from the logged-in admin's associated salon
        const salon = await Salon.findOneAndUpdate(
            { admin: req.session.admin._id }, // Make sure this matches how you determine the admin's salon
            { $push: { services: { serviceName, servicePrice } }},
            { new: true }
        );
        if (!salon) {
            return res.status(404).send("Salon not found for this admin");
        }
        res.redirect('/admin/dashboard'); // Redirect to dashboard or another appropriate page
        
    } catch (error) {
        console.error('Failed to add service:', error);
        res.status(500).render('error', { message: 'Failed to add service' });
    }
};

exports.getPut =  async (req, res) => {
    try {
        const salon = await Salon.findOne({ 'services._id': req.params.serviceId });
        const service = salon.services.id(req.params.serviceId);
        res.render('events/edit-service', { service });
    } catch (error) {
        console.error('Failed to find service:', error);
        res.status(500).render('error', { message: 'Service not found' });
    }
};


exports.putService = async (req, res) => {
    const { serviceName, servicePrice, description } = req.body;
    try {
        const salon = await Salon.findOneAndUpdate(
            { "services._id": req.params.serviceId },
            { "$set": {
                "services.$.serviceName": serviceName,
                "services.$.servicePrice": servicePrice,
                "services.$.description": description
            }}
        );
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Failed to update service:', error);
        res.status(500).render('error', { message: 'Failed to update service' });
    }
};