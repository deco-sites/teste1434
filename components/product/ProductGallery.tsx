import { Product } from 'apps/commerce/types.ts'

import ProductCard, { Layout as cardLayout } from '$store/components/product/ProductCard.tsx'

export interface Columns {
	mobile?: number
	desktop?: number
}

export interface Props {
	products: Product[] | null
	layout?: cardLayout
	/**
	 * @ignore
	 */
	isMobile: boolean
}

function ProductGallery({ products, layout, isMobile }: Props) {
	return (
		<div class='mx-auto grid place-items-center w-[95%] lg:w-full grid-cols-1 items-center gap-x-2 gap-y-10 min-[620px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6'>
			{products?.map((product, index) => (
				<ProductCard
					product={product}
					preload={index === 0}
					layout={layout}
					isMobile={isMobile}
				/>
			))}
		</div>
	)
}

export default ProductGallery
