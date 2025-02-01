const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');

router.get('/dashboard', isAdmin, adminController.dashboard);


router.get('/signup', adminController.getSignup);

router.post('/signup', adminController.postSignup);

router.get('/login', adminController.getLogin);

router.post('/login', adminController.postLogin);

router.get('/profile',isAdmin, adminController.getProfile);

const multer = require('multer');
const { route } = require('./salons-route');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')  // Make sure this directory exists
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Update the route to use multer
router.post('/profile', isAdmin, upload.single('salonLogo'), adminController.updateProfile);


router.get('/logout', adminController.logout);



// Route to add a new service

// // Route to update a service
// router.put('/salons/:salonId/services/:serviceId', async (req, res) => {
//     const { serviceName, servicePrice, description } = req.body;
//     try {
//         const salon = await Salon.findOneAndUpdate({ "_id": req.params.salonId, "services._id": req.params.serviceId }, {
//             "$set": {
//                 "services.$.serviceName": serviceName,
//                 "services.$.servicePrice": servicePrice,
//                 "services.$.description": description
//             }
//         }, { new: true });
//         res.status(200).json(salon);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating service", error });
//     }
// });

// // Route to delete a service
// router.delete('/salons/:salonId/services/:serviceId', async (req, res) => {
//     try {
//         const salon = await Salon.findByIdAndUpdate(req.params.salonId, {
//             $pull: { services: { _id: req.params.serviceId } }
//         }, { new: true });
//         res.status(200).json(salon);
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting service", error });
//     }
// });


module.exports = router;
