import Button from '$store/components/ui/Button.tsx'
import { useSignal } from '@preact/signals'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import type { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

import Icon from '$store/components/ui/Icon.tsx'

export type Props = JSX.IntrinsicElements['dialog'] & {
	title?: string
	mode?: 'sidebar-right' | 'sidebar-left' | 'center'
	onClose?: () => Promise<void> | void
	loading?: 'lazy' | 'eager'
}

const dialogStyles = {
	'sidebar-right': 'animate-slide-left',
	'sidebar-left': 'animate-slide-right',
	center: 'animate-fade-in',
}

const sectionStyles = {
	'sidebar-right': 'justify-end',
	'sidebar-left': 'justify-start',
	center: 'justify-center items-center',
}

const containerStyles = {
	'sidebar-right': 'h-full w-full sm:max-w-[520px]',
	'sidebar-left': 'h-full w-full sm:max-w-[520px]',
	center: '',
}

const MinicartModal = ({
	open,
	title,
	mode = 'sidebar-right',
	onClose,
	children,
	loading,
	...props
}: Props) => {
	const lazy = useSignal(false)
	const ref = useRef<HTMLDialogElement>(null)
	const { cart } = useCart()
	const totalItems = cart.value?.items.length || null

	useEffect(() => {
		if (open === false) {
			document.getElementsByTagName('body').item(0)?.classList.remove(
				'no-scroll',
			)
			ref.current?.open === true && ref.current.close()
		} else if (open === true) {
			document.getElementsByTagName('body').item(0)?.classList.add(
				'no-scroll',
			)
			ref.current?.open === false && ref.current.showModal()
			lazy.value = true
		}
	}, [open])

	return (
		<dialog
			{...props}
			ref={ref}
			class={`bg-transparent p-0 m-0 max-w-full w-full max-h-full h-full backdrop-opacity-50 ${
				dialogStyles[mode]
			} ${props.class ?? ''}`}
			onClick={(e) => (e.target as HTMLDialogElement).tagName === 'SECTION' && onClose?.()}
			onClose={onClose}
		>
			<section
				class={`w-full h-full flex bg-[#00000033] ${sectionStyles[mode]}`}
			>
				<div
					class={`bg-base-100 flex flex-col lg:max-h-[600px] ${containerStyles[mode]}`}
				>
					<header class='flex p-4 justify-between items-center font-tt-norms'>
						<Button
							class='text-neutral-0 !bg-transparent font-bold p-2 border-none h-[34px] flex items-center gap-x-5 text-sm'
							onClick={onClose}
						>
							<Icon id='ChevronRight' width={14} height={14} class='rotate-180' />
							<span class='translate-y-px'>
								Voltar
							</span>
						</Button>
						<div class='flex gap-2 items-center'>
							{totalItems
								? <Icon id='MinicartBag' size={20} />
								: <Icon id='ShoppingCart' size={20} class='brightness-0' />}
							<div>
								<p class='font-bold text-neutral-0'>Carrinho</p>
								{totalItems
									? (
										<p class='flex gap-x-1 text-neutral-1 text-xs'>
											<span class=''>
												({String(totalItems).padStart(2, '0')})
											</span>
											<span class=''>
												{totalItems === 1 ? 'item' : 'itens'}
											</span>
										</p>
									)
									: (
										<p class='flex gap-x-1 text-neutral-1 text-xs'>
											<span class=''>
												(00) itens
											</span>
										</p>
									)}
							</div>
						</div>
					</header>
					<div class='overflow-y-auto flex-grow flex flex-col'>
						{loading === 'lazy' ? lazy.value && children : children}
					</div>
				</div>
			</section>
		</dialog>
	)
}

export default MinicartModal
