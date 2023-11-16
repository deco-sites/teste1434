import { useSignal } from '@preact/signals'
import { useCallback } from 'preact/hooks'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import { useUI } from '$store/sdk/useUI.ts'
import { sendEvent } from '$store/sdk/analytics.tsx'

export interface Options {
	skuId: string
	sellerId?: string
	price: number
	discount: number
	/**
	 * sku name
	 */
	name: string
	productGroupId: string
}

export const useAddToCart = (
	{ skuId, sellerId, price, discount, name, productGroupId }: Options,
) => {
	const isAddingToCart = useSignal(false)
	const { displayCart } = useUI()
	const { addItems } = useCart()
	const { shelfProducts } = useUI()

	const onClick = useCallback(async (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		const foundShelfProduct = shelfProducts.value.find((shelfProduct) =>
			shelfProduct.skuID === skuId
		)

		if (!sellerId || !foundShelfProduct) {
			return
		}

		const { quantity } = foundShelfProduct

		try {
			isAddingToCart.value = true
			await addItems({
				orderItems: [{ id: skuId, seller: sellerId, quantity }],
			})

			sendEvent({
				name: 'add_to_cart',
				params: {
					items: [{
						item_id: productGroupId,
						quantity,
						price,
						discount,
						item_name: name,
						item_variant: skuId,
					}],
				},
			})

			displayCart.value = true
		} finally {
			isAddingToCart.value = false
		}
	}, [skuId, sellerId])

	return { onClick, loading: isAddingToCart.value }
}
