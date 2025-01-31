const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/database')
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const path = require('path');
const port = 3001;

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});