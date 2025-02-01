const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/database')
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const path = require('path');
const port = 3001;
const Salon = require('./models/salons'); // Ensure the correct path
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // Specify the directory where your views are located

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static('public')); // Serve static files from the "public" directory


// Use the salon route
const salonsRoute = require('./routes/salons-route');
app.use('/salons', salonsRoute);

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