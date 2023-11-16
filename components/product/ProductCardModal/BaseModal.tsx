import { useId } from '$store/sdk/useId.ts'
import { useSignal } from '@preact/signals'
import { ComponentChildren } from 'preact'
import { useEffect } from 'preact/hooks'
import Icon from '$store/components/ui/Icon.tsx'

interface Props {
	onClose?: () => void
	open?: boolean
	class?: string
	children?: ComponentChildren
	loading?: 'eager' | 'lazy'
}

function Modal(props: Props) {
	const {
		children,
		open,
		onClose,
		class: _class = '',
		loading = 'lazy',
	} = props
	const lazy = useSignal(loading === 'lazy' && !open)
	const id = useId()

	useEffect(() => {
		const handler = (e: KeyboardEvent) =>
			(e.key === 'Escape' || e.keyCode === 27) && open && onClose?.()

		addEventListener('keydown', handler)

		return () => {
			removeEventListener('keydown', handler)
		}
	}, [open])

	useEffect(() => {
		lazy.value = false
	}, [])

	return (
		<>
			<input
				id={id}
				checked={open}
				type='checkbox'
				class='modal-toggle'
				onChange={(e) => e.currentTarget.checked === false && onClose?.()}
			/>
			<div class='modal !bg-transparent'>
				<div
					class={`modal-box relative !shadow-[-3px_3px_20px_3px_rgba(0,_0,_0,_0.25)] ${_class}`}
				>
					<label
						for={id}
						class='absolute top-5 right-5 text-black z-10 cursor-pointer'
					>
						<span class='sr-only'>Fechar modal</span>
						<Icon id='XMark' size={28} />
					</label>
					{!lazy.value && children}
				</div>
				{
					/*
                    Yes, i can use label to close
                    But it affect acessibility, the screen reader will read the first label
                    https://stackoverflow.com/a/3992160

                    What in this case doesn't make a difference, but WAVE is happy
                */
				}
				<div
					class='modal-backdrop'
					onClick={() => {
						;(document.getElementById(id) as HTMLInputElement)!.checked = false
					}}
				>
					Close
				</div>
			</div>
		</>
	)
}

export default Modal
