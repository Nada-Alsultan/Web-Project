const bcrypt = require('bcrypt-nodejs');
const Admin = require('../models/admin');
const Salon = require('../models/salons');

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
    res.render('admin/signup');
};

exports.postSignup = (req, res) => {
    const {email, password,salonName, salonLocation, salonPhone } = req.body;
    
    bcrypt.hash(password, null, null, function(err, hashedPassword) {
        if (err) {
            console.error('Error hashing password', err);
            res.flash('error', 'Error creating account');
            res.redirect('/admin/signup');
        } else {
            Admin.create({ email, password: hashedPassword })
            .then(newAdmin => {
                // If admin is successfully created, then create the salon
                return Salon.create({
                    name: salonName,
                    location: salonLocation,
                    phone: salonPhone,
                    admin: newAdmin._id  // Linking the admin's ObjectId to the salon
                });
            })
            .then(() => {
                // If everything is okay, redirect to login
                req.flash('success', 'Account created successfully!');
                res.redirect('/admin/login');
            })
                .catch(error => {
                    console.error('Error creating user', error);
                    res.flash('error', 'Error creating account');
                    res.redirect('/admin/signup');
                });
        }
    });
};

exports.getLogin = (req, res) => {
    res.render('admin/login');

};

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


// exports.updateProfile = async (req, res) => {
//     const { email } = req.body;
//     try {
//         await Admin.findByIdAndUpdate(req.session.admin._id, { email });
//         res.redirect('/admin/profile');
//     } catch (error) {
//         res.flash('error', 'Error updating profile');
//         res.redirect('/admin/profile');
//     }
// };

exports.updateProfile = async (req, res) => {
    const { email, salonName, salonLocation, salonPhone } = req.body;
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
            phone: salonPhone,
            logo: req.file ? '/uploads/' + req.file.filename : salon.logo // Use the new logo if uploaded, otherwise keep the old one
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



exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
};
