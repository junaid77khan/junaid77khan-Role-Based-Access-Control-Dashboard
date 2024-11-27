
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    action: { type: String, required: true },
    user: { type: String, required: true },
    role: { type: String, required: false },
    permission: { type: String, required: false },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', ActivitySchema);
