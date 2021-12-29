# btc_value_analyzer

## How to run:
1. Install node.js and npm if you don't already have them
2. Run `npm install` to install dependencies
3. Run `npm start` to start the server

## How to use once the server is running:

### A. Longest bearish trend within a given date range
`curl http://localhost:8080/bearTrend --header 'start date: YYYY-MM-DD' --header 'end date: YYYY-MM-DD'`

Returns the number of days the longest bearish trend within the given date range lasted.

### B. Highest trading volume within a given date range
`curl http://localhost:8080/highestVolume --header 'start date: YYYY-MM-DD' --header 'end date: YYYY-MM-DD'`

Returns the date within the given date range with the highest trading volume, and the volume on that date.

### C. Best date to buy and best date to sell within a given date range
`curl http://localhost:8080/buySell --header 'start date: YYYY-MM-DD' --header 'end date: YYYY-MM-DD'`

Returns the date to buy and date to sell within the given date range that would give the maximum profit, or "Buying/selling not recommended in this date range"
if the price only went down during that time and thus there was no profit to be found.


**The start and end dates must exist and not be before 2013-04-28 as CoinGecko does not have data for dates before that.**

Data provided by CoinGecko: https://www.coingecko.com
