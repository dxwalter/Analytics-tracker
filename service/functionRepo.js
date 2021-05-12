const { captureRejectionSymbol } = require('events')
const fs = require('fs')
const moment = require('moment')
const path = require('path')

writeToFile = (data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(path.resolve(__dirname, '../DB/index.json'), JSON.stringify(data) + '\r', err => {
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
    fs.writeFile(path.resolve(__dirname, '../DB/index.json'), '', err => {})
}

saveMockData = (data) => {
    for (const validData of data) {
        fs.appendFile(path.resolve(__dirname, '../DB/index.json'), JSON.stringify(validData) + '\r', err => {})
    }
}

updateDatabase = (data) => {
    // clear data
    fs.writeFile(path.resolve(__dirname, '../DB/index.json'), '', err => {})
    for (const validData of data) {
        fs.appendFile(path.resolve(__dirname, '../DB/index.json'), JSON.stringify(validData) + '\r', err => {})
    }
}

formatData = (data) => {
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
        if (validTime <= 10600) {
            validData.push(validParsedData)
            parseData.createdAt = formatData(parseData.createdAt)
            parseData.distance = calculateDistance(Number(parseData.coordinates.x), Number(parseData.coordinates.y))
            customData.push(parseData)
        }
    }
    updateDatabase(validData)
    return customData
}

readAllData = () => {
    return new Promise((resolve, reject) => {
        // i += 0;
        let event = [];
        fs.readFileSync(path.resolve(__dirname, '../DB/index.json'), 'utf8').toString().split('\r').forEach(function (line) {
            // i += 1;
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
                    distance: record.distance
                })
            } else {
                resolve({
                    distance: '',
                    message: 'No record was found'
                })
            }
        })
    }).catch(err => {
        reject({
            message: 'No record was found'
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