const https = require('https')

function handleHighestVolume(req, res) {
	let startDate = new Date(req.header('start date'))
	let endDate = new Date(req.header('end date'))

	let unixStartDate = startDate.getTime() / 1000
	let unixEndDate = endDate.getTime() / 1000 + 3600

	if (startDate.toString() === 'Invalid Date') {
		res.send('Invalid start date')
	} else if (endDate.toString() === 'Invalid Date') {
		res.send('Invalid end date')
	} else if (unixStartDate >= (unixEndDate - 3600)) {
		res.send('End date must be later than start date')
	} else if (unixStartDate < 1367107200 || unixEndDate < 1367107200){
		res.send('Dates before 2013-04-28 not supported')
	} else {
		https.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${unixStartDate}&to=${unixEndDate}`, response => {
			const { statusCode } = response
			const contentType = response.headers['content-type']

			if (statusCode != 200) {
				res.send(`Request failed. Status Code: ${statusCode}`)
			} else if (!contentType.includes('application/json')) {
				res.send(`Invalid content type: ${contentType}`)
			}

			response.setEncoding('utf8')
			let rawData = ''

			response.on('data', (chunk) => {
				rawData += chunk
			})

			response.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData)

					let volumeArray = []

					for (let i = 0; i < parsedData.total_volumes.length; i++) {
						let temp = new Date(parsedData.total_volumes[i][0])

						if (temp.getUTCHours() === 0) {
							volumeArray.push(parsedData.total_volumes[i])
						}
					}

					let highest = volumeArray[0]

					for (let i = 0; i < volumeArray.length; i++) {
						if (volumeArray[i][1] > highest[1]) {
							highest = volumeArray[i]
						}
					}

					const highestDate = new Date(highest[0])
					const highestVolume = highest[1]

					const highestYear = highestDate.getUTCFullYear()
					let highestMonth = highestDate.getUTCMonth() + 1
					let highestDay = highestDate.getUTCDate()

					if (highestMonth.toString().length === 1) {
						highestMonth = '0' + highestMonth
					}

					if (highestDay.toString().length === 1) {
						highestDay = '0' + highestDay
					}

					res.send(`${highestYear}-${highestMonth}-${highestDay}, ${highestVolume}€`)
				} catch (e) {
					res.send(e.message)
				}
			})
		})
	}
}

exports.handleHighestVolume = handleHighestVolume
