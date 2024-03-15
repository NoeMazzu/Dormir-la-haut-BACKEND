// a middleware is a custom verification executed when the route is called by the client, before the controller sends a response
const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports = async (req, res, next) => {
	// destructure and verify presence of an authorization header
	const { authorization } = req.headers;

	if (!authorization) return next(new Error('401 Unauthorized'));

	const bearer = authorization.split(' ')[1]; // remove "Bearer" from input string

	// get the user document from db to retrieve json web token and decode it
	const user = await User.findOne({ token: bearer });

	if (!user) return next(new Error('404 Not Found'));

	jwt.verify(user.token, process.env.JWT_SECRET, function (error, decoded) {
		if (error) return next(new Error(error));
		req.uid = decoded.id;
		return next();
	});
};
