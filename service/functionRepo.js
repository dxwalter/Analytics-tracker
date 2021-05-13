const { captureRejectionSymbol } = require('events')
const fs = require('fs')
const moment = require('moment')
const path = require('path')
const dbPath = '../DB/index.json'

writeToFile = (data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(path.resolve(__dirname, dbPath), JSON.stringify(data) + '\r', err => {
            if (err) reject({
                message: err.message
            })

            resolve({
                status: 'success'
            })
        })
    })
}

clearDatabase = () => {
    fs.writeFile(path.resolve(__dirname, dbPath), '', err => {})
}

saveMockData = (data) => {
    for (const validData of data) {
        fs.appendFile(path.resolve(__dirname, dbPath), JSON.stringify(validData) + '\r', err => {})
    }
}

updateDatabase = (data) => {
    // clear data
    fs.writeFile(path.resolve(__dirname, dbPath), '', err => {})
    for (const validData of data) {
        fs.appendFile(path.resolve(__dirname, dbPath), JSON.stringify(validData) + '\r', err => {})
    }
}

formatDate = (data) => {
    return moment.unix(data).format(
        'MMMM Do YYYY, h:mm a'
      )
}

calculateDistance = (x, y) => {
    return (x*x) + (y*y)
}

getLatestData = (eventData) => {
    const currentTime = moment().unix()
    const validData = []
    const customData = []

    for (const data of eventData) {
        const parseData = JSON.parse(data)
        const validParsedData = JSON.parse(data)
        const validTime = currentTime - parseData.createdAt
        if (validTime <= 3600) {
            validData.push(validParsedData)
            parseData.createdAt = formatDate(parseData.createdAt)
            parseData.distance = calculateDistance(Number(parseData.coordinates.x), Number(parseData.coordinates.y))
            customData.push(parseData)
        }
    }
    updateDatabase(validData)
    return customData
}

readAllData = () => {
    return new Promise((resolve, reject) => {
        let event = [];
        fs.readFileSync(path.resolve(__dirname, dbPath), 'utf8').toString().split('\r').forEach(function (line) {
            if (line) {
                event.push(line);
            }	
        });
        resolve(getLatestData(event))
        reject({
            message: 'An error occurred getting data from file'
        })
    })
}

findDistance = (ip) => {
    return new Promise((resolve, reject) => {
        const allData = readAllData().then(result => {
            if (result.length === 0) {
                resolve({
                    distance: '',
                    message: 'No record was found'
                })
            }

            const validRecord = []
            for (const data of result) {
                if (data.ip === ip) {
                    validRecord.push(data)
                }
            }

            if (validRecord.length > 0) {
                const record = validRecord[validRecord.length - 1]
                resolve({
                    distance: record.distance,
                    message: 'Record found'
                })
            } else {
                resolve({
                    distance: '',
                    message: 'No record was found'
                })
            }
        }).catch(err => {
            reject({
                message: err.message
            })
        })
    })
}

module.exports = {
    findDistance,
    writeToFile,
    readAllData,
    clearDatabase,
    saveMockData
}