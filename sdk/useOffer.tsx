import type { AggregateOffer, UnitPriceSpecification } from 'apps/commerce/types.ts'
import { formatPrice } from '$store/sdk/format.ts'

const bestInstallment = (
	acc: UnitPriceSpecification | null,
	curr: UnitPriceSpecification,
) => {
	if (curr.priceComponentType !== 'https://schema.org/Installment') {
		return acc
	}

	if (!acc) {
		return curr
	}

	if (acc.price > curr.price) {
		return curr
	}

	if (acc.price < curr.price) {
		return acc
	}

	if (
		acc.billingDuration && curr.billingDuration &&
		acc.billingDuration < curr.billingDuration
	) {
		return curr
	}

	return acc
}

const installmentToString = (
	installment: UnitPriceSpecification,
	sellingPrice: number,
) => {
	const { billingDuration, billingIncrement, price } = installment

	if (!billingDuration || !billingIncrement) {
		return ''
	}

	const withTaxes = sellingPrice < price

	return `${billingDuration}x de R$ ${billingIncrement} ${withTaxes ? 'com juros' : 'sem juros'}`
}

const installmentToElement = (
	installment: UnitPriceSpecification,
	sellingPrice: number,
) => {
	const { billingDuration, billingIncrement, price } = installment

	if (!billingDuration || !billingIncrement) {
		return null
	}

	const withTaxes = sellingPrice < price

	const formattedValue = formatPrice(billingIncrement)

	return (
		<div class='text-xs text-gray-500'>
			Ou <span class='font-semibold'>{billingDuration}x</span> de{' '}
			<span class='font-semibold'>{formattedValue}</span>{' '}
			{withTaxes ? 'c/ juros' : 's/ juros'}
		</div>
	)
}

export const useOffer = (aggregateOffer?: AggregateOffer) => {
	const offer = aggregateOffer?.offers[0]
	const listPrice = offer?.priceSpecification.find((spec) =>
		spec.priceType === 'https://schema.org/ListPrice'
	)
	const installment = offer?.priceSpecification.reduce(bestInstallment, null)
	const seller = offer?.seller
	const price = offer?.price
	const availability = offer?.availability
	const paymentMethods = offer?.priceSpecification

	return {
		price,
		listPrice: listPrice?.price,
		availability,
		seller,
		installments: installment && price ? installmentToString(installment, price) : null,
		installmentsElement: installment && price ? installmentToElement(installment, price) : null,
		paymentMethods,
	}
}
