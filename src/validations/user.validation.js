const Joi = require('joi');

// define schemas for the request inputs (body, params, headers...) to be used by the validation middleware
const create = {
	body: Joi.object().keys({
		firstname: Joi.string().min(2).max(42).required(),
	}),
};

module.exports = {
	create,
};
