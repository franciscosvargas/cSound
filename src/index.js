const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('teste');
});

app.listen(process.env.PORT || 3001, () => {
    console.log('Servidor iniciado com sucesso!');
});