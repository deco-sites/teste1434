import Button from '$store/components/ui/Button.tsx'
import { useEffect, useRef } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import type { JSX } from 'preact'

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
	'sidebar-right': 'h-full w-full sm:max-w-lg',
	'sidebar-left': 'h-full w-full sm:max-w-lg',
	center: '',
}

const MenuMobileModal = ({
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
			class={`w-full font-tt-norms bg-transparent p-0 m-0 max-w-full max-h-full h-full backdrop-opacity-50 ${
				dialogStyles[mode]
			} ${props.class ?? ''}`}
			onClick={(e) => (e.target as HTMLDialogElement).tagName === 'SECTION' && onClose?.()}
			onClose={onClose}
		>
			<section
				class={`w-full h-full flex bg-transparent ${sectionStyles[mode]}`}
			>
				<div
					class={`relative bg-base-100 flex flex-col max-h-full ${containerStyles[mode]}`}
				>
					<header class='absolute top-0 right-0 z-[1]'>
					</header>
					<div class='overflow-y-auto flex-grow flex flex-col'>
						{loading === 'lazy' ? lazy.value && children : children}
					</div>
				</div>
				<Button
					class='bg-white px-[10px] border-0 bg-transparent rounded-none w-[57px] max-w-[57px]
						h-[82px] max-h-[82px] flex flex-col items-center justify-end pb-[5px] gap-[3px]
					'
					onClick={onClose}
				>
					<Icon
						id='CircleX'
						width={18}
						height={18}
						strokeWidth={2}
						class='text-danger-dark'
					/>
					<p class='text-xs text-danger-dark font-normal'>
						Sair
					</p>
				</Button>
			</section>
		</dialog>
	)
}

export default MenuMobileModal
