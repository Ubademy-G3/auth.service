const express = require('express');

const app = express();

var client = require('mongoose');
client.connect('mongodb://mongo/test', {useNewUrlParser: true});

app.get('/ping', (req, res) => res.send('Pong!'));

//app.get('/status', (req, res) => 
//    client.query('SELECT NOW()', (err) => res.send({ service: 'UP', db: err ? 'DOWN' : 'UP' }))
//);

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`); 
});
