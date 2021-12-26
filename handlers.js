const https = require('https')

function handleBearTrend(req, res) {
	let startDate = new Date(req.header('start date'))
	let endDate = new Date(req.header('end date'))

	let unixStartDate = startDate.getTime() / 1000
	let unixEndDate = endDate.getTime() / 1000 + 3600

	https.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${unixStartDate}&to=${unixEndDate}`, response => {
		const { statusCode } = response
		const contentType = response.headers['content-type']

		console.log('statusCode: ', statusCode)

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

				console.log('parsedData: ', parsedData)

				res.send(parsedData)
			} catch (e) {
				console.error(e.message)
			}
		})
	})
}

exports.handleBearTrend = handleBearTrend
