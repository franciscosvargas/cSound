const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Search = require('./controllers/search');
const Auth = require('./controllers/auth');
const app = express();

// Configurations from server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
	'mongodb+srv://admin:yottaadmin@discoderiadb-qdlfx.mongodb.net/test?retryWrites=true',
	{
		useNewUrlParser: true
	}
);

app.get('/search', Search.fetchResults);

app.post('/auth/register', Auth.registerUser);
app.post('/mobile/auth/', Auth.mobileAuthentication);

require('./routes/mobile')(app);


app.listen(process.env.PORT || 3001, () => {
	console.log('Servidor iniciado com sucesso!');
});

