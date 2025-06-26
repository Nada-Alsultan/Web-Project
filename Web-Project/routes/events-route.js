const express = require('express');
const router = express.Router();
const eventsController =  require('../controllers/eventsController');
const isAdmin = require('../middleware/isAdmin');
const Salon = require('../models/salons');

// Route to render the form for adding a new service (only accessible by admin)
router.get('/add-service', isAdmin,eventsController.getAdd)
// Route to handle the submission of a new service (only accessible by admin)
router.post('/add-service', isAdmin, eventsController.postAdd)
// Route to render the form for editing an existing service (only accessible by admin)
router.get('/edit-service/:serviceId',isAdmin,eventsController.getPut)
// Route to handle the update of an existing service (only accessible by admin)
router.post('/edit-service/:serviceId', isAdmin,eventsController.putService)
// Route to confirm deletion
router.get('/delete-service/:serviceId', isAdmin, eventsController.getDeleteService);
// Route to handle deletion
router.post('/delete-service/:serviceId', isAdmin, eventsController.deleteService);

module.exports = router;