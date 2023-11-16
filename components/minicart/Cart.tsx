import Icon from '$store/components/ui/Icon.tsx'
import { sendEvent } from '$store/sdk/analytics.tsx'
import { formatPrice } from '$store/sdk/format.ts'
import { useUI } from '$store/sdk/useUI.ts'
import PureButton from '$store/components/ui/PureButton.tsx'
import { useCart } from 'apps/vtex/hooks/useCart.ts'
import CartItem from './CartItem.tsx'

function Cart() {
	const { displayCart } = useUI()
	const { cart, loading, mapItemsToAnalyticsItems } = useCart()
	const isCartEmpty = cart.value?.items.length === 0
	const totalizers = cart.value?.totalizers
	const locale = cart.value?.clientPreferencesData.locale
	const currencyCode = cart.value?.storePreferencesData.currencyCode
	const total = totalizers?.find((item) => item.id === 'Items')?.value || 0
	const discounts = totalizers?.find((item) => item.id === 'Discounts')?.value || 0
	const totalItems = cart.value?.items.length!

	if (cart.value === null) {
		return null
	}

	// Empty State
	if (isCartEmpty) {
		return (
			<div class='flex flex-col justify-center items-center h-full text-neutral-0 font-tt-norms'>
				<div class='flex justify-center items-center flex-col max-w-[232px] w-full h-full'>
					<Icon id='BigShoppingCart' width={143} height={136} class='mb-6' />

					<p class='font-bold mb-2 text-center text-lg'>Seu carrinho está vazio :(</p>
					<p class='text-sm text-center'>
						Adicione produtos clicando no botão ‘comprar’ na página de produtos
					</p>
				</div>
				<a
					class='grid h-11 mt-auto w-full place-items-center rounded border bg-neutral-0 text-white font-bold max-w-[465px] mb-5 shrink-0'
					href='/'
				>
					Voltar para a página inicial
				</a>
			</div>
		)
	}

	return (
		<>
			{/* Cart Items */}
			<div class='pr-5 mt-1 px-4 pl-12 sm:pl-4 lg:px-8'>
				<ul
					role='list'
					class='minicart-scroll pr-6 flex-grow overflow-y-auto flex flex-col h-[calc(100vh-330px)] lg:max-h-[360px] text-neutral-0 divide-y divide-neutral-3'
				>
					{cart.value.items.map((_, index) => (
						<li key={index} class='py-4'>
							<CartItem index={index} currency={currencyCode!} locale={locale!} />
						</li>
					))}
				</ul>
			</div>

			{
				/* <div class='px-2 py-4 box-shadow-top'>
				<FreeShippingProgressBar
					total={total / 100}
					target={1000}
					locale={locale!}
					currency={currencyCode!}
				/>
			</div> */
			}

			{/* Cart Footer */}
			<footer class='mx-11 mt-6 h-full max-h-[280px] lg:m-0 flex flex-col justify-center gap-y-5'>
				{/* Subtotal */}
				<div class='lg:px-8 flex flex-col gap-4 font-tt-norms'>
					{
						/* {discounts > 0 && (
						<div class='flex justify-between items-center'>
							<span class='text-sm'>Descontos</span>
							<span class='text-sm'>
								{formatPrice(discounts / 100, currencyCode!, locale)}
							</span>
						</div>
					)} */
					}
					<div class='w-full flex justify-between'>
						<span class='text-sm text-neutral-0'>
							Quantidade de itens:
						</span>
						<span class='text-sm text-neutral-0'>
							{totalItems}
						</span>
					</div>
					<div class='w-full flex justify-between'>
						<span class='text-sm text-neutral-0'>
							<span class='font-bold'>
								Subtotal
							</span>{' '}
							(sem frete)
						</span>
						<span class='text-sm text-neutral-0 font-bold'>
							{total ? formatPrice(total / 100, currencyCode!, locale) : ''}
						</span>
					</div>
					{
						/* <Coupon />
					<ShippingMinicartSimulation /> */
					}
				</div>

				{/* Total */}
				{
					/* <div class='flex flex-col justify-end gap-2 px-4'>
					<div class='flex justify-between items-center w-full text-sm text-gray-600 font-semibold'>
						<span class=''>Total</span>
						<span class=''>
							{formatPrice(total / 100, currencyCode!, locale)}
						</span>
					</div>
					<span class='text-sm text-base-300'>
						Taxas e fretes serão calculados no checkout
					</span>
				</div> */
				}

				<div class='lg:px-8 gap-2 w-full flex flex-col sm:grid sm:grid-cols-2 font-tt-norms'>
					<a
						href='/'
						class='w-full grid place-items-center rounded border border-primary-500 bg-white
                        font-bold text-primary-500 transition-colors duration-300
                        hover:bg-primary-500 hover:text-white h-11'
					>
						Continuar comprando
					</a>

					<a
						class='inline-block w-full'
						href='/checkout'
						area-label='Finalizar compra'
					>
						<PureButton
							data-deco='buy-button'
							class='h-11 rounded border border-none bg-success hover:bg-success-dark transition-colors font-bold text-white w-full'
							disabled={loading.value || cart.value.items.length === 0}
							onClick={() => {
								sendEvent({
									name: 'begin_checkout',
									params: {
										currency: cart.value ? currencyCode! : '',
										value: (total - discounts) / 100,
										coupon: cart.value?.marketingData?.coupon ?? undefined,

										items: cart.value
											? mapItemsToAnalyticsItems(cart.value)
											: [],
									},
								})
							}}
						>
							<span class='text-white font-bold text-base'>
								Ir para o pagamento
							</span>
						</PureButton>
					</a>
				</div>
			</footer>
		</>
	)
}

export default Cart
