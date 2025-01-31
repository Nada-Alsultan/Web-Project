const express = require('express');
const router = express.Router();
const Salon = require('../models/salons');

// Route to fetch all salons
router.get('/', async (req, res) => {
  try {
    const salons = await Salon.find(); // Fetch all hotels from the database
    res.render('salons', { salons }); // Render thge salons.ejs view with the fetched data
  } catch (error) {
    console.error('Error fetching salons:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;