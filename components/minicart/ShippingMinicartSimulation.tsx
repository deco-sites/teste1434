import { Signal, useSignal } from '@preact/signals'
import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks'
import Button from '$store/components/ui/Button.tsx'
import { formatPrice } from '$store/sdk/format.ts'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import type { SimulationOrderForm, Sla } from 'apps/vtex/utils/types.ts'

const formatShippingEstimate = (estimate: string) => {
	const [, time, type] = estimate.split(/(\d+)/)

	if (type === 'bd') return `${time} dias úteis`
	if (type === 'd') return `${time} dias`
	if (type === 'h') return `${time} horas`
}

function ShippingContent({ simulation }: {
	simulation: Signal<SimulationOrderForm | null>
}) {
	const { cart } = useCart()

	const methods = simulation.value?.logisticsInfo?.reduce(
		(initial, { slas }) => [...initial, ...slas],
		[] as Sla[],
	).reduce((slas, sla) => {
		const index = slas.findIndex((item) => item.id === sla.id)

		if (index !== -1) {
			slas[index].price += sla.price
			return slas
		}

		return [...slas, sla]
	}, [] as Sla[]).flat() ?? []

	const locale = cart.value?.clientPreferencesData.locale || 'pt-BR'
	const currencyCode = cart.value?.storePreferencesData.currencyCode || 'BRL'

	if (simulation.value == null) return null

	if (
		!methods.length &&
		simulation.value.messages.find((message) => message.code === 'cannotBeDelivered')
	) {
		return (
			<div class='pt-4 mt-4 border-t border-tw-neutral-100'>
				<span class='text-tw-neutral-500 text-sm'>
					Entrega indisponível para o CEP informado!
				</span>
			</div>
		)
	}

	if (methods.length === 0) {
		return (
			<div class='pt-4 mt-4 border-t border-tw-neutral-100'>
				<span class='text-tw-neutral-500 text-sm'>CEP inválido!</span>
			</div>
		)
	}

	return (
		<ul class='max-h-32 pt-4 mt-4 border-t border-tw-neutral-100 overflow-y-auto grid gap-2 scrollbar'>
			{methods.map((method) => (
				<li
					class={`text-tw-neutral-500 text-sm flex justify-between items-center ${
						methods.length > 4 ? 'mr-2' : ''
					}`}
				>
					<span class='font-bold'>
						Em até {formatShippingEstimate(method.shippingEstimate)}
					</span>
					<span class='text-center'>
						{method.name}
					</span>
					<span class='font-bold text-center'>
						{method.price === 0 ? 'Grátis' : (
							formatPrice(method.price / 100, currencyCode, locale)
						)}
					</span>
				</li>
			))}
		</ul>
	)
}

function ShippingMinicartSimulation() {
	const inputRef = useRef<HTMLInputElement>(null)
	const loading = useSignal(false)
	const simulateResult = useSignal<SimulationOrderForm | null>(null)
	const { simulate, cart } = useCart()

	const items = useMemo(() =>
		cart.value!.items.map((item) => {
			return {
				id: Number(item.id),
				quantity: item.quantity,
				seller: item.seller,
			}
		}), [cart.value?.items])

	const handleSimulation = useCallback(async () => {
		if (inputRef.current?.value.length !== 8) return

		try {
			loading.value = true

			simulateResult.value = await simulate({
				items: items,
				postalCode: inputRef.current.value,
				country: cart.value?.storePreferencesData.countryCode || 'BRA',
			})
		} finally {
			loading.value = false
		}
	}, [items])

	// Recalculates the shipping value
	// every time the array of items changes
	useEffect(() => {
		if (!loading.value && inputRef.current?.value) {
			handleSimulation()
		}
	}, [items])

	// If a postal code is defined in the
	// cookies, use it for the simulation
	useEffect(() => {
		if (!inputRef.current) return
	}, [])

	return (
		<div class='mt-4'>
			<div class='flex justify-between items-center gap-6'>
				<span class='font-semibold text-gray-500 text-sm whitespace-nowrap'>
					Frete:
				</span>

				<form
					class='h-12 flex gap-1'
					onSubmit={(e) => {
						e.preventDefault()
						handleSimulation()
					}}
				>
					<input
						class='w-36 border border-gray-300 h-full px-4 rounded-md outline-none text-sm placeholder:text-gray-400 text-gray-500'
						ref={inputRef}
						type='text'
						placeholder='Digite seu CEP'
						maxLength={8}
					/>

					<Button
						class='h-full w-24 bg-gray-400 text-gray-200 rounded-md duration-200 hover:bg-gray-300 hover:text-gray-500 normal-case font-normal'
						type='submit'
						loading={loading.value}
					>
						Calcular
					</Button>
				</form>
			</div>

			<ShippingContent simulation={simulateResult} />
		</div>
	)
}

export default ShippingMinicartSimulation
