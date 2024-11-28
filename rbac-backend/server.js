const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['https://junaid77khan-role-based-access-control-dashboard.vercel.app', "http://localhost:3000"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
};

connectDB();

app.use(cors(corsOptions)); 
app.use(express.json());

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/roles', require('./routes/roles.js'));
app.use('/api/permissions', require('./routes/permissions.js'));
app.use('/api/activity', require('./routes/activity.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
