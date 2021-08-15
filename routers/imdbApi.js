const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require("node-cache");
const {popularMoviesID} = require('../utils/config');

const router = express.Router();
const cache = new NodeCache({stdTTL: 600, useClones: false});

async function getPopularMovies() {
    const popularMoviesCache = cache.get("PopularMoviesCache$");
    if (popularMoviesCache) {
        return popularMoviesCache;
    } else {
        const popularMovies = await getMoviesByID(popularMoviesID);
        if (popularMovies) {
            cache.set("PopularMoviesCache$", popularMovies);
        }
        return popularMovies;
    }
}

async function getMoviesByID(movies) {
    const allPromises = movies.map(movie => fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${process.env.IMDB_API_KEY}`));
    const all = await Promise.all(allPromises);
    const allMoviesAsJson = all.map(value => value.json());
    return await Promise.all(allMoviesAsJson);
}

router.get('/popularMovies', async (req, res) => {
    const movies = await getPopularMovies();
    res.status(200).send(movies);
});

router.get('/searchMovie', (req, res) => {
    const movieName = req.query.search;
    const valueFromCache = cache.get(movieName.toLowerCase());
    if (valueFromCache) { // try to get same search from cache
        res.status(200).send(valueFromCache);
    } else {
        fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${process.env.IMDB_API_KEY}`)
            .then(value => value.json())
            .then(results => {
                if (results.Error === 'Movie not found!') {
                    res.status(200).send(JSON.stringify([]));
                    return JSON.stringify([]);
                } else {
                    return getMoviesByID(results.Search);
                }
            })
            .then(results => {
                cache.set(movieName.toLowerCase(), results);
                res.status(200).send(results);
            }).catch(error => {
            res.status(501).send('error');
        });
    }
});

module.exports = {
    router,
    initialPopularMovies: getPopularMovies
};
