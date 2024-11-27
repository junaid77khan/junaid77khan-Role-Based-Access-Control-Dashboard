
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Permission = require('../models/Permission');

router.get('/', auth(['Admin']), async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', auth(['Admin']), async (req, res) => {
    const { name, description } = req.body;

    try {
        let permission = await Permission.findOne({ name });
        if (permission) {
            return res.status(400).json({ message: 'Permission already exists' });
        }

        permission = new Permission({
            name,
            description,
        });

        await permission.save();
        res.json(permission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth(['Admin']), async (req, res) => {
    const { name, description } = req.body;
    const permissionFields = { name, description };

    try {
        let permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });

        permission = await Permission.findByIdAndUpdate(
            req.params.id,
            { $set: permissionFields },
            { new: true }
        );

        res.json(permission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/count', auth(['Admin']), async (req, res) => {
    try {
        const totalPermissions = await Permission.countDocuments();
        res.json({ totalPermissions });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth(['Admin']), async (req, res) => {
    try {
        let permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });

        await Permission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Permission removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
