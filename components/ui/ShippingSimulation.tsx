import PureButton from '$store/components/ui/PureButton.tsx'
import { formatPrice } from '$store/sdk/format.ts'
import v from '$store/sdk/v.ts'
import { Signal, useSignal } from '@preact/signals'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import type { SimulationOrderForm, SKU, Sla } from 'apps/vtex/utils/types.ts'
import { useCallback } from 'preact/hooks'
import Icon from '$store/components/ui/Icon.tsx'

export interface Props {
	items: Array<SKU>
}

const formatShippingEstimate = (estimate: string) => {
	const [, time, type] = estimate.split(/(\d+)/)

	if (type === 'bd') return `${time} dias úteis`
	if (type === 'd') return `${time} dias`
	if (type === 'h') return `${time} horas`
}

function ShippingContent({ simulation }: { simulation: Signal<SimulationOrderForm | null> }) {
	const { cart } = useCart()

	const methods = simulation.value?.logisticsInfo?.reduce(
		(initial, { slas }) => [...initial, ...slas],
		[] as Sla[],
	) ?? []

	const locale = cart.value?.clientPreferencesData.locale || 'pt-BR'
	const currencyCode = cart.value?.storePreferencesData.currencyCode || 'BRL'

	if (simulation.value == null) {
		return null
	}

	if (methods.length === 0) {
		return (
			<div class='p-2'>
				<span>CEP inválido</span>
			</div>
		)
	}

	return (
		<table class='w-full'>
			<thead>
				<tr>
					<th>Transportadora</th>
					<th>Valor do frete</th>
					<th>Prazo</th>
				</tr>
			</thead>

			<tbody>
				{methods.map((method) => (
					<tr>
						<td class='text-center align-middle'>{method.name}</td>
						<td class='text-center align-middle'>
							{method.price === 0
								? 'Grátis'
								: formatPrice(method.price / 100, currencyCode, locale)}
						</td>
						<td class='text-center align-middle'>
							{formatShippingEstimate(method.shippingEstimate)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

function ShippingSimulation({ items }: Props) {
	const postalCode = useSignal('')
	const loading = useSignal(false)
	const simulateResult = useSignal<SimulationOrderForm | null>(null)
	const { simulate, cart } = useCart()

	const errorMessage = useSignal('')

	const vv = v<string>(
		(i) => !i && 'Insira um CEP',
		(i) => i.length !== 9 && 'O CEP deve conter 8 dígitos',
	)

	const handleSimulation = useCallback(async () => {
		const err = vv(postalCode.value)

		if (err) {
			errorMessage.value = err
			const cepInput = document.querySelector('.cep-input')! as HTMLElement

			cepInput.style.animation = 'shake-hard 200ms ease-in-out'

			setTimeout(() => {
				cepInput.style.removeProperty('animation')
			}, 300)

			return
		}

		try {
			loading.value = true
			simulateResult.value = await simulate({
				items: items,
				postalCode: postalCode.value,
				country: cart.value?.storePreferencesData.countryCode || 'BRA',
			})
		} finally {
			loading.value = false
		}
	}, [])

	return (
		<div class='flex flex-col gap-2'>
			<div class='flex items-center gap-x-2 text-sm font-light text-neutral-0'>
				<Icon id='ShippingCart' width={22} height={13} />
				<span>Consulte o frete e prazo de entrega</span>
			</div>

			<form
				class='flex items-center gap-x-2 lg:gap-x-5'
				onSubmit={(e) => {
					e.preventDefault()
					handleSimulation()
				}}
			>
				<div class='relative w-full'>
					<div
						class={`pointer-events-none absolute left-1/2 w-full -translate-x-1/2 rounded transition-all ${
							errorMessage.value ? '-top-16 opacity-100' : '-top-14 opacity-0'
						}`}
					>
						<span class='grid h-10 place-items-center bg-[#707070] text-white
                        
                    '>
							{errorMessage.value}
						</span>
						<div class='absolute left-1/2 
                                h-0 w-0
                                -translate-x-1/2 border-l-[10px]
                                border-r-[10px] border-t-[16px]
                                border-l-transparent border-r-transparent border-t-[#707070]
                            '>
						</div>
					</div>

					<input
						type='text'
						class={`
                            cep-input
                            h-11 w-full rounded-lg border bg-transparent px-5 text-sm font-light text-[#707070] outline-none
                            ring-[#707070] ring-offset-2 focus-within:ring-4
                            ${errorMessage.value ? 'border-red-500' : 'border-[#C8C8C8]'}
                        `}
						placeholder='00000-000'
						value={postalCode.value}
						maxLength={9}
						size={9}
						onChange={(e: { currentTarget: { value: string } }) => {
							e.currentTarget.value = e.currentTarget.value
								.replace(/\D/g, '')
								.replace(/^(\d{5})(\d)/, '$1-$2')

							postalCode.value = e.currentTarget.value

							errorMessage.value = ''
						}}
					/>
				</div>
				<PureButton
					type='submit'
					loading={loading.value}
					class='h-11 w-full max-w-[200px] rounded bg-neutral-2 hover:bg-neutral-1 transition-colors font-bold text-white'
				>
					Calcular frete
				</PureButton>
			</form>

			<a
				href='https://buscacepinter.correios.com.br/app/endereco/index.php'
				class='mt-1 flex items-center gap-x-1.5 text-xs font-light text-neutral-0'
			>
				Não sei o meu CEP
				<Icon id='idkCep' width={6} height={11} />
			</a>
			<ShippingContent simulation={simulateResult} />
		</div>
	)
}

export default ShippingSimulation
