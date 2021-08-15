const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const configuration = require('./config');
const imdbApi = require('./routers/imdbApi');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(imdbApi.router);
const server = http.createServer(app);

// get the 10 popular movie and then start the server
imdbApi.initialPopularMovies(true)
    .then(() => {
        server.listen(configuration.serverPort, () => {
            console.log(`Server start on port ${configuration.serverPort}`);
        });
    }).catch(reason => console.log(reason));
