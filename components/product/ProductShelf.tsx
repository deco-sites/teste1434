import { SendEventOnLoad } from '$store/components/Analytics.tsx'
import ProductCard from '$store/components/product/ProductCard.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import Slider from '$store/components/ui/Slider.tsx'
import SliderJS from '$store/components/ui/SliderJS.tsx'
import { useId } from '$store/sdk/useId.ts'
import { useOffer } from '$store/sdk/useOffer.ts'
import type { Product } from 'apps/commerce/types.ts'
import { mapProductToAnalyticsItem } from 'apps/commerce/utils/productToAnalyticsItem.ts'

export interface Props {
	products: Product[] | null
	title?: string
	description?: string
	/**
	 * @ignore
	 */
	isMobile: boolean
}

function ProductShelf({ products, title, description, isMobile }: Props) {
	const id = useId()

	if (!products?.length) {
		return null
	}

	return (
		<div class='container flex w-[95%] flex-col items-center gap-10 font-tt-norms text-neutral-0 lg:gap-16 group/shelf'>
			<div class='flex flex-col items-center'>
				<h2 class='text-2xl text-center font-bold font-tt-norms'>
					{title}
				</h2>
				<span class='text-center text-sm font-light text-neutral-1 -translate-y-1 lg:-translate-y-0.5'>
					{description}
				</span>
			</div>

			<div class='relative'>
				<div
					id={id}
					class='container grid grid-cols-[48px_1fr_48px] px-0 pb-10'
				>
					<Slider class='carousel col-span-full row-start-2 row-end-5 gap-x-4'>
						{products?.map((product, index) => (
							<Slider.Item
								index={index}
								class='carousel-item w-[270px] sm:w-[calc(25%-10px)] group pr-4 lg:pr-0'
							>
								<ProductCard
									product={product}
									itemListName={title}
									isMobile={isMobile}
								/>
							</Slider.Item>
						))}
					</Slider>

					<>
						<Slider.PrevButton class='hidden lg:grid absolute left-0 top-[35%] z-10 -translate-y-1/2 place-items-center bg-primary-500 lg:bg-transparent text-black transition-colors lg:group-hover/shelf:bg-white lg:hover:!bg-primary-500 cursor-pointer w-8 h-8 sm:right-[calc(100%+12px)]'>
							<Icon
								size={24}
								id='ChevronRight'
								strokeWidth={3}
								class='rotate-180 text-white lg:text-black lg:hover:text-white'
							/>
						</Slider.PrevButton>

						<Slider.NextButton class='hidden lg:grid absolute right-0 top-[35%] z-10 -translate-y-1/2 place-items-center bg-primary-500 lg:bg-transparent text-black transition-colors lg:group-hover/shelf:bg-white lg:hover:!bg-primary-500 cursor-pointer w-8 h-8'>
							<Icon
								size={24}
								id='ChevronRight'
								class='text-white lg:text-black lg:hover:text-white'
								strokeWidth={3}
							/>
						</Slider.NextButton>

						<div class='absolute lg:-top-12 -bottom-2 left-1/2 -translate-x-1/2 w-full h-fit grid place-items-center'>
							<ul class='carousel z-10 justify-center gap-2 flex-wrap'>
								{products.map((_, i) => (
									<li class='carousel-item'>
										<Slider.Dot index={i}>
											<div
												id={`${id}--${i}`}
												class='h-2 rounded-full border border-black transition-all bg-white w-4 group-disabled:bg-black group-disabled:w-10'
											/>
										</Slider.Dot>
									</li>
								))}
							</ul>
						</div>
					</>
					<SliderJS rootId={id} dotIsPage />
					<SendEventOnLoad
						event={{
							name: 'view_item_list',
							params: {
								item_list_name: title,
								items: products.map((product) =>
									mapProductToAnalyticsItem({
										product,
										...useOffer(product.offers),
									})
								),
							},
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default ProductShelf
