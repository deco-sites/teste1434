import OutOfStock from '$store/components/product/OutOfStock.tsx'
import ProductQuantitySelector from '$store/components/product/ProductQuantitySelector.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import ShippingSimulation from '$store/components/ui/ShippingSimulation.tsx'
import AddToCartButtonVTEX from '$store/islands/AddToCartButton/vtex.tsx'
import { useOffer } from '$store/sdk/useOffer.ts'
import { useSignal } from '@preact/signals'
import { Product } from 'apps/commerce/types.ts'
import clsx from '$store/sdk/clsx.ts'

type Props = Pick<Product, 'productID' | 'offers' | 'name' | 'isVariantOf' | 'sku'> & {
	variant?: 'productCard'
	isMobile?: boolean
}

export default function ProductQuantityCartAndShipping(
	{ productID, offers, name = '', isVariantOf, sku, variant, isMobile }: Props,
) {
	const quantity = useSignal(1)

	const { availability, price = 0, listPrice, seller = '1' } = useOffer(offers)
	const isAvailable = availability === 'https://schema.org/InStock'

	const productGroupID = isVariantOf?.productGroupID ?? ''
	const discount = price && listPrice ? listPrice - price : 0

	return (
		<>
			<div
				class={clsx(
					'isolate flex flex-col justify-between gap-x-3 gap-y-5 min-[500px]:flex-row lg:gap-y-0',
					variant && variant !== 'productCard' && 'pb-11 border-b border-[#C8C8C8] mt-4',
					variant && variant === 'productCard' && 'w-full',
				)}
			>
				{isAvailable
					? (
						<div class='flex sm:items-center items-end gap-x-2 w-full'>
							<div class='flex flex-col sm:flex-row gap-x-5 gap-y-2'>
								{!(variant && variant === 'productCard') && (
									<span class='sm:h-11 place-items-center text-sm font-light sm:leading-[1.3] text-neutral-0 grid whitespace-nowrap sm:whitespace-normal'>
										Selecione a<br class='hidden sm:block' />
										quantidade:
									</span>
								)}
								{!isMobile && (
									<ProductQuantitySelector
										quantity={quantity.value}
										onChange={(q) => {
											quantity.value = q
										}}
									/>
								)}
							</div>
							<div class='relative h-full w-full flex sm:items-center items-end lg:justify-end'>
								<AddToCartButtonVTEX
									name={name}
									productID={productID}
									productGroupID={productGroupID}
									price={price}
									discount={discount}
									seller={seller}
									quantity={quantity.value}
									class={clsx(
										variant === 'productCard'
											? 'grid h-12 w-full place-items-center rounded border border-client-primary bg-white font-bold text-client-primary transition-colors duration-300 hover:bg-client-primary-dark hover:text-white'
											: 'h-12 w-full lg:max-w-[260px] rounded border border-none bg-client-primary hover:bg-client-primary-dark transition-colors font-bold text-white',
									)}
								/>
								{!(variant && variant === 'productCard') && (
									<span class='absolute right-0 top-full -z-10 flex translate-y-2 items-center gap-x-2 text-xs font-light text-_neutral-300 whitespace-nowrap'>
										<Icon
											id='Padlock'
											width={8}
											height={11}
											class='shrink-0 -translate-y-0.5'
										/>
										Compra 100% segura
									</span>
								)}
							</div>
						</div>
					)
					: <OutOfStock productID={productID} />}
			</div>
			{/* Shipping Simulation */}
			{isAvailable && !(variant && variant === 'productCard') && (
				<div class='border-b border-[#C8C8C8] py-6 pt-10 sm:pt-6'>
					<ShippingSimulation
						items={[
							{
								id: Number(sku),
								quantity: quantity.value,
								seller: seller,
							},
						]}
					/>
				</div>
			)}
		</>
	)
}
