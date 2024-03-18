// // a middleware is a custom verification executed when the route is called by the client, before the controller sends a response
// const jwt = require('jsonwebtoken');
// const User = require('../models/users');

// module.exports = async (req, res, next) => {
// 	// destructure and verify presence of an authorization header
// 	const { authorization } = req.headers;

// 	if (!authorization) return next(new Error('401 Unauthorized'));

// 	const bearer = authorization.split(' ')[1]; // remove "Bearer" from input string

// 	// get the user document from db to retrieve json web token and decode it
// 	const user = await User.findOne({ token: bearer });

// 	if (!user) return next(new Error('404 Not Found'));

// 	jwt.verify(user.token, process.env.JWT_SECRET, function (error, decoded) {
// 		if (error) return next(new Error(error));
// 		req.uid = decoded.id;
// 		return next();
// 	});
// };

// const jwt = require('jsonwebtoken');
// const User = require('../models/users');

// module.exports = async (req, res, next) => {
//     // Destructure and verify presence of an authorization header
//     const { authorization } = req.headers;

//     if (!authorization) return next(new Error('401 Unauthorized'));

//     const bearer = authorization.split(' ')[1]; // Remove "Bearer" from input string

//     // Get the user document from db to retrieve json web token and decode it
//     try {
//         const user = await User.findOne({ token: bearer });

//         if (!user) return next(new Error('404 Not Found'));

//         jwt.verify(user.token, process.env.JWT_SECRET, function (error, decoded) {
//             if (error) {
//                 // Handle JWT verification errors
//                 return next(new Error('403 Forbidden'));
//             }
//             req.uid = decoded.id;
//             return next();
//         });
//     } catch (err) {
//         // Handle database query errors
//         return next(new Error('500 Internal Server Error'));
//     }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports = async (req, res, next) => {
    // Destructure and verify presence of an authorization header
    const { authorization } = req.headers;

    if (!authorization) return next(new Error('401 Unauthorized'));

    const bearer = authorization.split(' ')[1]; // Remove "Bearer" from input string

    // Decode the JWT token
    try 
	{
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
        const userId = decoded.token;
        // Check if the user exists in the database
        const user = await User.findOne({token:userId});

        if (!user) return next(new Error('404 Not Found'));

        req.uid = userId;
        return next();

    } 
	catch (error) 
	{
        // Handle JWT verification errors or database query errors
        if (error.name === 'JsonWebTokenError') {
            return next(new Error('403 Forbidden'));
        } else {
            return next(new Error('500 Internal Server Error'));
        }
    }
};
