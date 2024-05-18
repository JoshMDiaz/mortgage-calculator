export const formatNumberWithCommas = (value: string | number): string => {
	if (typeof value === 'number') {
		value = value.toString()
	}
	if (value === '') {
		return ''
	}
	return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const parseFormattedNumber = (value: string): number => {
	if (value === '') {
		return 0
	}
	return parseFloat(value.replace(/,/g, ''))
}
