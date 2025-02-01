const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/database'); // Ensures the database connection is established
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const Salon = require('./models/salons'); // Adjust the path according to your project structure

const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // Specify the directory where your views are located

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // For parsing application/json

app.use(session({
    secret: 'testkey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static('public')); // Serve static files from the "public" directory

// Routes
const salonsRoute = require('./routes/salons-route');
const adminRoute = require('./routes/admin-route'); // Make sure this path matches your file structure
const eventsRoute = require('./routes/events-route'); 

app.get('/', async (req, res) => {
    res.redirect('/salons')
  });

// Use Routes
app.use('/salons', salonsRoute);
app.use('/admin', adminRoute); // Mount the admin routes at '/admin'
app.use('/events', eventsRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
