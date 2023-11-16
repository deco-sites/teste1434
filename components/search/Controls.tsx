import Filters from '$store/components/search/Filters.tsx'
import Sort from '$store/components/search/Sort.tsx'
import Breadcrumb from '$store/components/ui/Breadcrumb.tsx'
import Button from '$store/components/ui/Button.tsx'
import Drawer from '$store/components/ui/Drawer.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import PureButton from '$store/components/ui/PureButton.tsx'
import { useSignal } from '@preact/signals'
import type { ProductListingPage } from 'apps/commerce/types.ts'

export type Props = Pick<ProductListingPage, 'filters' | 'breadcrumb' | 'sortOptions'> & {
	displayFilter?: boolean
	url: string
	pageInfo: ProductListingPage['pageInfo']
	hasBanner: boolean
}

function SearchControls(
	{ filters, breadcrumb, displayFilter, sortOptions, url, pageInfo, hasBanner }: Props,
) {
	const open = useSignal(false)

	return (
		<Drawer
			loading='lazy'
			open={open.value}
			onClose={() => (open.value = false)}
			aside={
				<>
					<div class='flex h-full flex-col divide-y overflow-y-hidden bg-base-100'>
						<div class='flex items-center justify-between'>
							<h1 class='px-4 py-3'>
								<span class='text-2xl font-medium'>Filtrar</span>
							</h1>
							<Button class='btn btn-ghost' onClick={() => (open.value = false)}>
								<Icon id='XMark' size={24} strokeWidth={2} />
							</Button>
						</div>
						<div class='flex-grow overflow-auto p-4'>
							<Filters filters={filters} isAside />
						</div>
					</div>
				</>
			}
		>
			<div class='flex flex-col justify-between mx-auto'>
				<div
					class={`container mb-2 flex flex-row items-center sm:p-0 w-[95%] ${
						hasBanner ? 'mt-2' : 'mt-16'
					}`}
				>
					<Breadcrumb itemListElement={breadcrumb?.itemListElement} />
				</div>

				<div class='border-y border-y-[#C0BFBE]/50 bg-neutral-4/30'>
					<div class='container flex items-center gap-x-5 py-4 w-[95%]'>
						<PureButton
							class={`flex items-center gap-x-2 text-xs text-neutral-0 ${
								displayFilter ? '' : 'sm:hidden'
							}`}
							onClick={() => {
								open.value = true
							}}
						>
							Filtrar
							<Icon id='FilterList' width={16} height={16} />
						</PureButton>

						<span class='whitespace-nowrap text-xs font-light text-neutral-0'>
							Exibindo{' '}
							<span class='font-bold text-neutral-0'>
								1-{pageInfo.recordPerPage} de {pageInfo.records}
								{' '}
							</span>
							resultados
						</span>

						<div class='hidden h-full lg:block ml-auto'>
							{filters.length > 0 && (
								<div class='flex items-center gap-x-3 lg:gap-x-10'>
									<span class='hidden lg:block whitespace-nowrap text-xs font-bold text-neutral-0'>
										Filtrar Por:
									</span>
									<Filters filters={filters} />
								</div>
							)}
						</div>

						{sortOptions.length > 0 && (
							<div class='ml-auto flex items-center'>
								<span class='hidden lg:block whitespace-nowrap text-xs font-bold text-neutral-0'>
									Ordenar Por:
								</span>
								<Sort sortOptions={sortOptions} url={url} />
							</div>
						)}
					</div>
				</div>
			</div>
		</Drawer>
	)
}

export default SearchControls
