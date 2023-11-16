import Icon from '$store/components/ui/Icon.tsx'
import NextButtonJS from '$store/components/ui/NextButtonJS.tsx'
import PrevButtonJS from '$store/components/ui/PrevButtonJS.tsx'
import Slider from '$store/components/ui/Slider.tsx'
import SliderJS from '$store/components/ui/SliderJS.tsx'
import { formatPrice } from '$store/sdk/format.ts'
import { useId } from '$store/sdk/useId.ts'
import { useOffer } from '$store/sdk/useOffer.ts'
import { useUI } from '$store/sdk/useUI.ts'
import { Product, ProductDetailsPage } from 'apps/commerce/types.ts'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import Image from 'apps/website/components/Image.tsx'
import type { LoaderReturnType } from 'deco/types.ts'
import { useEffect, useState } from 'preact/hooks'

export interface Props {
	page: ProductDetailsPage | null
	title: string
	products: LoaderReturnType<Product[] | null>
}

function ProductBuyTogether({ title, products, page }: Props) {
	let extraProducts = products!
	const productPage = page!.product

	if (!extraProducts || extraProducts.length === 0) return null
	if (extraProducts.length === 1 && extraProducts[0].url === productPage.url) return null

	const id = useId()
	const rootId = useId()
	const { addItems } = useCart()

	extraProducts = extraProducts
		.filter((i) => {
			const { availability } = useOffer(i.offers)
			const isAvailable = availability === 'https://schema.org/InStock'

			return isAvailable
		})
		.filter((i) => {
			return i.productID !== page!.product.productID
		})

	const { price: mainProductPrice = 0, seller: mainProductSeller = '1' } = useOffer(
		productPage.offers,
	)
	const [secondProductPrice, setSecondProductPrice] = useState(0)

	const [index, setIndex] = useState(0)
	const [actualProduct, setActualProduct] = useState<Product>(extraProducts[0])

	useEffect(() => {
		setActualProduct(extraProducts[index])
	}, [index])

	useEffect(() => {
		const { price = 0 } = useOffer(actualProduct.offers)

		setSecondProductPrice(price)
	}, [actualProduct])

	// product page

	const { name } = productPage

	return (
		<div id={id} class='mx-auto w-full max-w-[1220px] font-tt-norms'>
			<h2 class='block w-full py-8 text-neutral-0 sm:py-9 xl:text-left text-2xl text-center font-bold font-tt-norms'>
				{title}
			</h2>

			<div class='flex flex-col items-center justify-between lg:flex-row gap-y-5'>
				<a href={productPage.url} class='relative w-[292px] lg:translate-y-8'>
					<div class='flex flex-col gap-y-2'>
						<Image
							src={productPage.image![0].url!}
							alt={productPage.name}
							width={292}
							height={292}
						/>
						<span class='font-light text-neutral-0'>{name}</span>
					</div>
				</a>

				<button class='font-futura grid place-items-center text-3xl font-bold lg:h-[298px]'>
					<Icon id='BuyTogetherPlus' class='w-14 lg:w-10 lg:h-10 h-14' />
				</button>

				<div class='relative'>
					<div id={rootId}>
						<Slider class='carousel-center carousel max-w-[292px]'>
							{extraProducts?.map((product, index) => {
								const p = product.sku === actualProduct.sku
									? actualProduct
									: product

								return (
									<Slider.Item
										index={index}
										class='carousel-item relative h-full w-full'
									>
										<a href={p.url} class='flex flex-col gap-y-2'>
											<Image
												src={p.image![0].url!}
												alt={p.name}
												width={292}
												height={292}
											/>
										</a>
									</Slider.Item>
								)
							})}
						</Slider>

						<a
							href={actualProduct.url}
							class='absolute left-1/2 top-[calc(100%+8px)] block w-full -translate-x-1/2 font-light text-neutral-0'
						>
							{actualProduct?.name ?? ''}
						</a>

						{extraProducts.length > 1 && (
							<>
								<PrevButtonJS
									class='btn-circle no-animation absolute right-[90%] top-1/2 grid -translate-y-1/2 place-items-center sm:right-[calc(100%+12px)]'
									onClick={() => {
										setIndex(
											(index + extraProducts!.length - 1) %
												extraProducts!.length,
										)
									}}
								>
									<Icon
										size={12}
										id='ChevronDown'
										strokeWidth={3}
										class='rotate-90'
									/>
								</PrevButtonJS>

								<NextButtonJS
									class='btn-circle no-animation absolute left-[90%] top-1/2 grid -translate-y-1/2 place-items-center sm:left-[calc(100%+12px)]'
									onClick={() => {
										setIndex((index + 1) % extraProducts!.length)
									}}
								>
									<Icon
										size={12}
										id='ChevronDown'
										strokeWidth={3}
										class='-rotate-90'
									/>
								</NextButtonJS>
							</>
						)}
					</div>
					<SliderJS rootId={rootId} />
				</div>

				<span class='font-futura mt-16 grid place-items-center text-3xl font-bold lg:mt-0 lg:h-[298px]'>
					<Icon id='BuyTogetherEq' class='w-14 lg:w-10 lg:h-10 h-14' />
				</span>
				<div class='
                    relative top-[10%] flex h-[292px] w-[292px] flex-col
                    items-center justify-between rounded-lg px-5
                    py-10 text-primary-500 md:col-start-7 bg-neutral-4 border border-primary-200
                '>
					<div class='flex flex-col items-center gap-y-1'>
						<strong class='text-2xl font-extrabold'>Compre o kit</strong>
						<span>por apenas</span>
					</div>
					<span class='text-2xl font-extrabold'>
						{formatPrice(mainProductPrice + secondProductPrice)}
					</span>

					<button
						type='button'
						class='group h-11 w-full rounded border border-none bg-success hover:bg-success-dark transition-colors font-bold text-white'
						onClick={() => {
							addItems({
								orderItems: [
									{
										id: productPage.productID,
										quantity: 1,
										seller: mainProductSeller!,
									},
									{
										id: actualProduct.productID,
										quantity: 1,
										seller: useOffer(actualProduct.offers).seller ?? '1',
									},
								],
							})

							setTimeout(() => {
								useUI().displayCart.value = true
							}, 1000)
						}}
					>
						Comprar
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProductBuyTogether
