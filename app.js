const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const analyticsRoute = require('./api/routes/analytics')

app.use('/analytics', analyticsRoute)

app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        message: error.message
    })
})




module.exports = app;