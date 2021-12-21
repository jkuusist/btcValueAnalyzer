const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
	res.send('Welcome to the BTC value analyzer!')
})

app.get('/bearTrend', (req, res) => {
	res.send('bearTrend')
})

app.get('/highestVolume', (req, res) => {
	res.send('highestVolume')
})

app.get('/buySell', (req, res) => {
	res.send('buySell')
})

app.listen(port, () => {
	console.log('Listening at http://localhost:%d', port)
})
