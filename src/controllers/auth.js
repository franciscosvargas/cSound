const request = require('request');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const credentials = require('../credentials.json')


const User = require('../models/User');


class Auth {
	getSpotifyApplicationToken() {
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

			user.password = undefined;
			const token = jwt.sign({id: user._id}, credentials.secret, {expiresIn: 86400})
			return res.json({user, token});
		} catch (err) {
			return Promise.reject(err);
			res.status(400).send(err);
		}
	}

	async mobileAuthentication(req, res) {
		const { email, password } = req.body;
		const user = await User.findOne({email});

		if(!user)
			return res.status(401).send({error: 'Usuário não encontrado'})
		
		if(!await bcrypt.compare(password, user.password))
			return res.status(401).send({error: 'Senha incorreta.'})

		user.password = undefined;

		const token = jwt.sign({id: user._id}, credentials.secret, {expiresIn: 86400});
		res.send({user, token});	


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