const express = require('express');

const router = express.Router();

router.use('/', (req, res) => {
    res.status(404).send("<h1>Oops, Something Went Wrong (404)</h1>");
});

module.exports = {
    router
};

