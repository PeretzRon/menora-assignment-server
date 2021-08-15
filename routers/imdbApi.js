const express = require('express');
const fetch = require('node-fetch');
const configuration = require('../config');


const router = express.Router();
const popularMoviesID = [{imdbID: 'tt0120591',}, {imdbID: 'tt1201607',}, {imdbID: 'tt0099253',},
    {imdbID: 'tt0111161',}, {imdbID: 'tt0167261',}, {imdbID: 'tt0120338',}, {imdbID: 'tt0118158'},
    {imdbID: 'tt0108778',}, {imdbID: 'tt0117571',}, {imdbID: 'tt0114709',}];
let popularMoviesData = '';

async function getMoviesByID(isInitialMovies, searchMoviesList) {
    const movies = isInitialMovies ? popularMoviesID : searchMoviesList;
    const allPromises = movies.map(movie => fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${configuration.apiKey}`));
    const all = await Promise.all(allPromises);
    const allMoviesAsJson = all.map(value => value.json());
    const finalResults = await Promise.all(allMoviesAsJson);
    if (isInitialMovies) {
        popularMoviesData = finalResults;
    }
    return finalResults;
}

router.get('/popularMovies', (req, res) => {
    res.status(200).send(popularMoviesData);
});

router.get('/searchMovie', (req, res) => {
    const movieName = req.query.search;
    fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${configuration.apiKey}`)
        .then(value => value.json())
        .then(results => {
            console.log(results.Error);
            if (results.Error === 'Movie not found!') {
                res.status(200).send(JSON.stringify([]));
            } else {
                return getMoviesByID(false, results.Search);
            }
        })
        .then(results => {
            res.status(200).send(results);
        }).catch(error => {
        res.status(501).send();
    });
});

module.exports = {
    router,
    initialPopularMovies: getMoviesByID
};
