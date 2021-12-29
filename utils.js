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

exports.formatDate = formatDate
