import { getVariationsFromProduct } from '$store/sdk/product.ts'
import { useOffer } from '$store/sdk/useOffer.ts'
import type { Product } from 'apps/commerce/types.ts'
import { usePartial } from 'apps/website/hooks/usePartial.ts'

interface Props {
	product: Product
	id?: string
	partial?: boolean
}

function VariantSelector({ product, product: { url }, id, partial }: Props) {
	const vvv = ['Tamanho'] as const
	const variations = getVariationsFromProduct(product, ...vvv)

	return (
		<ul class='flex flex-col'>
			{Object.keys(variations).sort().map((name) => (
				<li class='flex flex-col gap-2 py-6 border-b border-[#C8C8C8] last:border-b-0 last:pb-14'>
					<span class='mb-3 block text-center text-xs font-bold text-neutral-0'>
						Outras opções de {name.toLowerCase()}:
					</span>
					<ul class='flex flex-wrap gap-3'>
						{variations[name as (typeof vvv)[number]]!.map(({ product, Tamanho }) => {
							if (!product) return null

							const { availability } = useOffer(product.offers)
							const isAvaliable = availability === 'https://schema.org/InStock'
							const isSelected = url === product.url

							const _partial = usePartial({ id, href: product.url! })

							return (
								<>
									<li>
										{partial
											? (
												<button
													{..._partial}
													title={isAvaliable
														? undefined
														: 'Produto indisponível'}
													class={`px-5 py-1 ${
														isSelected
															? 'bg-primary-500 text-white'
															: isAvaliable
															? 'bg-primary-100 text-neutral-0'
															: 'pointer-events-none bg-neutral-4 text-neutral-2'
													}`}
												>
													{Tamanho}
												</button>
											)
											: (
												<a
													href={product.url!}
													title={isAvaliable
														? undefined
														: 'Produto indisponível'}
													class={`px-5 py-1 ${
														isSelected
															? 'bg-primary-500 text-white'
															: isAvaliable
															? 'bg-primary-100 text-neutral-0'
															: 'pointer-events-none bg-neutral-4 text-neutral-2'
													}`}
												>
													{Tamanho}
												</a>
											)}
									</li>
								</>
							)
						})}
					</ul>
				</li>
			))}
		</ul>
	)
}

export default VariantSelector
