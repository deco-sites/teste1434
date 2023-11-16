import { useId } from '$store/sdk/useId.ts'
import RenderHTML from '$store/components/ui/RenderHTML.tsx'

const script = (id: string) => {
	const KEY = 'store-cookie-consent'
	const ACCEPTED = 'accepted'
	const HIDDEN = 'translate-y-[200%]'

	const consent = localStorage.getItem(KEY)
	console.log(consent)
	const elem = document.getElementById(id)

	if (consent !== ACCEPTED && elem) {
		const accept = elem.querySelector('[data-button-cc-accept]')
		accept && accept.addEventListener('click', () => {
			localStorage.setItem(KEY, ACCEPTED)
			elem.classList.add(HIDDEN)
			elem.previousElementSibling!.classList.add('hidden')
			document.body.style.removeProperty('overflow')
		})
		const close = elem.querySelector('[data-button-cc-close]')
		close &&
			close.addEventListener('click', () => elem.classList.add(HIDDEN))

		elem.classList.remove(HIDDEN)
		elem.previousElementSibling!.classList.remove('hidden')
		document.body.style.overflow = 'hidden'
	}
}

export interface Props {
	// @format html
	text: string
	buttons?: {
		allowText?: string
	}
}

function CookieConsent({ text, buttons = {} }: Props) {
	const id = useId()

	return (
		<>
			<div class='hidden w-screen h-screen bg-black/50 fixed inset-0 z-[99]' />
			<div
				id={id}
				class='translate-y-[200%] fixed bottom-0 flex flex-col w-full lg:flex-row bg-neutral-1 left-1/2 -translate-x-1/2 gap-5 px-8 justify-center items-center py-4 z-[100] rounded'
			>
				<RenderHTML html={text} class='text-white [&_a]:font-bold' />
				<div class='flex flex-col lg:flex-row gap-2 justify-center items-center'>
					<button
						class='bg-transparent border border-white text-white btn hover:bg-white hover:text-neutral-0 transition-colors w-[160px]'
						data-button-cc-accept
					>
						{buttons.allowText ?? 'Aceitar'}
					</button>
				</div>
				<script
					type='module'
					dangerouslySetInnerHTML={{ __html: `(${script})("${id}");` }}
				/>
			</div>
		</>
	)
}

export default CookieConsent
