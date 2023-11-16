import Icon from '$store/components/ui/Icon.tsx'
import { invoke } from '$store/runtime.ts'
import v from '$store/sdk/v.ts'
import { useSignal } from '@preact/signals'
import type { JSX } from 'preact'

export type Props = {
	title?: string
}

const validateEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		)
}

export default function NewsletterFooter({ title }: Props) {
	const loading = useSignal(false)
	const createdAccount = useSignal(false)
	const message = useSignal('')

	const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const vv = v<string>(
			(i) => !i && 'Insira um EMAIL',
			(i) => !validateEmail(i) && 'O e-mail inserido está escrito de forma incorreta.',
		)

		try {
			loading.value = true

			const email = (e.currentTarget.elements.namedItem('email') as RadioNodeList)?.value
			const err = vv(email)

			if (err) {
				message.value = err
				const cepInput = document.querySelector('#newsletter-email')! as HTMLInputElement

				cepInput.style.animation = 'shake-hard 200ms ease-in-out'

				setTimeout(() => {
					cepInput.style.removeProperty('animation')
				}, 300)

				return
			}

			await invoke.vtex.actions.newsletter.subscribe({ email })

			message.value = 'Inscrição enviada com sucesso :)'
			createdAccount.value = true
		} catch {
			message.value = 'Ocorreu um erro ao tentar se inscrever.'
		} finally {
			loading.value = false
		}
	}

	return (
		<div class='flex flex-col items-center gap-5 lg:px-5 w-full'>
			<p class='text-[#828282] text-2xl font-tt-norms font-bold text-center'>
				{title ?? 'Inscreva-se na nossa newsletter para receber novidades'}
			</p>
			<div class='relative w-full max-w-[418px] lg:max-w-xl'>
				<form
					class='flex flex-col lg:flex-row gap-6 lg:gap-0 w-full justify-center items-center'
					novalidate
					onSubmit={handleSubmit}
				>
					<div class='w-full h-12 max-h-12 relative'>
						<label htmlFor='newsletter-email' class='sr-only'>
							{title ??
								'Inscreva-se na nossa newsletter para receber novidades'}
						</label>
						<input
							id='newsletter-email'
							type='email'
							name='email'
							placeholder='Exemplo: seuemail@seuemail.com.br'
							class='w-full h-full px-5 text-xs font-tt-norms outline-none'
							onInput={() => message.value = ''}
						/>
						{message.value && (!createdAccount.value
							? (
								<Icon
									id='InputError'
									size={24}
									class='absolute top-1/2 -translate-y-1/2 right-5'
								/>
							)
							: (
								<Icon
									id='InputSuccess'
									size={24}
									class='absolute top-1/2 -translate-y-1/2 right-5'
								/>
							))}
					</div>
					<button class='w-full lg:w-max h-12 max-h-12 text-base bg-primary-200 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors px-12 font-bold font-tt-norms rounded-[5px] lg:rounded-none lg:rounded-r-[5px] whitespace-nowrap'>
						Inscreva-se
					</button>
				</form>
				<span class='text-xs text-white absolute left-0 top-[calc(100%+4px)] font-bold'>
					{message.value}
				</span>
			</div>
		</div>
	)
}
