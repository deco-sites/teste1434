import Modals from '$store/components/header/Modals.tsx'
import type { Props as SearchbarProps } from '$store/components/search/Searchbar.tsx'
import MicroHeaderSetup from '$store/components/ui/MicroHeaderSetup.tsx'
import type { ImageWidget } from 'apps/admin/widgets.ts'
import type { Product, Suggestion } from 'apps/commerce/types.ts'
import type { LoaderReturnType } from 'deco/types.ts'
import { default as isMobileLoader } from '$store/loaders/isMobile.ts'

import Alert from './Alert.tsx'
import Navbar from './Navbar.tsx'

import HeaderJS from '$store/components/header/HeaderJS.tsx'
import Main from './Main.tsx'
import { NavItemProps } from './Navbar.tsx'

export interface LogoProps {
	/**
	 * @title Logo do Header
	 */
	logo: ImageWidget

	/**
	 * @title Texto alternativo
	 */
	alt?: string
}

export interface Props {
	/** @title Barra do topo */
	alerts: string[]
	/** @title Search Bar */
	searchbar?: SearchbarProps
	/**
	 * @title Navigation items
	 * @description Navigation items used both on mobile and desktop menus
	 */
	navItems: NavItemProps[]

	/**
	 * @title Product suggestions
	 * @description Product suggestions displayed on search
	 */
	products?: LoaderReturnType<Product[] | null>

	/**
	 * @title Enable Top Search terms
	 */
	suggestions?: LoaderReturnType<Suggestion | null>

	/**
	 * @title Logo do Header
	 */
	logo: LogoProps

	/**
	 * @title Logo preto para o microheader
	 */
	logoBlack: LogoProps

	/**
	 * @ignore
	 */
	url: string
	/**
	 * @ignore
	 */
	isMobile: boolean
}

function Header({
	alerts,
	searchbar: _searchbar,
	products,
	navItems,
	suggestions,
	logo,
	logoBlack,
	url,
	isMobile,
}: Props) {
	const searchbar = { ..._searchbar, products, suggestions }

	const isHomePage = new URL(url).pathname === '/'

	return (
		<>
			<header
				class={`root group/header h-[148px] ${
					isHomePage ? 'absolute' : 'header-hover'
				} [&_.logo-black]:hidden [&_.logo]:flex [&.header-hover_.logo-black]:flex [&.header-hover_.logo]:hidden`}
				id='top'
			>
				<div class='w-full fixed top-0 z-50 group-data-[micro-header="true"]/header:h-[72px]'>
					<div
						class={`top-0 hover:bg-white text-white transition-all w-full
                        group-data-[micro-header="true"]/header:bg-white group-data-[micro-header="true"]/header:shadow-md z-50
                        ${isHomePage ? 'absolute' : 'relative'}
                    `}
					>
						<Alert alerts={alerts} />
						<Main
							searchbar={searchbar}
							menuItens={navItems}
							logo={logo}
							logoBlack={logoBlack}
							isHomePage={isHomePage}
							isMobile={isMobile}
						/>

						{!isMobile && (
							<div class='group-data-[micro-header="true"]/header:hidden flex'>
								<Navbar navItems={navItems} />
							</div>
						)}
					</div>
					<Modals
						menu={{ items: navItems }}
						searchbar={searchbar}
					/>
				</div>
				<MicroHeaderSetup rootId='top' threshold={10} />
			</header>
			<HeaderJS isHomePage={isHomePage} />
		</>
	)
}

export default Header
