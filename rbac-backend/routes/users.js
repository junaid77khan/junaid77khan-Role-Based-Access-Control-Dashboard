const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const bcrypt = require('bcryptjs');
const User = require('../models/Users.js');
const Role = require('../models/Role.js');
const logActivity = require('../middleware/activityLogger'); 

router.get('/', auth(['Admin']), async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/count', auth(['Admin']), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', auth(['Admin']), async (req, res) => {
    let { name, email, password, role, status } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role,
            status,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();


        role = await Role.findById(role);
        role = role.name;
        const response = await logActivity('User Created', email, role, null); 

        res.json({user});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth(['Admin']), async (req, res) => {
    const { name, email, role, status } = req.body;
    const userFields = { name, email, role, status };

    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        ).populate('role');

        await logActivity('User Updated', user.email, user.role.name, null); 

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth(['Admin']), async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(req.params.id);

        let role = await Role.findById(user.role);

        role=role.name

        const res = await logActivity('User Deleted', user.email, role, null); 
        
        res.json({ message: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
