import Button from '$store/components/ui/Button.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import { sendEvent } from '$store/sdk/analytics.tsx'
import { useUI } from '$store/sdk/useUI.ts'
import { useCart } from 'apps/vtex/hooks/useCart.ts'

function SearchButton() {
	const { displaySearchbar } = useUI()

	return (
		<Button
			class='btn btn-circle btn-sm btn-ghost'
			aria-label='search icon button'
			onClick={() => {
				displaySearchbar.value = !displaySearchbar.peek()
			}}
		>
			<Icon id='MagnifyingGlass' width={20} height={20} strokeWidth={0.1} />
		</Button>
	)
}

function MenuButton() {
	const { displayMenu } = useUI()

	return (
		<Button
			class='btn-ghost border-0 mb-3.5 p-0'
			aria-label='open menu'
			onClick={() => {
				displayMenu.value = true
			}}
		>
			<Icon id='Bars3' width={24} height={24} class='header-mobile-icon' />
		</Button>
	)
}

function CartButton() {
	const { displayCart } = useUI()
	const { loading, cart, mapItemsToAnalyticsItems } = useCart()
	const totalItems = cart.value?.items.length || null
	const currencyCode = cart.value?.storePreferencesData.currencyCode
	const total = cart.value?.totalizers.find((item) => item.id === 'Items')
	const discounts = cart.value?.totalizers.find((item) => item.id === 'Discounts')

	const onClick = () => {
		displayCart.value = true
		sendEvent({
			name: 'view_cart',
			params: {
				currency: cart.value ? currencyCode! : '',
				value: total?.value ? (total?.value - (discounts?.value ?? 0)) / 100 : 0,

				items: cart.value ? mapItemsToAnalyticsItems(cart.value) : [],
			},
		})
	}

	return (
		<Button
			class='!bg-transparent border-0 transform-none'
			aria-label='open cart'
			data-deco={displayCart.value && 'open-cart'}
			loading={loading.value}
			onClick={onClick}
		>
			<div class='group flex items-center gap-2 relative text-gray-600'>
				{!loading.value && (
					<>
						<Icon
							id='ShoppingCart'
							width={24}
							height={24}
							strokeWidth={2}
							class='group-hover:text-gray-400 duration-200 header-mobile-icon'
						/>
					</>
				)}
				{totalItems
					? (
						<div class='flex gap-1 flex-col justify-center items-center absolute xl:static -top-1 -right-[17px] w-6 h-6 xl:w-[initial] xl:h-[initial] bg-gray-500 xl:bg-transparent rounded-[50%]'>
							<p class='normal-case text-xs xl:text-sm text-gray-500 leading-none hidden xl:block'>
								{totalItems === 1 ? 'Item' : 'Itens'}
							</p>
							<p class='normal-case text-sm text-gray-100 xl:text-gray-400 leading-none xl:flex'>
								<span class='hidden xl:block'>(</span>
								<span class='hidden xl:block'>
									{String(totalItems).padStart(2, '0')}
								</span>
								<span class='xl:hidden'>{totalItems}</span>
								<span class='hidden xl:block'>)</span>
							</p>
						</div>
					)
					: (
						<div class='flex gap-1 flex-col justify-center items-center absolute xl:static -top-1 -right-[17px] w-6 h-6 xl:w-[initial] xl:h-[initial] bg-gray-500 xl:bg-transparent rounded-[50%]'>
							<p class='normal-case text-sm text-gray-500 font-normal leading-none hidden xl:block'>
								Itens
							</p>
							<p class='normal-case text-sm text-gray-200 xl:text-gray-400 leading-none flex'>
								<span class='hidden xl:block'>(</span>
								<span class='hidden xl:block'>00</span>
								<span class='xl:hidden'>0</span>
								<span class='hidden xl:block'>)</span>
							</p>
						</div>
					)}
			</div>
		</Button>
	)
}

function Buttons({ variant }: { variant: 'cart' | 'search' | 'menu' }) {
	if (variant === 'cart') {
		return <CartButton />
	}

	if (variant === 'search') {
		return <SearchButton />
	}

	if (variant === 'menu') {
		return <MenuButton />
	}

	return null
}

export default Buttons
