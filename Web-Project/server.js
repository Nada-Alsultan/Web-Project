const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/database'); // Ensures the database connection is established
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

const Salon = require('./models/salons'); // Adjust the path according to your project structure

const path = require('path');
const port = 3001;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // Specidfy  the directory where your views are located

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // For parsing application/json

app.use(session({
    secret: 'testkey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static('public')); // Serve   static files from the "public" directory

// Routes
const salonsRoute = require('./routes/salons-route');
const adminRoute = require('./routes/admin-route'); // Make sfure this path matches your file structure
const eventsRoute = require('./routes/events-route'); 

app.get('/', async (req, res) => {
    res.redirect('/salons')
  });

// Use Routes
app.use('/salons', salonsRoute);

app.use('/admin', adminRoute); // Mount  the admin routes at '/admin'
app.use('/events', eventsRoute);

// About page
app.get('/about', (req, res) => res.render('about',{currentPath: req.path}));

app.use(express.json()); // Enables JSON body parsing

app.post('/rate-salon', async (req, res) => {
    const { salonId, rating } = req.body;
    // Validate input
    if (!salonId || !rating) {
        return res.status(400).json({ message: "Invalid request. salonId and rating are required." });}
    // Ensure salonId is valid
    const salon = await Salon.findById(salonId);
    if (!salon) return res.status(404).json({ message: "Salon not found" });
    // Prevent duplicate rating using cookies
    if (req.cookies && req.cookies[`rated_${salonId}`]) {
        return res.status(400).json({ message: "You have already rated this salon!" });}
    // Update rating
    salon.ratings.totalVotes += 1;
    salon.ratings.averageRating = ((salon.ratings.averageRating * (salon.ratings.totalVotes - 1)) + rating) / salon.ratings.totalVotes;
    await salon.save();
    // Set cookie to prevent duplicate rating
    res.cookie(`rated_${salonId}`, true, { maxAge: 86400000, httpOnly: true });
    res.json({ message: "Thank you for your rating!" });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
