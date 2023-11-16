import { ProductInfo } from '$store/components/product/ProductDetails.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import type { Product } from 'apps/commerce/types.ts'
import Image from 'apps/website/components/Image.tsx'

export interface Props {
	product: Product
}

export default function Content(
	{ product }: Props,
) {
	return (
		<div class='flex flex-col lg:flex-row gap-x-10 items-center relative justify-center'>
			<Image
				src={product.image![0].url!}
				alt={product.name}
				width={300}
				height={300}
				class='lg:hidden'
			/>
			<Image
				src={product.image![0].url!}
				alt={product.name}
				width={490}
				height={490}
				class='hidden lg:block'
			/>

			<div class='flex flex-col gap-y-10'>
				<div class='light-scroll overflow-y-scroll lg:max-h-[380px] pr-3'>
					<ProductInfo
						product={product}
						hide={{
							installments: true,
							ratings: true,
							productQuantityCartAndShipping: true,
						}}
						partial={false}
					/>
				</div>
				<div class='min-h-[84px]'>
					<div class='flex justify-between items-center mb-1'>
						<div class='flex items-center gap-x-2 text-sm font-light text-neutral-0'>
							<Icon id='ShippingCart' width={22} height={13} />
							<span>Consulte o frete e prazo de entrega</span>
						</div>

						<span class='flex items-center gap-x-2 text-xs font-light text-neutral-2 whitespace-nowrap'>
							<Icon
								id='Padlock'
								width={8}
								height={11}
								class='shrink-0 -translate-y-0.5'
							/>
							Compra 100% segura
						</span>
					</div>
					<a
						href={product.url}
						aria-label='view product'
						class='
                        grid h-11 w-full place-items-center rounded border border-client-primary bg-white
                        font-bold text-client-primary transition-colors duration-300
                        hover:bg-client-primary-dark hover:text-white mb-4
                    '
					>
						Veja mais detalhes
					</a>
				</div>
			</div>
		</div>
	)
}
