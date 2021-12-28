const express = require('express')
const app = express()
const port = 8080

const handleBearTrend = require('./handleBearTrend')
const handleHighestVolume = require('./handleHighestVolume')

app.get('/', (req, res) => {
	res.send('Welcome to the BTC value analyzer!')
})

app.get('/bearTrend', (req, res) => {
	handleBearTrend.handleBearTrend(req, res)
})

app.get('/highestVolume', (req, res) => {
	handleHighestVolume.handleHighestVolume(req, res)

//	res.send('highestVolume')
})

app.get('/buySell', (req, res) => {
	res.send('buySell')
})

app.listen(port, () => {
	console.log('Listening at http://localhost:%d', port)
})
