import { IS_BROWSER } from '$fresh/runtime.ts'
import { useUI } from '$store/sdk/useUI.ts'

export default function MainJS() {
	const { displayCart } = useUI()

	if (IS_BROWSER) {
		const shoppingCart = document.querySelector('.shopping-cart') as HTMLElement
		const isMobile = window.matchMedia('(max-width: 767px)').matches

		shoppingCart.onclick = () => {
			displayCart.value = true

			if (!isMobile) {
				document.querySelector('.root')!.classList.add('header-hover')
			}
		}
	}

	return null
}
