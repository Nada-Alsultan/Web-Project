const bcrypt = require('bcrypt-nodejs');
const Admin = require('../models/admin');
const Salon = require('../models/salons');

/**
 * Admin Dashboard Handler
 * Fetches and renders the salon dashboard for the logged-in admin.
 */

exports.dashboard = async (req, res) => {
    try {
        const salon = await Salon.findOne({ admin: req.session.admin._id }).populate('services'); // Ensure you have reference to admin in req.user
        if (!salon) {
            return res.status(404).send("Salon not found for this admin");
        }
        res.render('admin/dashboard', { salon: salon }); // Pass the entire salon object, including services
    } catch (error) {
        console.error('Error fetching salon data:', error);
        res.status(500).render('error', { message: 'Failed to load salon data' });
    }
};



exports.getSignup = (req, res) => {
    res.render('admin/signup', {currentPath: req.path});
};

/**
 * Handle Admin Signup
 * - Hashes password before storing it
 * - Creates an admin account
 * - Creates a salon associated with the new admin
 */

exports.postSignup = (req, res) => {
    const {email, password, salonName, salonLocation, salonPhone } = req.body;
    
    bcrypt.hash(password, null, null, function(err, hashedPassword) {
        if (err) {
            console.error('Error hashing password', err);
            req.flash('error', 'Error creating account');
            return res.redirect('/admin/signup');
        } 
        Admin.create({ email, password: hashedPassword })
        .then(newAdmin => {
            console.log("New Admin Created:", newAdmin);  // Log admin creation
            return Salon.create({
                name: salonName,
                location: salonLocation,
                locationLink: '',
                logo: '',
                description: '',
                phone: salonPhone,
                ratings: {
                    averageRating: 0,
                    totalVotes: 0
                },
                services: [],
                admin: newAdmin._id  
            });
        })
        .then(newSalon => {
            console.log("New Salon Created:", newSalon);  // Log salon creation
            req.flash('success', 'Account created successfully!');
            res.redirect('/admin/login');
        })
        .catch(error => {
            console.error('Error creating user or salon:', error);
            req.flash('error', 'Error creating account');
            res.redirect('/admin/signup');
        });
    });
};


exports.getLogin = (req, res) => {
    res.render('admin/login');

};

/**
 * Handle Admin Login
 * - Verifies admin credentials
 * - Establishes session upon successful login
 */

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/admin/login');
        }
        const isMatch = bcrypt.compareSync(password, admin.password); // Using bcrypt-nodejs
        if (isMatch) {
            req.session.admin = admin;
            return res.redirect('/admin/dashboard');
        } else {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/admin/login');
        }
    } catch (err) {
        console.error('Login error', err);
        req.flash('error', 'Login error');
        res.redirect('/admin/login');
    }
};

/**
 * Render Admin Profile Page
 * - Fetches the logged-in admin's details
 * - Fetches the associated salon details
 */
exports.getProfile = async (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }
    try {
        // Fetch the admin based on session information
        const admin = await Admin.findById(req.session.admin._id);
        if (!admin) {
            req.flash('error', 'Admin not found');
            return res.redirect('/admin/login');
        }

        // Fetch the salon associated with the admin
        const salon = await Salon.findOne({ admin: admin._id });
        if (!salon) {
            // Handle the case where no salon is associated yet
            salon = {}; // Or set to some default structure
        }

        // Render the profile with both admin and salon data
        res.render('admin/profile', { admin: admin, salon: salon });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        req.flash('error', 'Error fetching profile information');
        res.redirect('/admin/dashboard');
    }
};

/**
 * Update Admin and Salon Profile
 * - Updates the admin's email
 * - Updates the associated salon details
 */

exports.updateProfile = async (req, res) => {
    const { email, salonName, salonLocation, locationLink, salonPhone, salonDescription } = req.body;
    const adminId = req.session.admin._id; // Assume the admin ID is stored in session
    
    try {
        // Fetch existing salon information to maintain the current logo if not updated
        const salon = await Salon.findOne({ admin: adminId });

        if (!salon) {
            console.error('Salon not found for this admin:', adminId);
            req.flash('error', 'Salon not found');
            return res.redirect('/admin/profile');
        }

        // Prepare the update object for the salon, including handling the logo
        const salonUpdate = {
            name: salonName,
            location: salonLocation,
            locationLink: locationLink,
            phone: salonPhone,
            logo: req.file ? '/uploads/' + req.file.filename : salon.logo, // Use the new logo if uploaded, otherwise keep the old one
            description: salonDescription // Update salon description if provided

        };

        // Update admin info
        await Admin.findByIdAndUpdate(adminId, { email });

        // Update salon info
        await Salon.findByIdAndUpdate(salon._id, salonUpdate);

        req.flash('success', 'Profile updated successfully!');
        res.redirect('/admin/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        req.flash('error', 'Error updating profile');
        res.redirect('/admin/profile');
    }
};

/**
 * Admin Logout Handler
 * - Destroys session and redirects to login page
 */

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
};
