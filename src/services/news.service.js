// the service layer contains evertyhing related to api calls or manipulating the database
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const today = new Date();
const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const formattedToday = today.toISOString().split('T')[0];
const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];

const searchQuery = 'alpes AND (meteo OR météo)';
const encodedSearchQuery = encodeURIComponent(searchQuery);

const queryAPI = async req => {
	const options = {
		method: 'GET',
		redirect: 'follow',
	};

	const apiUrl = `https://newsapi.org/v2/everything?q=${encodedSearchQuery}&apiKey=${NEWS_API_KEY}&language=fr&from=${formattedSevenDaysAgo}&to=${formattedToday}&searchIn=title`;

	fetch(apiUrl, options)
		.then(response => response.json())
		.then(data => {
			return data;
		})
		.catch(error => error);
};

module.exports = queryAPI;
