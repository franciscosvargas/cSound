
const request = require('request');

class Search {
    async fetchResults(req, res) {
        const options = {
            url: `https://api.spotify.com/v1/search?q=${req.query.term}&type=${req.query.type}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer BQAWIAjDM9ZQrxDeK4IFVm_5y19f2YEQvKPPdgSfa3avEGGOK-Qiy12qiJfVuQNxQQelURNunnQwOgNsfHU'
            }
        }
        
        return await request(options, function (error, response, body) {
			if (error) throw new Error(error);

			return res.status(200).send(body);
		});
        
    }


}

module.exports = new Search();