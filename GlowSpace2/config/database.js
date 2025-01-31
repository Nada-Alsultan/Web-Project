const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/Booking');

const db = mongoose.connection;

// Handle connection success
db.once('open', () => {
    console.log('✅ Connected to DB successfully...');
});

// Handle connection error
db.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});
