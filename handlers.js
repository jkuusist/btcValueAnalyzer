const https = require('https')

function handleBearTrend(req, res) {
	let startDate = req.headers

//	https.get('https://httpbin.org/get', response => {
	https.get('https://api.coingecko.com/api/v3/ping', response => {
		const { statusCode } = response
		const contentType = response.headers['content-type']

		console.log('contentType: ', contentType)
		console.log('typeof contentType: ', typeof(contentType))

		let error

		if (statusCode != 200) {
			error = new Error(`Request failed. Status code: ${statusCode}`)
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

//				console.log('parsedData: ', parsedData)

				res.send(parsedData)
			} catch (e) {
				console.error(e.message)
			}
		})
	})
}

exports.handleBearTrend = handleBearTrend
