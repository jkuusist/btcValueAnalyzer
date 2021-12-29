const utils = require('./utils')

const https = require('https')

function checkDecreasing(priceArray) {
	for (let i = 0; i < priceArray.length - 1; i++)
	{
		if (priceArray[i][1] < priceArray[i + 1][1]) {
			return (0)
		}
	}

	return (1)
}

function handleBuySell(req, res) {
	if (!utils.checkLeapYear(req.header('start date'))) {
		res.send('Invalid start date')
	} else if (!utils.checkLeapYear(req.header('end date'))) {
		res.send('Invalid end date')
	} else {
		let startDate = new Date(req.header('start date'))
		let endDate = new Date(req.header('end date'))

		let unixStartDate = startDate.getTime() / 1000
		let unixEndDate = endDate.getTime() / 1000 + 3600

		let error = utils.checkDates(startDate, endDate, unixStartDate, unixEndDate)

		if (error !== '') {
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

						let priceArray = []

						for (let i = 0; i < parsedData.prices.length; i++) {
							let temp = new Date(parsedData.prices[i][0])

							if (temp.getUTCHours() === 0) {
								priceArray.push(parsedData.prices[i])
							}
						}

						if (checkDecreasing(priceArray)) {
							res.send('Buying/selling not recommended in this date range')
						} else {
							let buyDate
							let buyIndex
							let sellDate

							buyDate = priceArray[0]

							for (let i = 0; i < priceArray.length - 1; i++) {
								if (priceArray[i][1] < buyDate[1]) {
									buyDate = priceArray[i]
									buyIndex = i
								}
							}

							sellDate = priceArray[buyIndex + 1]

							for (let i = buyIndex + 2; i < priceArray.length - 1; i++) {
								if (priceArray[i][1] > buyDate[1]) {
									sellDate = priceArray[i]
								}
							}

							buyDate = utils.formatDate(buyDate[0])
							sellDate = utils.formatDate(sellDate[0])

							res.send(`buy: ${buyDate}\nsell: ${sellDate}`)
						}
					} catch (e) {
						res.send(e.message)
					}
				})
			})
		}
	}
}

exports.handleBuySell = handleBuySell
