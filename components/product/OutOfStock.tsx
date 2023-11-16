import { invoke } from '$store/runtime.ts'
import { useSignal } from '@preact/signals'
import type { Product } from 'apps/commerce/types.ts'
import type { JSX } from 'preact'

export interface Props {
	productID: Product['productID']
}

function Notify({ productID }: Props) {
	const loading = useSignal(false)

	const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		try {
			loading.value = true

			const name = (e.currentTarget.elements.namedItem('name') as RadioNodeList)?.value
			const email = (e.currentTarget.elements.namedItem('email') as RadioNodeList)?.value

			await invoke.vtex.actions.notifyme({ skuId: productID, name, email })
		} finally {
			loading.value = false
		}
	}

	return (
		<form
			class='form-control w-full justify-center gap-2 border-t border-[#C8C8C8] pt-8'
			onSubmit={handleSubmit}
		>
			<strong class='text-center text-lg font-bold text-neutral-0'>Avise-me</strong>
			<span class='text-center text-sm font-light text-neutral-0'>
				Quer ser informado quando esse produto estiver disponível?
				<br />
				Preencha os dados abaixo que nós te avisamos ;)
			</span>

			<label class='mb-4 flex w-full flex-col gap-y-1 text-sm font-light text-neutral-0'>
				Seu nome
				<input
					placeholder='Ex.: Maria do Carmo'
					class='input input-bordered'
					name='name'
					required
				/>
			</label>

			<label class='flex w-full flex-col gap-y-1 text-sm font-light text-neutral-0'>
				Seu E-mail
				<input
					placeholder='Ex.: maria@seuemail.com.br'
					class='input input-bordered'
					name='email'
					required
				/>
			</label>

			<button
				class='btn mt-4 h-11 w-full rounded bg-neutral-2 font-bold text-white transition-colors disabled:loading hover:bg-primary-500 hover:border-none'
				disabled={loading}
			>
				Avise-me quando chegar
			</button>
		</form>
	)
}

export default Notify
