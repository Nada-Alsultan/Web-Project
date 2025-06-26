const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');

// Route to render the admin dashboard (only accessible by admin)
router.get('/dashboard', isAdmin, adminController.dashboard);
// Route to render the signup page for new admin accounts
router.get('/signup', adminController.getSignup);
// Route to handle the signup form submission and create a new admin account
router.post('/signup', adminController.postSignup);
// Route to render the login page for admins
router.get('/login', adminController.getLogin);
// Route to handle the login form submission and authenticate the admin
router.post('/login', adminController.postLogin);
// Route to render the admin profile page (only accessible by admin)
router.get('/profile', isAdmin, adminController.getProfile);


// Upload logo
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





module.exports = router;
