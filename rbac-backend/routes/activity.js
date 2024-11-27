
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');


router.get('/recent', auth(['Admin']), async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 }).limit(5); // Fetch 5 most recent activities
        res.json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
