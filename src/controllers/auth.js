const request = require('request');

class Auth {
    getToken() {
        const credentials = Buffer.from("clientId:clientSecret")
        .toString('base64');

        const options = {
            url: 'https://accounts.spotify.com/api/token',
            method: "POST",
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                'Authorization': `Basic ${credentials}`
            },
            form: {grant_type: 'client_credentials'}
        }

        request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
    }
}

module.exports = new Auth();