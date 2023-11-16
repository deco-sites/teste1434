import Modal from '$store/components/ui/Modal.tsx'
import { lazy, Suspense } from 'preact/compat'
import { useUI } from '$store/sdk/useUI.ts'

import type { Props as MenuProps } from '$store/components/header/MenuMobile.tsx'
import type { Props as SearchbarProps } from '$store/components/search/Searchbar.tsx'
import MinicartModal from '$store/components/minicart/MinicartModal.tsx'
import MenuMobileModal from './MenuMobileModal.tsx'

const MenuMobile = lazy(() => import('$store/components/header/MenuMobile.tsx'))
const Cart = lazy(() => import('$store/components/minicart/Cart.tsx'))
const Searchbar = lazy(() => import('$store/components/search/Searchbar.tsx'))

interface Props {
	menu: MenuProps
	searchbar?: SearchbarProps
}

function Modals({ menu, searchbar }: Props) {
	const { displayCart, displayMenu, displaySearchbar } = useUI()

	const fallback = (
		<div class='flex justify-center items-center w-full h-full'>
			<span class='loading loading-ring' />
		</div>
	)

	return (
		<>
			<MenuMobileModal
				title='Menu'
				mode='sidebar-left'
				loading='lazy'
				open={displayMenu.value}
				onClose={() => {
					displayMenu.value = false
				}}
			>
				<Suspense fallback={fallback}>
					<MenuMobile {...menu} />
				</Suspense>
			</MenuMobileModal>

			<Modal
				loading='lazy'
				open={displaySearchbar.value &&
					window?.matchMedia('(max-width: 767px)')?.matches}
				onClose={() => {
					displaySearchbar.value = false
				}}
			>
				<Suspense fallback={fallback}>
					<Searchbar {...searchbar} />
				</Suspense>
			</Modal>

			<MinicartModal
				title='Minha Sacola'
				mode='sidebar-right'
				loading='lazy'
				open={displayCart.value}
				onClose={() => {
					displayCart.value = false
				}}
			>
				<Suspense fallback={fallback}>
					<Cart />
				</Suspense>
			</MinicartModal>
		</>
	)
}

export default Modals
