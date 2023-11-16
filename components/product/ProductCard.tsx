import { SendEventOnClick } from '$store/components/Analytics.tsx'
import Avatar from '$store/components/ui/Avatar.tsx'
import WishlistButton from '$store/islands/WishlistButton.tsx'
import calcOFF from '$store/sdk/calcOFF.ts'
import { formatPrice } from '$store/sdk/format.ts'
import { useOffer } from '$store/sdk/useOffer.ts'
import { useVariantPossibilities } from '$store/sdk/useVariantPossiblities.ts'
import type { Product } from 'apps/commerce/types.ts'
import { mapProductToAnalyticsItem } from 'apps/commerce/utils/productToAnalyticsItem.ts'
import Image from 'apps/website/components/Image.tsx'
import ProductCardModal from './ProductCardModal/ProductCardModal.tsx'
import QuantitySelectorAndAddToCartButton from '$store/components/product/ProductQuantityCartAndShipping.tsx'
import { pick } from '$store/sdk/pick.ts'
import { Suspense } from 'preact/compat'

export interface Layout {
	basics?: {
		contentAlignment?: 'Left' | 'Center'
		oldPriceSize?: 'Small' | 'Normal'
		ctaText?: string
	}
	elementsPositions?: {
		skuSelector?: 'Top' | 'Bottom'
		favoriteIcon?: 'Top right' | 'Top left'
	}
	hide?: {
		productName?: boolean
		productDescription?: boolean
		allPrices?: boolean
		installments?: boolean
		skuSelector?: boolean
		cta?: boolean
	}
	onMouseOver?: {
		image?: 'Change image' | 'Zoom image'
		card?: 'None' | 'Move up'
		showFavoriteIcon?: boolean
		showSkuSelector?: boolean
		showCardShadow?: boolean
		showCta?: boolean
	}
}

interface Props {
	product: Product
	/** Preload card image */
	preload?: boolean

	/** @description used for analytics event */
	itemListName?: string
	layout?: Layout
	/**
	 * @ignore
	 */
	isMobile: boolean
}

const relative = (url: string) => {
	const link = new URL(url)
	return `${link.pathname}${link.search}`
}

const WIDTH = 292
const HEIGHT = 292

function ProductCard(
	{ product, preload, itemListName, layout, isMobile }: Props,
) {
	const { url, productID, name, image: images, offers } = product
	const id = `product-card-${productID}`
	const [front, back] = images ?? []
	const { listPrice = 0, price = 0, availability, hasInstallments, pureInstallments } = useOffer(
		offers,
	)

	const { billingDuration, billingIncrement } = pureInstallments ?? {}
	const possibilities = useVariantPossibilities(product)
	const variants = Object.entries(Object.values(possibilities)[0] ?? {})
	const isAvaliable = availability === 'https://schema.org/InStock'

	const seals = [
		{
			label: product.isVariantOf?.additionalProperty.find((p) => p.name === 'Selo 1 Esquerda')
				?.value,
			color: '#CD3D82',
		},
		{
			label: product.isVariantOf?.additionalProperty.find((p) => p.name === 'Selo 2 Direita')
				?.value,
			color: '#830E4F',
		},
	].filter((s) => s.label)

	const l = layout
	const align = !l?.basics?.contentAlignment || l?.basics?.contentAlignment == 'Left'
		? 'left'
		: 'center'
	const skuSelector = variants.map(([value, [link]]) => (
		<li>
			<a href={link}>
				<Avatar variant={link === url ? 'active' : 'default'} content={value} />
			</a>
		</li>
	))
	const cta = (
		<div class='
            flex w-full flex-col items-center gap-y-3
        '>
			{isAvaliable
				? Object.keys(variants).length > 1
					? (
						<a
							href={url && relative(url)}
							aria-label='view product'
							class='
                    grid h-12 w-full place-items-center rounded border border-client-primary bg-white
                    font-bold text-client-primary transition-colors duration-300
                    hover:bg-client-primary-dark hover:text-white
                '
						>
							Comprar
						</a>
					)
					: (
						<QuantitySelectorAndAddToCartButton
							{...pick(product, 'productID', 'offers', 'name', 'isVariantOf', 'sku')}
							variant='productCard'
							isMobile={isMobile}
						/>
					)
				: (
					<a
						href={url && relative(url)}
						aria-label='view product'
						class='
                    grid h-12 w-full place-items-center rounded border bg-client-primary
                    font-bold text-white transition-colors duration-300
                    hover:bg-client-primary-dark
                '
					>
						Avise-me quando chegar
					</a>
				)}
			{!isMobile && (
				<div
					/* class='group-hover:pointer-events-auto lg:pointer-events-none group-hover:opacity-100 lg:opacity-0 transition-opacity' */
				>
					<ProductCardModal product={product} />
				</div>
			)}
		</div>
	)

	return (
		<div
			id={id}
			class={`group group-[&:not([data-intersection])]:opacity-50 w-full max-w-[292px] shrink-0 transition-opacity card card-compact ${
				align === 'center' ? 'text-center' : 'text-start'
			} ${l?.onMouseOver?.showCardShadow ? 'lg:hover:card-bordered' : ''}
        ${
				l?.onMouseOver?.card === 'Move up'
					? 'transition-translate duration-500 ease-in-out lg:hover:-translate-y-2'
					: ''
			}
      `}
			data-deco='view-product'
		>
			<SendEventOnClick
				id={id}
				event={{
					name: 'select_item' as const,
					params: {
						item_list_name: itemListName,
						items: [
							mapProductToAnalyticsItem({
								product,
								price,
								listPrice,
							}),
						],
					},
				}}
			/>
			<figure class='relative'>
				{/* OFF */}
				{listPrice && price && listPrice > price && (
					<span class='absolute left-2 top-5 z-10 w-12 rounded bg-client-primary py-1 text-center text-sm font-bold text-white lg:w-16'>
						-{calcOFF(listPrice, price).toFixed(0)}%
					</span>
				)}

				{/* Wishlist button */}
				<div class='absolute right-2 top-3 z-10 grid place-items-center'>
					<WishlistButton product={product} variant='product' />
				</div>

				<div class='w-full'>
					{/* Product Images */}
					<a
						href={url && relative(url!)}
						aria-label='view product'
						class='relative grid w-full grid-cols-1 grid-rows-1'
					>
						<Image
							src={front.url!}
							alt={front.alternateName}
							width={WIDTH}
							height={HEIGHT}
							class='col-span-full row-span-full w-full rounded bg-base-100'
							sizes='(max-width: 640px) 50vw, 20vw'
							preload={preload}
							loading={preload ? 'eager' : 'lazy'}
							decoding='async'
						/>

						<Image
							src={back?.url ?? front.url!}
							alt={back?.alternateName ?? front.alternateName}
							width={WIDTH}
							height={HEIGHT}
							class='absolute left-0 top-0 z-[1] col-span-full row-span-full w-full rounded bg-base-100 opacity-0 transition-opacity group-hover:opacity-100'
							sizes='(max-width: 640px) 50vw, 20vw'
							loading='lazy'
							decoding='async'
						/>
					</a>
					{/* Seals */}
					<div class='flex w-full h-[32px]'>
						{isAvaliable && seals.map((seal) => (
							<div
								class='grid h-full w-full place-items-center text-center text-sm font-bold text-white'
								style={{ background: seal.color }}
							>
								{seal.label}
							</div>
						))}
					</div>
				</div>

				<figcaption
					class={`
          absolute bottom-1 left-0 flex w-full flex-col gap-3 p-2 ${
						l?.onMouseOver?.showSkuSelector || l?.onMouseOver?.showCta
							? 'lg:opacity-0 transition-opacity lg:group-hover:opacity-100'
							: 'lg:hidden'
					}`}
				>
					{/* SKU Selector */}
					{l?.onMouseOver?.showSkuSelector && (
						<ul class='flex w-full items-center justify-center gap-2'>
							{skuSelector}
						</ul>
					)}
					{l?.onMouseOver?.showCta && cta}
				</figcaption>
			</figure>
			{/* Prices & Name */}
			<div class='flex flex-auto flex-col gap-3 p-2 lg:gap-4'>
				{/* SKU Selector */}
				{
					/* {(!l?.elementsPositions?.skuSelector ||
					l?.elementsPositions?.skuSelector === 'Top') && (
					<>
						{l?.hide?.skuSelector
							? (
								''
							)
							: (
								<ul
									class={`flex w-full items-center gap-2 overflow-auto p-3 ${
										align === 'center' ? 'justify-center' : 'justify-start'
									} ${l?.onMouseOver?.showSkuSelector ? 'lg:hidden' : ''}`}
								>
									{skuSelector}
								</ul>
							)}
					</>
				)} */
				}

				{l?.hide?.productName && l?.hide?.productDescription
					? (
						''
					)
					: (
						<div class='flex flex-col gap-0'>
							{l?.hide?.productName
								? (
									''
								)
								: (
									<a href={product.url}>
										<h2 class='text-light line-clamp-3 h-[70px] text-ellipsis text-center text-neutral-0 lg:text-left'>
											{name}
										</h2>
									</a>
								)}

							{
								/* {l?.hide?.productDescription
								? (
									''
								)
								: (
									<p class='truncate text-sm text-neutral lg:text-sm'>
										{product.description}
									</p>
								)} */
							}
						</div>
					)}
				{l?.hide?.allPrices
					? (
						''
					)
					: (
						<div class='flex flex-col gap-2'>
							<div class='flex flex-col items-center gap-x-5 lg:flex-row'>
								{listPrice && price && listPrice > price && (
									<div
										class={`text-light text-sm text-_neutral-300 line-through ${
											l?.basics?.oldPriceSize === 'Normal' ? 'lg:text-xl' : ''
										}`}
									>
										De: {formatPrice(listPrice, offers!.priceCurrency!)}
									</div>
								)}
								<div class='font-bold text-neutral-0'>
									{isAvaliable
										? (
											<>
												{listPrice && price && listPrice > price
													? 'Por: '
													: ''}
												{formatPrice(price, offers!.priceCurrency!)}
											</>
										)
										: <div class='h-14'>Produto Indisponível</div>}
								</div>
							</div>
							{!l?.hide?.installments && isAvaliable && hasInstallments && (
								<span class='text-center lg:text-left'>
									ou <span class='font-bold'>{billingDuration}x</span> de{' '}
									<span class='font-bold'>{formatPrice(billingIncrement)}</span>
								</span>
							)}
							{
								/* {l?.hide?.installments
								? (
									''
								)
								: (
									<div class='text-sm text-base-300 lg:text-base'>
										ou {installments}
									</div>
								)} */
							}
						</div>
					)}

				{/* SKU Selector */}
				{
					/* {l?.elementsPositions?.skuSelector === 'Bottom' && (
					<>
						{l?.hide?.skuSelector
							? (
								''
							)
							: (
								<ul
									class={`flex w-full items-center gap-2 ${
										align === 'center' ? 'justify-center' : 'justify-start'
									} ${l?.onMouseOver?.showSkuSelector ? 'lg:hidden' : ''}`}
								>
									{skuSelector}
								</ul>
							)}
					</>
				)} */
				}

				{!l?.hide?.cta
					? (
						<div
							class={`flex flex-auto items-end ${
								l?.onMouseOver?.showCta ? 'lg:hidden' : ''
							}`}
						>
							{cta}
						</div>
					)
					: (
						''
					)}
			</div>
		</div>
	)
}

export default ProductCard
