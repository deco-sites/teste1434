import { Product, UnitPriceSpecification } from 'apps/commerce/types.ts'
import { useOffer } from '$store/sdk/useOffer.ts'
import { formatPrice } from '$store/sdk/format.ts'
import Collapsable from '$store/components/ui/Collapsable.tsx'
import Icon from '$store/components/ui/Icon.tsx'

type Props = {
	product: Product
}

export default function Installments({ product }: Props) {
	const { offers } = product
	const { price = 0, pureInstallments } = useOffer(offers)

	const { billingDuration, billingIncrement } = pureInstallments!

	const priceSpecifications = offers?.offers[0].priceSpecification ?? []

	let n = Math.min(
		...(priceSpecifications.map((curr) => curr.billingDuration).filter(Boolean) as number[]),
	)

	const installmentsWithBillingDuration = priceSpecifications.reduce((acc, curr) => {
		if (curr.billingDuration === n) {
			acc.push(curr)
			n += 1
		}

		return acc
	}, [] as UnitPriceSpecification[])

	const billing = installmentsWithBillingDuration.find((i) => !!i.billingDuration)

	const parcelamentos = billing
		? [
			`à vista ${formatPrice(price)}`,
			...Array(billing.billingDuration).fill(0).map((_, index) => {
				return {
					billingDuration: index + 1,
					billingIncrement: billing.billingIncrement,
					price: billing.price,
				}
			}),
		]
		: []

	if (parcelamentos.length === 0) {
		return null
	}

	return (
		<div class='flex items-center justify-between'>
			<span class='text-center lg:text-left'>
				ou <span class='font-bold'>{billingDuration}x</span> de{' '}
				<span class='font-bold'>
					{formatPrice(billingIncrement)}
				</span>
			</span>

			<Collapsable
				title={
					<div class='
                        pdp-dropdown flex w-full select-none items-center justify-between gap-x-4 py-1 text-sm font-bold text-primary-400 transition-colors group-open:text-primary-500
                    '>
						<span>Opções de parcelamento</span>
						<Icon
							id='ParcelamentoArrow'
							width={11}
							height={5}
							class='transition group-open:rotate-180'
						/>
					</div>
				}
				class='relative isolate transition-all px-2 marker:content-[""] z-10 w-[220px]'
				contentClass='
        absolute left-1/2 top-0 -z-10 w-[calc(100%-14px)] w-full -translate-x-1/2 rounded-2xl border-[#707070]/20 px-3 pb-3 pt-8
        peer-open:pointer-events-auto peer-open:border peer-open:bg-white
    '
			>
				<div class='content flex flex-col gap-y-1 text-xs text-neutral-0'>
					{parcelamentos.map((parcelamento) => {
						if (typeof parcelamento === 'string') {
							return (
								<div class='flex items-center justify-between'>
									<span>
										à vista{' '}
										<span class='text-primary-400'>
											{formatPrice(price)}
										</span>
									</span>
									<span class='font-bold'>Total: {formatPrice(price)}</span>
								</div>
							)
						}

						return (
							<div class='flex items-center justify-between'>
								<span>
									{parcelamento.billingDuration}x de{' '}
									<span class='text-primary-400'>
										{formatPrice(parcelamento.billingIncrement)}
									</span>
								</span>
								<span class='font-bold'>
									Total: {formatPrice(parcelamento.price)}
								</span>
							</div>
						)
					})}
				</div>
			</Collapsable>
		</div>
	)
}
