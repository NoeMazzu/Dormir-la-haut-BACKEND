// the controller layer "controls" the whole process of the request and response cycle (like calling the services)
const queryAPI = require('../services/news.service');

const get = async (req, res) => {
	const APIresponse = await queryAPI();

	if (APIresponse)
		res.json({
			result: APIresponse.status,
			numOfArticles: APIresponse.totalResults,
			articles: APIresponse.articles,
		});

	return res.json({ result: false, error: APIresponse });
};

module.exports = { get };
