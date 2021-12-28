const express = require('express')
const app = express()
const port = 8080

const handleBearTrend = require('./handleBearTrend')
const handleHighestVolume = require('./handleHighestVolume')
const handleBuySell = require('./handleBuySell')

app.get('/', (req, res) => {
	res.send('Welcome to the BTC value analyzer!')
})

app.get('/bearTrend', (req, res) => {
	handleBearTrend.handleBearTrend(req, res)
})

app.get('/highestVolume', (req, res) => {
	handleHighestVolume.handleHighestVolume(req, res)
})

app.get('/buySell', (req, res) => {
	handleBuySell.handleBuySell(req, res)
})

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`)
})
