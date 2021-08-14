const express = require('express');
const fetch = require('node-fetch');
const configuration = require('../config');

const router = express.Router();
const popularMoviesID = ['tt0241527', 'tt1201607', 'tt0094862', 'tt0111161', 'tt0167261', 'tt0120338'];
let popularMoviesData = '';

async function initialPopularMovies() {
    const allPromises = popularMoviesID.map(movie => fetch(`https://www.omdbapi.com/?i=${movie}&apikey=${configuration.apiKey}`));
    const all = await Promise.all(allPromises);
    const allAsJson = all.map(value => value.json());
    popularMoviesData = await Promise.all(allAsJson);
}

router.get('/getInitData', (req, res) => {
    res.status(200).send(popularMoviesData);
});

module.exports = {
    router,
    initialPopularMovies
};
