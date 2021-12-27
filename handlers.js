const https = require('https')

function handleBearTrend(req, res) {
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
	} else {
		https.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${unixStartDate}&to=${unixEndDate}`, response => {
			const { statusCode } = response
			const contentType = response.headers['content-type']

			let error

			if (statusCode != 200) {
				error = new Error(`Request failed. Status Code: ${statusCode}`)
			} else if (!contentType.includes('application/json')) {
				error = new Error(`Invalid content type: ${contentType}`)
			}

			if (error) {
				console.error(error.message)
			}

			response.setEncoding('utf8')
			let rawData = ''

			response.on('data', (chunk) => {
				rawData += chunk
			})

			response.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData)

					let priceArray = []

					for (let i = 0; i < parsedData.prices.length; i++) {
						let temp = new Date(parsedData.prices[i][0])

						if (temp.getUTCHours() === 0) {
							priceArray.push(parsedData.prices[i])
						}
					}

					res.send(parsedData)
				} catch (e) {
					console.error(e.message)
				}
			})
		})
	}
}

exports.handleBearTrend = handleBearTrend
