const express = require('express');
const bodyParser = require('body-parser');
const Search = require('./controllers/search')
const app = express();

// Configurations from server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/search', Search.fetchResults);


app.listen(process.env.PORT || 3001, () => {
    console.log('Servidor iniciado com sucesso!');
});

