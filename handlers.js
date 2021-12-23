const https = require('https')

function handleBearTrend(req, res) {
//	https.get('https://httpbin.org/get', response => {
	https.get('https://api.coingecko.com/api/v3/ping', response => {
		const { statusCode } = response
		const contentType = response.headers['content-type']

		response.setEncoding('utf8')
		let rawData = ''

		response.on('data', (chunk) => {
			rawData += chunk
		})

		response.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData)

//				console.log('parsedData: ', parsedData)

				res.send(parsedData)
			} catch (e) {
				console.error(e.message)
			}
		})
	})
}

exports.handleBearTrend = handleBearTrend
