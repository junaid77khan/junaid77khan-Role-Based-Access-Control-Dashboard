
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Role = require('../models/Role');
const Permission = require('../models/Permission');


router.get('/', auth(['Admin']), async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', auth(['Admin']), async (req, res) => {
    const { name, permissions } = req.body;

    try {
        let role = await Role.findOne({ name });
        if (role) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        role = new Role({
            name,
            permissions,
        });

        await role.save();
        res.json(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/count', auth(['Admin']), async (req, res) => {
    try {
        const totalRoles = await Role.countDocuments();
        res.json({ totalRoles });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth(['Admin']), async (req, res) => {
    const { name, permissions } = req.body;
    const roleFields = { name, permissions };

    try {
        let role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        role = await Role.findByIdAndUpdate(
            req.params.id,
            { $set: roleFields },
            { new: true }
        ).populate('permissions');

        res.json(role);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth(['Admin']), async (req, res) => {
    try {
        let role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: 'Role removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;