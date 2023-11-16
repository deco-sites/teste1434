import Login from '$store/components/header/Login.tsx'
import type { Props as SearchbarProps } from '$store/components/search/Searchbar.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import Buttons from '$store/islands/HeaderButton.tsx'
import Image from 'apps/website/components/Image.tsx'
import Navbar, { NavItemProps } from './Navbar.tsx'

import Search from '$store/components/header/Buttons/Search.tsx'
import { LogoProps } from '$store/components/header/Header.tsx'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import MainJS from '$store/components/header/MainJS.tsx'

interface MainProps {
	searchbar: SearchbarProps
	menuItens: NavItemProps[]
	logo: LogoProps
	logoBlack: LogoProps
	isHomePage: boolean
	/**
	 * @ignore
	 */
	isMobile: boolean
}

function Main({
	searchbar: _searchbar,
	menuItens = [],
	logo,
	logoBlack,
	isHomePage,
	isMobile,
}: MainProps) {
	const searchbar = { ..._searchbar }
	menuItens = menuItens.filter((i) => i.label !== 'Novidades')
	const { cart } = useCart()
	const totalItems = cart.value?.items.length || null

	return (
		<>
			{isMobile
				? (
					<>
						{/* Mobile Version */}
						<div class='flex flex-col w-full justify-between items-center px-3.5 py-2 gap-3 bg-white'>
							<div class='flex items-center justify-between w-full h-full'>
								<div class='w-full flex h-full justify-start items-start'>
									<Buttons variant='menu' />
								</div>
								<a
									href='/'
									aria-label='Store logo'
									class='p-2 w-full group-data-[micro-header="true"]/header:max-w-[100px] group-data-[micro-header="true"]/header:flex group-data-[micro-header="true"]/header:justify-start flex max-h-[50px] justify-center items-center'
								>
									<Image
										src={logoBlack.logo}
										alt={logoBlack.alt}
										width={100}
										height={50}
										loading='eager'
									/>
								</a>
								<div class='w-full flex h-full justify-end'>
									<button class='shopping-cart flex items-center gap-2 group text-black'>
										<Icon
											id='ShoppingCart'
											class='flex-shrink-0 text-black brightness-0'
											width={24}
											height={24}
										/>

										<div class='text-sm whitespace-nowrap'>
											<p class='group-data-[micro-header="true"]/header:text-neutral-0'>
												{String(totalItems ?? 0).padStart(2, '0')}
											</p>
										</div>
									</button>
								</div>
							</div>
							<Search
								searchbar={searchbar}
								isHomePage={isHomePage}
								isMobile={isMobile}
							/>
						</div>
					</>
				)
				: (
					<>
						{/* Desktop Version */}
						<div class='font-tt-norms flex justify-between container items-center w-[95%] h-[71px] group-data-[micro-header="true"]/header:h-[72px]'>
							<div class='flex justify-start gap-9 items-center w-full group-data-[micro-header="true"]/header:hidden'>
								<a
									class='gap-2 flex items-center group text-gray-600'
									href='/#'
								>
									<Icon
										id='Pin'
										size={22}
										strokeWidth={1}
										fill='none'
										class='text-white header-icon'
									/>

									<span class='text-favorite-text text-sm font-tt-norms'>
										LOJAS
									</span>
								</a>

								<a
									class='gap-2 flex items-center group text-gray-600'
									href='/wishlist'
								>
									<Icon
										id='Heart'
										size={22}
										strokeWidth={2}
										fill='none'
										class='text-white header-icon group-hover:text-red-500 group-hover:filter-none'
									/>

									<span class='text-favorite-text text-sm font-tt-norms'>
										FAVORITOS
									</span>
								</a>
							</div>

							<a
								href='/'
								aria-label='Store logo'
								class='logo-black p-2 w-full hidden group-data-[micro-header="true"]/header:max-w-[100px] group-data-[micro-header="true"]/header:flex group-data-[micro-header="true"]/header:justify-start max-h-[50px] justify-center items-center'
							>
								<Image
									src={logoBlack.logo}
									alt={logoBlack.alt}
									width={100}
									height={50}
								/>
							</a>

							<a
								href='/'
								aria-label='Store logo'
								class='logo p-2 w-full group-data-[micro-header="true"]/header:hidden flex max-h-[50px] justify-center items-center'
							>
								<Image
									src={logo.logo}
									alt={logo.alt}
									width={100}
									height={50}
								/>
							</a>

							<div class='flex w-full group-data-[micro-header="true"]/header:w-max items-center gap-[37px] justify-end '>
								<div class='hidden group-data-[micro-header="true"]/header:block'>
									<Navbar navItems={menuItens} />
								</div>

								<Login />

								<Search
									searchbar={searchbar}
									isHomePage={isHomePage}
									isMobile={isMobile}
								/>
								<button class='shopping-cart flex items-center gap-2 group text-white'>
									<Icon
										id='ShoppingCart'
										class='flex-shrink-0 text-white header-icon group-data-[micro-header="true"]/header:!brightness-0'
										width={24}
										height={24}
									/>

									<div class='text-gray-600 text-sm whitespace-nowrap'>
										<p class='text-cart-text group-data-[micro-header="true"]/header:text-neutral-0'>
											({String(totalItems ?? 0).padStart(2, '0')})
										</p>
									</div>
								</button>
							</div>
						</div>
					</>
				)}

			<MainJS />
		</>
	)
}

export default Main
