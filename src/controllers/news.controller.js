// the controller layer "controls" the whole process of the request and response cycle (like calling the services)
// const queryAPI = require('../services/news.service');

// const get = async (req, res) => {
// 	const APIresponse = await queryAPI();
// 	console.log('[APIRESPONSE - CONTROLLER]:',APIresponse)
// 	if (APIresponse)
// 		{
// 			console.log('[APIRESPONSE BOUCLE IF - CONTROLLER]',APIresponse)
// 			res.json({
// 			result: APIresponse.status,
// 			numOfArticles: APIresponse.totalResults,
// 			articles: APIresponse.articles,
// 			})
// 		};

// 	return res.json({ result: false, error: APIresponse });
// };

// module.exports = { get };

const queryAPI = require("../services/news.service");

const get = async (req, res) => {
  try {
    const APIresponse = await queryAPI();
    // console.log("[API RESPONSE CONTROLLER", APIresponse);

    if (APIresponse) {
      return res.json({
        result: APIresponse.status,
        numOfArticles: APIresponse.totalResults,
        articles: APIresponse.articles,
      });
    } else {
      return res.json({ result: false, error: "No API response received." });
    }
  } catch (error) {
    console.error("Error querying API:", error);
    return res
      .status(500)
      .json({ result: false, error: "Error querying API." });
  }
};

module.exports = { get };
