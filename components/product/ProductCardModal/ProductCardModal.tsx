import BaseModal from '$store/components/product/ProductCardModal/BaseModal.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import clsx from '$store/sdk/clsx.ts'
import { useSignal } from '@preact/signals'
import type { Product } from 'apps/commerce/types.ts'
import { lazy, Suspense } from 'preact/compat'

const Content = lazy(() => import('./Content.tsx'))

export interface Props {
	product: Product
	ctaText?: string
}

export default function ProductCardModal(props: Props) {
	const open = useSignal(false)

	return (
		<>
			<button
				class={clsx(
					'flex items-center gap-x-3 font-light text-neutral-1 progress-primary',
					open.value && 'pointer-events-none',
				)}
				onClick={() => open.value = true}
			>
				<Icon id='Eye' size={16} class='shrink-0' />
				Ver com mais detalhes
			</button>

			<div>
				<BaseModal
					class='h-[95%] w-full flex !max-w-6xl !max-h-[580px] lg:pb-0 pt-10 overflow-y-hidden'
					loading='lazy'
					open={open.value}
					onClose={() => {
						open.value = false
					}}
				>
					<div class='bg-base-100 h-full w-full grid place-content-center'>
						<Suspense
							fallback={
								<div class='w-full h-full flex items-center justify-center'>
									<span class='loading loading-ring' />
								</div>
							}
						>
							{open.value && (
								<Content
									{...props}
								/>
							)}
						</Suspense>
					</div>
				</BaseModal>
			</div>
		</>
	)
}
