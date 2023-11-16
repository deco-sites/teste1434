import { useUI } from '$store/sdk/useUI.ts'
import type { JSX } from 'preact'

export type Props = Omit<JSX.IntrinsicElements['button'], 'onClick'>

export default function VideoModal({ children, ...props }: Props) {
	const { displayVideoModal } = useUI()

	return (
		<button
			{...props}
			onClick={() => displayVideoModal.value = true}
		>
			{children}
		</button>
	)
}
