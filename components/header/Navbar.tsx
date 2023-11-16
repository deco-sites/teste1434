import { IS_BROWSER } from '$fresh/runtime.ts'
import { useSignal } from '@preact/signals'
import type { HTMLWidget, ImageWidget } from 'apps/admin/widgets.ts'
import clsx from '$store/sdk/clsx.ts'
import { lazy, Suspense } from 'preact/compat'

export interface NavItemProps {
	label: string
	href: string
	children?: Array<{
		label?: string
		href?: string
		seeMore?: string
		children?: Array<{
			label: string
			href: string
		}>
	}>
	image?: {
		src?: ImageWidget
		alt?: string
	}
	textBelowImage?: HTMLWidget
}

interface Props {
	navItems: NavItemProps[]
}

const NavItem = lazy(() => import('./NavItem.tsx'))

function Navbar({ navItems }: Props) {
	const hover = useSignal(false)
	const hoveredItem = useSignal<number | null>(null)

	// Menu
	return (
		<>
			{/* Desktop Version */}
			<div class='flex h-[37px] container border-b border-white text-white duration-200'>
				<nav class='w-full container-center justify-center items-center'>
					<ul
						class={clsx(
							hoveredItem.value !== null &&
								!!navItems[hoveredItem.value]?.children?.length &&
								'hover:after:block hover:before:block',
							'flex justify-center h-full',
							'after:hidden after:absolute after:w-full after:h-px after:bg-neutral-3 after:bottom-0 after:left-0 after:z-10 group-data-[micro-header="true"]/header:after:!hidden',
							'before:hidden before:absolute before:w-full before:h-px before:bg-neutral-3 before:bottom-9  before:left-0 before:z-10 group-data-[micro-header="true"]/header:before:!hidden',
						)}
					>
						{navItems.map((navItem, i) => (
							<>
								<li
									onMouseEnter={() => hoveredItem.value = i}
									onMouseLeave={() => hoveredItem.value = null}
									class={clsx(
										!!navItem?.children?.length && '_hide-borders',
										'group flex items-center relative font-tt-norms text-navbar-item-text group-data-[micro-header="false"]/header:first:font-bold group-data-[micro-header="false"]/header:last:font-bold last:text-last-navbar-item-text',
									)}
								>
									<a
										href={navItem.href}
										onMouseEnter={() => hover.value = true}
										class='
                                            px-3 xl:px-6 group-first:pl-6 xl:group-first:pl-12 group-last:pr-6 xl:group-last:pr-12 h-full flex items-center text-sm
                                            group-data-[micro-header="true"]/header:text-neutral-0 group-data-[micro-header="true"]/header:group-last:text-client-primary group-data-[micro-header="true"]/header:group-last:font-bold
                                            border-t-2 border-transparent hover:border-t-2 hover:border-primary-500 transition-all
                        '
									>
										{navItem.label}
									</a>
									{hover.value && IS_BROWSER && navItem.children &&
										navItem.children.length > 0 &&
										(
											<Suspense fallback={<></>}>
												<NavItem
													{...navItem}
													seeMore={navItem.href}
													textBelowImage={navItem.textBelowImage}
												/>
											</Suspense>
										)}
								</li>
							</>
						))}
					</ul>
				</nav>
			</div>
		</>
	)
}

export default Navbar
