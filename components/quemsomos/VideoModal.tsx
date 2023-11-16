import Modal from '$store/components/ui/Modal.tsx'
import type { ComponentChildren } from 'preact'
import { Suspense } from 'preact/compat'
import { useUI } from '$store/sdk/useUI.ts'
import Icon from '$store/components/ui/Icon.tsx'

function Lazy(
	{ children }: {
		children: ComponentChildren
	},
) {
	return (
		<div class='bg-base-100 h-full'>
			<Suspense
				fallback={
					<div class='w-screen flex items-center justify-center'>
						<span class='loading loading-ring' />
					</div>
				}
			>
				{children}
			</Suspense>
		</div>
	)
}

export type Props = {
	url: string
}

export default function VideoModal({ url }: Props) {
	const { displayVideoModal } = useUI()

	return (
		<Modal
			open={displayVideoModal.value}
			onClose={() => {
				displayVideoModal.value = false
			}}
		>
			<Lazy>
				{displayVideoModal.value && (
					<div class='space-y-6'>
						<div class='text-neutral-600 flex justify-between border-b border-primary-500 py-3'>
							<p class='text-2xl'>Conheça nossos produtos</p>
						</div>
						<iframe
							loading='lazy'
							width='100%'
							height='315'
							src={url}
							title='YouTube video player'
							frameBorder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
							allowFullScreen
						>
						</iframe>
					</div>
				)}
			</Lazy>
		</Modal>
	)
}
