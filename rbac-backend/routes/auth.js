
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/Users');
const Admin = require('../models/Admin.js');
const Role = require('../models/Role');

dotenv.config();

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        const roleDoc = await Role.findOne({ name: role });
        if (!roleDoc) {
            return res.status(404).json({ message: 'Role not found' });
        }

        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'User already exists' });
        }

        admin = new Admin({
            name,
            email,
            password,
            role: roleDoc._id,
        });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();

        const payload = {
            id: admin._id,
            role: roleDoc.name,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;

                res.status(201).json({
                    message: 'User registered successfully',
                    admin: {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        role: roleDoc.name,
                    },
                    token,
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: 'Server error' });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await Admin.findOne({ email }).populate('role');
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            id: user.id,
            role: user.role.name,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
