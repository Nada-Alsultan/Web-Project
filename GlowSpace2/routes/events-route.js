const express = require('express');
const router = express.Router();
const eventsController =  require('../controllers/eventsController');
const isAdmin = require('../middleware/isAdmin');
const Salon = require('../models/salons');


router.get('/add-service', isAdmin,eventsController.getAdd)

router.post('/add-service', isAdmin, eventsController.postAdd)

router.get('/edit-service/:serviceId',isAdmin,eventsController.getPut)
router.post('/edit-service/:serviceId', isAdmin,eventsController.putService)
// router.get('/add-service',isAdmin,eventsController.getUpdate)

// router.get('/add-service',isAdmin,eventsController.getDelete)
module.exports = router;