const userService = require('../services/user.service');

exports.getUserProfile = async (req, res, next) => {
    try {
        const userId = req.uid;
        const userProfile = await userService.getUserProfile(userId);
        res.json(userProfile);
    } catch (error) {
        next(error);
    }
};