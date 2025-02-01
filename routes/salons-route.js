const express = require('express');
const router = express.Router();
const Salon = require('../models/salons');




// Route to fetch all salons
router.get('/', async (req, res) => {
  try {
    const salons = await Salon.find(); // Fetch all hotels from the database
    res.render('salons', { salons, currentPath: req.path }); // Render thge salons.ejs view with the fetched data
  } catch (error) {
    console.error('Error fetching salons:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to show a single salon's information
router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);
    if (!salon) {
      return res.status(404).send('Salon not found');
    }
    res.render('show-salon', { salon, currentPath: "salons"  });
  } catch (err) {
    res.status(500).send(err);
  }
});



module.exports = router;