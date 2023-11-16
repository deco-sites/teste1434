/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */

import { IS_BROWSER } from '$fresh/runtime.ts'
import Icon from '$store/components/ui/Icon.tsx'
import PureButton from '$store/components/ui/PureButton.tsx'
import { sendEvent } from '$store/sdk/analytics.tsx'
import { useSpeechRecognition } from '$store/sdk/speechRecognition.tsx'
import { useId } from '$store/sdk/useId.ts'
import { computed, effect } from '@preact/signals'
import { useAutocomplete } from 'apps/vtex/hooks/useAutocomplete.ts'
import Image from 'apps/website/components/Image.tsx'
import { capitalize } from '$store/sdk/capitalize.ts'
import { useRef } from 'preact/compat'
import clsx from '$store/sdk/clsx.ts'

// Editable props
export interface Props {
	/**
	 * @title Placeholder
	 * @description Search bar default placeholder message
	 * @default What are you looking for?
	 */
	placeholder?: string
	/**
	 * @title Page path
	 * @description When user clicks on the search button, navigate it to
	 * @default /s
	 */
	action?: string
	/**
	 * @title Term name
	 * @description Querystring param used when navigating the user
	 * @default q
	 */
	name?: string
	/**
	 * TODO: Receive querystring from parameter in the server-side
	 */
	query?: string
}

function Searchbar({
	placeholder = 'What are you looking for?',
	action = '/s',
	name = 'q',
	query,
}: Props) {
	const id = useId()
	const searchInputRef = useRef<HTMLInputElement>(null)
	const { setSearch, suggestions, loading } = useAutocomplete()
	const { products = [], searches = [] } = suggestions.value ?? {}
	const hasProducts = Boolean(products.length)
	const hasTerms = Boolean(searches.length)
	const notFound = !hasProducts && !hasTerms

	const speech = useSpeechRecognition({
		onSpeech: () => {
			const m = document.querySelectorAll('.microphone') as NodeListOf<HTMLInputElement>

			m.forEach((i) => {
				i.value = speech.detectedText.value
			})
		},
		onError: (e) => speech.isListening.value = false,
	})

	effect(() => {
		if (!IS_BROWSER) return

		document.querySelectorAll('.microphone-icon').forEach((i) => {
			if (speech.isListening.value) {
				i.classList.add('text-red-500')
			} else {
				i.classList.remove('text-red-500')
			}
		})
	})

	const terms = computed(() =>
		new Set(products.filter((i) => i.category).map((i) => i.category!.split('>')[0]))
	)

	return (
		<div
			class='flex flex-col w-[420px] gap-8 overflow-y-hidden px-2 py-3 bg-white rounded-md z-50 absolute top-4 right-0 cursor-auto'
			style={{ fontVariantLigatures: 'no-common-ligatures' }}
			onClick={(e) => e.stopPropagation()}
		>
			<form
				id={id}
				action={action}
				class='w-full h-14 rounded-full border border-neutral-400 flex items-center'
			>
				<PureButton
					type='button'
					class={clsx(
						'grid place-items-center mx-3 relative w-6 h-6',
						!speech.supported && 'pointer-events-none opacity-0',
					)}
					tabIndex={-1}
					onClick={() => {
						speech.start()
					}}
				>
					<Icon
						id='Microphone'
						size={24}
						strokeWidth={0.01}
						class='microphone-icon text-neutral-2'
					/>
					<span class='sr-only'>Procurar por voz</span>
				</PureButton>

				<input
					ref={searchInputRef}
					class='microphone outline-none font-bold w-full h-full text-neutral-0 mr-3'
					name={name}
					defaultValue={query}
					onInput={(e) => {
						const value = e.currentTarget.value

						if (value) {
							sendEvent({
								name: 'search',
								params: { search_term: value },
							})
						}

						setSearch(value)
					}}
					placeholder={placeholder}
					autocomplete='off'
				/>
				<PureButton
					type='submit'
					class='bg-primary-500 ml-auto h-full px-5 rounded-full flex items-center justify-center gap-x-2 text-white transition-all'
					aria-label='Search'
					for={id}
					tabIndex={-1}
				>
					{loading.value ? <span class='loading loading-spinner loading-xs' /> : (
						<>
							<Icon id='MagnifyingGlass' size={24} strokeWidth={0.01} />
							<span>Buscar</span>
						</>
					)}
				</PureButton>
			</form>

			{notFound
				? (
					<div class='flex w-full flex-col gap-4'>
						<span
							class='text-center text-xl font-medium text-primary-500'
							role='heading'
							aria-level={3}
						>
							Nenhum resultado encontrado
						</span>
						<span class='text-center text-base-300'>
							Vamos tentar de outro jeito? Verifique a ortografia ou use um termo
							diferente
						</span>
					</div>
				)
				: (
					<>
						{terms.value.size && searchInputRef.current && (
							<ul>
								{[...terms.value].map((term) => (
									<li class='text-neutral-0 text-left px-4 text-sm'>
										{searchInputRef.current!.value} em{' '}
										<span class='font-bold'>
											{capitalize(term)}
										</span>
									</li>
								))}
							</ul>
						)}
						<div class={hasTerms ? 'flex flex-col gap-6' : 'hidden'}>
							<span class='text-xl font-medium' role='heading' aria-level={3}>
								Sugestões
							</span>
							<ul id='search-suggestion' class='flex flex-col gap-6'>
								{searches.map(({ term }) => (
									<li>
										<a
											href={`/s?q=${term}`}
											class='flex items-center gap-4'
										>
											<span>
												<Icon
													id='MagnifyingGlass'
													size={24}
													strokeWidth={0.01}
												/>
											</span>
											<span>{term}</span>
										</a>
									</li>
								))}
							</ul>
						</div>
						<div
							class={hasProducts ? 'flex flex-col gap-6 pt-6 md:pt-0 px-4' : 'hidden'}
						>
							<ul class='light-scroll flex flex-col gap-y-1 h-[160px] overflow-y-scroll'>
								{products.map((product) => (
									<li>
										<a href={product.url!} class='flex items-center gap-x-3'>
											<Image
												src={product.image![0].url!}
												alt={product.name}
												width={50}
												height={50}
											/>
											<span class='text-sm text-neutral-0 text-left'>
												{product.name}
											</span>
										</a>
									</li>
								))}
							</ul>
						</div>
					</>
				)}
		</div>
	)
}

export default Searchbar
