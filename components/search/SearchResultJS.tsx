import { IS_BROWSER } from '$fresh/runtime.ts'

export default function SearchResultJs() {
	if (IS_BROWSER) {
		const notFoundInput = document.querySelector('.not-found-input')! as HTMLInputElement

		notFoundInput.addEventListener('keypress', (e) => {
			const text = notFoundInput.value

			if (e.key === 'Enter') {
				window.location.href = `/s?q=${text}`
			}
		})
	}

	return null
}
