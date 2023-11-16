import { IS_BROWSER } from '$fresh/runtime.ts'
import { useUI } from '$store/sdk/useUI.ts'

type Props = {
	isHomePage: boolean
}

export default function HeaderJS({ isHomePage }: Props) {
	if (IS_BROWSER) {
		const { displaySearchPopup } = useUI()
		const top = document.querySelector('#top') as HTMLElement

		top.onmousemove = () => {
			if (!displaySearchPopup.value && isHomePage) {
				document.querySelector('.root')!.classList.add('header-hover')
			}
		}

		top.onmouseleave = () => {
			if (!displaySearchPopup.value && isHomePage) {
				document.querySelector('.root')!.classList.remove('header-hover')
			}
		}
	}

	return null
}
