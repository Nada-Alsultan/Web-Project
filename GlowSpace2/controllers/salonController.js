const Salon = require('../models/salons');

exports.listServices = async (req, res) => {
    const salon = await Salon.findById(req.params.salonId);
    res.render('admin/services', { services: salon.services });
};

exports.addService = async (req, res) => {
    const { serviceName, servicePrice, description } = req.body;
    const salon = await Salon.findById(req.params.salonId);
    salon.services.push({ serviceName, servicePrice, description });
    await salon.save();
    res.redirect('/salons/' + req.params.salonId + '/services');
};

// Implement updateService and deleteService similarly
