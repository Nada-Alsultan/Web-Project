const bcrypt = require('bcrypt-nodejs');
const Admin = require('../models/admin');
const Salon = require('../models/salons');

/**
 * Render Add Service Page
 * - Fetches the salon associated with the logged-in admin
 * - Renders the form to add a new service
 */

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

/**
 * Handle Adding a New Service
 * - Adds a new service to the salon associated with the logged-in admin
 * - Redirects to the admin dashboard after successful addition
 */
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

/**
 * Render Edit Service Page
 * - Fetches the service data based on serviceId
 * - Renders the form to edit an existing service
 */

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


/**
 * Handle Updating a Service
 * - Updates the service details based on the provided serviceId
 * - Redirects to the admin dashboard after successful update
 */
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

/**
 * Handle Deleting a Service
 * - Removes a service from the salon based on the provided serviceId
 * - Redirects to the admin dashboard after successful deletion
 */
exports.getDeleteService = async (req, res) => {
    try {
        const salon = await Salon.findOne({ 'services._id': req.params.serviceId });
        const service = salon.services.id(req.params.serviceId);
        if (!service) {
            req.flash('error', 'Service not found');
            return res.redirect('/admin/dashboard');
        }
        res.render('events/delete-service', { service });
    } catch (error) {
        console.error('Service fetch error:', error);
        req.flash('error', 'Error fetching service details');
        res.redirect('/admin/dashboard');
    }
};

// Function to handle the deletion
exports.deleteService = async (req, res) => {
    try {
        const salon = await Salon.findOneAndUpdate(
            { 'services._id': req.params.serviceId },
            { $pull: { services: { _id: req.params.serviceId } } },
            { new: true }
        );
        req.flash('success', 'Service deleted successfully');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Delete service error:', error);
        req.flash('error', 'Failed to delete service');
        res.redirect('/admin/dashboard');
    }
};
