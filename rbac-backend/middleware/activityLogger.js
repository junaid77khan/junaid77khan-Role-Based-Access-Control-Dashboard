
const Activity = require('../models/Activity');

const logActivity = async (action, user, role = null, permission = null) => {
    try {
        console.log(action, "Done");
        
        const activity = new Activity({
            action,
            user,
            role,
            permission,
        });
        const response = await activity.save();
        return response;
    } catch (err) {
        console.error('Error logging activity:', err);
    }
};

module.exports = logActivity;
