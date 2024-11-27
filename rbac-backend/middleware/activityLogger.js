
const Activity = require('../models/Activity');

const logActivity = async (action, user, role = null, permission = null) => {
    try {
        const activity = new Activity({
            action,
            user,
            role,
            permission,
        });
        await activity.save();
    } catch (err) {
        console.error('Error logging activity:', err);
    }
};

module.exports = logActivity;
