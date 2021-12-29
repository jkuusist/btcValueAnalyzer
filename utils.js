function formatDate(unixTime) {
	let temp = new Date(unixTime)

	const year = temp.getUTCFullYear()
	let month = temp.getUTCMonth() + 1
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

function checkLeapYear(dateString) {
	let dateArray = dateString.split('-')

	let year = parseInt(dateArray[0], 10)
	let month = parseInt(dateArray[1], 10)
	let day = parseInt(dateArray[2], 10)

	if (month === 2 && day > 28) {
		if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
			return true
		} else {
			return false
		}
	}

	return true
}

function checkDates(startDate, endDate, unixStartDate, unixEndDate) {
	if (startDate.toString() === 'Invalid Date') {
		return('Invalid start date')
	} else if (endDate.toString() === 'Invalid Date') {
		return('Invalid end date')
	} else if (unixStartDate >= (unixEndDate - 3600)) {
		return('End date must be later than start date')
	} else if (unixStartDate < 1367107200 || unixEndDate < 1367107200){
		return('Dates before 2013-04-28 not supported')
	} else {
		return('')
	}
}

exports.formatDate = formatDate
exports.checkLeapYear = checkLeapYear
exports.checkDates = checkDates
