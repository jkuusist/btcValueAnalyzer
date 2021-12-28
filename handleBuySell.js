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

function formatDate(unixTime) {
	let temp = new Date(unixTime)

	const year = temp.getUTCFullYear()
	let month = temp.getUTCMonth()
	let day = temp.getUTCDate()

	if (month.toString().length === 1) {
		month = '0' + month
	}

	if (day.toString().length === 1) {
		day = '0' + day
	}

	let formattedDate = year + '-' + month + '-' + day

	return (formattedDate)
}

function handleBuySell(req, res) {
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

						buyDate = formatDate(buyDate[0])
						sellDate = formatDate(sellDate[0])

						res.send(`buy: ${buyDate}\nsell: ${sellDate}`)
					}
				} catch (e) {
					res.send(e.message)
				}
			})
		})
	}
}

exports.handleBuySell = handleBuySell
