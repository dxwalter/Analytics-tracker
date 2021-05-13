const express = require('express');
const router = express.Router()
const moment = require('moment')
const mainFunctions = require('../../service/functionRepo')

router.post('/', (req, res, next) => {
    req.body.createdAt = moment().unix()
    mainFunctions.writeToFile(req.body).then(result => {
        res.status(200).send({
            status: 'success',
            message: "Data created successfully"
        })
    }).catch(error => {
        res.status(500).send({
            status: 'error',
            message: error.message
            
        })
    })
})

router.get('/', (req, res, next) => {

    let ip = req.query.ip;

    if (ip) {
        mainFunctions.findDistance(ip).then(result => {
            res.status(result.distance ? 200 : 404).send({
                status: 'success',
                distance: result.distance,
                message: result.message
            })
        }).catch(error => {
            res.status(500).send({
                status: 'error',
                message: error.message
            })
        })
        return
    }

    mainFunctions.readAllData().then(result => {
        res.status(200).send(result)
    }).catch (error => {
        res.status(500).send({
            status: 'error',
            message: error.message
            
        })
    })
});

module.exports = router;