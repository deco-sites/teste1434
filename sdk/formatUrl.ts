export function formatUrl(url: string) {
	const filteredUrl = url.split('?')[0]
	const segments = filteredUrl.split('/')
	return segments[segments.length - 1]
}

export function formatUrlToBreadcrumbName(url: string) {
	const formatedUrl = formatUrl(url!)

	const filteredName = formatedUrl.split('-')
	const capitalizedName = filteredName.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1)
	})
	const formatedName = capitalizedName.join(' ')
	return formatedName
}
