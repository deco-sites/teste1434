import Icon from '$store/components/ui/Icon.tsx'
import type { NavItemProps } from './Navbar.tsx'
import Login from '$store/components/header/Login.tsx'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import { useUI } from '$store/sdk/useUI.ts'
export interface Props {
	items: NavItemProps[]
}

function MenuItem({ item }: { item: NavItemProps }) {
	const { href, label, children } = item

	return (
		<li
			class={`collapse ${
				children && children.length > 0 ? 'collapse-arrow' : ''
			} text-neutral-0 bg-client-primary border-b border-gray-100 rounded-none h-auto
      `}
		>
			<input type='checkbox' class='h-14 min-h-[auto]' />
			<a href={href} class='collapse-title h-14 min-h-[auto] after:text-white' aria-label='Item'>
				<span class='text-sm text-white'>
					{label}
				</span>
			</a>

			{children && children.length > 0 &&
				(
					<ul class='collapse-content bg-neutral-4 !p-0 border-b border-white max-h-[300px] overflow-y-scroll'>
						{children.map((node) => (
							<li class='border-b border-gray-300'>
								{
									/* <a
									class='p-4 flex items-center text-neutral-0 font-bold'
									href={node.href}
								>
									<span>{node.label}</span>
								</a> */
								}

								<nav>
									<ul class='flex flex-col gap-1'>
										{node.children?.map((leaf) => (
											<li>
												<a
													class='block text-neutral-0 font-bold text-sm py-4 px-6'
													href={leaf.href}
												>
													{leaf.label}
												</a>
											</li>
										))}
									</ul>
								</nav>
							</li>
						))}
					</ul>
				)}
		</li>
	)
}

function MenuMobile({ items }: Props) {
	const { cart } = useCart()
	const { displayMenu, displayCart } = useUI()
	return (
		<>
			<div class='px-[25px] pt-[43px] pb-[9px] border-b border-white bg-secondary-500'>
				<Login />
			</div>
			<a
				href='/account#/orders'
				class='pl-[25px] py-[15px] border-b border-white flex items-center gap-4 w-auto bg-secondary-500'
			>
				<span class='text-sm text-neutral-0 font-bold'>Meus pedidos</span>
			</a>

			<button
				class='pl-[25px] py-[15px] gap-2 flex items-center border-b border-white bg-secondary-500 font-tt-norms'
				onClick={() => {
					displayMenu.value = false
					displayCart.value = true
				}}
			>
				<Icon
					id='ShoppingCart'
					size={24}
					class='text-neutral-0'
				/>
				<span class='text-sm font-bold text-neutral-0'>Carrinho</span>
				<span class='text-sm text-neutral-0'>
					({cart.value!.items.length.toString().padStart(2, '0')}) itens
				</span>
			</button>

			<a
				class='pl-[25px] py-[15px] gap-2 flex items-center border-b border-white bg-secondary-500 font-tt-norms'
				href='/wishlist'
				aria-label='Wishlist'
			>
				<Icon
					id='Heart'
					size={24}
					class='text-neutral-0'
				/>
				<span class='text-sm font-bold text-neutral-0'>Lista de Favoritos</span>
			</a>

			<ul class=''>
				{items.map((item) => <MenuItem item={item} />)}
			</ul>
		</>
	)
}

export default MenuMobile
