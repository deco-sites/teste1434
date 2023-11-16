import Image from 'apps/website/components/Image.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import Button from '$store/components/ui/Button.tsx'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import { formatPrice } from '$store/sdk/format.ts'
import { sendEvent } from '$store/sdk/analytics.tsx'
import { useSignal } from '@preact/signals'
import { useCallback } from 'preact/hooks'
import ProductQuantitySelector from '$store/components/product/ProductQuantitySelector.tsx'
import PureButton from '$store/components/ui/PureButton.tsx'

interface Props {
	index: number
	locale: string
	currency: string
}

function CartItem({ index, locale, currency }: Props) {
	const {
		cart,
		updateItems,
		mapItemsToAnalyticsItems,
	} = useCart()
	const loading = useSignal(false)
	const item = cart.value!.items[index]
	const {
		imageUrl,
		skuName,
		sellingPrice,
		listPrice,
		name,
		quantity,
		price,
	} = item

	const isGift = sellingPrice < 0.01

	const withLoading = useCallback(
		<A,>(cb: (args: A) => void) => async (e: A) => {
			try {
				loading.value = true
				await cb(e)
			} finally {
				loading.value = false
			}
		},
		[loading],
	)

	return (
		<div class='flex flex-row justify-between max-w-[280px] min-[450px]:max-w-none items-start sm:gap-4 font-tt-norms text-neutral-0'>
			<Image
				src={imageUrl}
				alt={skuName}
				width={60}
				height={60}
				class='object-cover object-center'
			/>
			<div class='flex flex-grow flex-col ml-4 mr-2 sm:m-0 gap-2'>
				<span class='line-clamp-2 text-ellipsis'>{name}</span>
				<div class='flex gap-x-5 flex-col-reverse gap-y-3 sm:flex-row'>
					<ProductQuantitySelector
						disabled={loading.value || isGift}
						quantity={quantity}
						variant='minicart'
						onChange={withLoading(async (quantity) => {
							await updateItems({ orderItems: [{ index, quantity }] })
							const quantityDiff = quantity - item.quantity

							if (!cart.value) return

							sendEvent({
								name: quantityDiff < 0 ? 'remove_from_cart' : 'add_to_cart',
								params: {
									items: mapItemsToAnalyticsItems({
										items: [{
											...item,
											quantity: Math.abs(quantityDiff),
										}],
										marketingData: cart.value.marketingData,
									}),
								},
							})
						})}
					/>
					<div class='flex flex-col'>
						{(listPrice ?? 0) > price && (
							<span class='text-sm font-light text-neutral-1 line-through'>
								De: {formatPrice(listPrice / 100, currency, locale)}
							</span>
						)}
						<div class='flex items-center justify-between'>
							<span class='text-lg font-bold text-neutral-0'>
								{(listPrice ?? 0) > price && 'Por: '}
								{formatPrice(price / 100, currency, locale)}
							</span>
						</div>
					</div>
				</div>
			</div>
			<PureButton
				onClick={withLoading(async () => {
					await updateItems({ orderItems: [{ index, quantity: 0 }] })
					if (!cart.value) return
					sendEvent({
						name: 'remove_from_cart',
						params: {
							items: mapItemsToAnalyticsItems({
								items: [item],
								marketingData: cart.value.marketingData,
							}),
						},
					})
				})}
				disabled={loading.value || isGift}
				loading={loading.value}
				class='my-auto grid place-items-center text-sm text-neutral-2 gap-y-2.5'
			>
				<Icon id='Trash' size={24} />
				<span>Excluir</span>
			</PureButton>
		</div>
	)
}

export default CartItem
