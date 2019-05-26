const request = require('request');
const bcrypt = require('bcryptjs');


const User = require('../models/User');


class Auth {
	getApplicationToken() {
		const credentials = Buffer.from("clientId:clientSecret")
			.toString('base64');

		const options = {
			url: 'https://accounts.spotify.com/api/token',
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Basic ${credentials}`
			},
			form: { grant_type: 'client_credentials' }
		}

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);
		});
	}

	async registerUser(req, res) {
		try {
			console.log(req.body);
			await userNotExists(req.body.email);
			req.body.password = await encrypt(req.body.password);
			const user = await User.create(req.body);

			return res.json(user);
		} catch (err) {
			return Promise.reject(err);
		}
	}


}

function encrypt(data) {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(5, (error, salt) => {
			bcrypt.hash(data, salt, (err, hash) => {
				if (err) {
					reject(err);
				} else {
					resolve(hash);
				}
			});
		});
	});
}

async function userNotExists(email) {
	return new Promise((resolve, reject) => {
		User.findOne({ email: email }, function (err, user) {
			if (!user && err == null) {
				resolve(true);
			} else if (user) {
				reject("Há um usuário cadastrado com esse endereço de email.");
			}
		});
	});
}

module.exports = new Auth();