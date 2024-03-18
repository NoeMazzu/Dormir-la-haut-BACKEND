const User = require('../models/users');

exports.getUserProfile = async (userId) => {
    try {
        const user = await User.findOne({ token: userId }).populate('fav_POI');
        if (!user) {
            throw new Error('User does not exist');
        }
        return {
            result: true,
            userName: user.userName,
            fav_POI: user.fav_POI,
            checklists: user.checklists,
            meteo: user.fav_meteo,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};