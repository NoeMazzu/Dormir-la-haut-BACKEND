const Joi = require('joi');

// execute a request input verification based on the predefined validation schemas
module.exports = schema => (req, res, next) => {
	const fields = ['headers', 'query', 'params', 'body'];
	const validFields = {};

	fields.forEach(field => {
		if (schema[field]) {
			const { error, value } = Joi.compile(schema[field])
				.prefs({ errors: { label: 'key' }, abortEarly: false })
				.options({ allowUnknown: true })
				.validate(req[field]);

			if (error) {
				const errorMessage = error.details
					.map(details => details.message)
					.join(', ');
				throw new Error(errorMessage);
			}

			validFields[field] = value;
		}
	});

	Object.assign(req, validFields);

	return next();
};
