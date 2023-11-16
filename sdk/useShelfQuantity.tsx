import { JSX } from 'preact'
import { useUI } from '$store/sdk/useUI.ts'
import { useEffect } from 'preact/hooks'
import type { Product } from 'apps/commerce/types.ts'
import type { BuyData } from '$store/sdk/useUI.ts'

type InpuChangeEvent = JSX.TargetedEvent<HTMLInputElement, Event>

type Props = {
	product: Product
}

const MAX_QUANTITY = 999

export function useShelfQuantity({ product }: Props) {
	const { shelfProducts } = useUI()

	const { sku, offers } = product
	const [offer] = offers?.offers ?? [undefined]

	const maxQuantity = Math.min(
		offer?.inventoryLevel?.value ?? MAX_QUANTITY,
		MAX_QUANTITY,
	)

	useEffect(() => {
		shelfProducts.value = [
			...shelfProducts.value,
			{ skuID: sku, quantity: 1, seller: offer?.seller ?? '1' },
		]
	}, [])

	const skuItem = shelfProducts.value.find((skuBuyData) => skuBuyData.skuID === sku)

	if (!skuItem) return {}

	const { quantity } = skuItem

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity < 0) newQuantity = 0
		if (newQuantity > maxQuantity) newQuantity = maxQuantity

		shelfProducts.value = shelfProducts.value.map<BuyData>((skuBuyData) => {
			if (skuBuyData.skuID !== sku) return skuBuyData

			return {
				...skuBuyData,
				quantity: newQuantity,
			}
		})
	}

	const handleDecreaseButton = () =>
		handleQuantityChange(quantity !== 1 ? quantity - 1 : quantity)

	const handleIncreaseButton = () => handleQuantityChange(quantity + 1)

	const handleInputChange = (event: InpuChangeEvent) => {
		const target = event.target as HTMLInputElement
		const { value } = target
		handleQuantityChange(Number(value.replace(/\D/g, '')))
	}

	return {
		handleDecreaseButton,
		handleIncreaseButton,
		handleInputChange,
		quantity,
	}
}
