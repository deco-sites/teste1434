import { IS_BROWSER } from '$fresh/runtime.ts'
import Searchbar from '$store/components/header/Searchbar.tsx'
import type { Props as SearchbarProps } from '$store/components/search/Searchbar.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import PureButton from '$store/components/ui/PureButton.tsx'
import clsx from '$store/sdk/clsx.ts'
import { useSpeechRecognition } from '$store/sdk/speechRecognition.tsx'
import { useUI } from '$store/sdk/useUI.ts'
import { effect } from '@preact/signals'

type Props = {
	searchbar: SearchbarProps
	isHomePage: boolean
	/**
	 * @ignore
	 */
	isMobile: boolean
}

export default function SearchButton({ searchbar, isHomePage, isMobile }: Props) {
	const { displaySearchPopup } = useUI()

	const speech = useSpeechRecognition({
		onSpeech: () => {
			const m = document.querySelectorAll('.microphone') as NodeListOf<HTMLInputElement>

			m.forEach((i) => {
				i.value = speech.detectedText.value
			})
		},
		onError: (e) => console.error(e),
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

	return (
		<>
			{isMobile
				? (
					<>
						{/* Mobile Version */}
						<div class='flex border-b border-neutral-1 justify-center border-opacity-50 gap-5 max-w-[284px] items-center'>
							<PureButton
								type='button'
								class={clsx(
									'grid place-items-center mx-3 relative w-6 h-6',
									!speech.supported && 'pointer-events-none opacity-0',
								)}
								tabIndex={-1}
								onClick={speech.start}
							>
								<Icon
									id='Microphone'
									size={28}
									strokeWidth={0.01}
									class='microphone-icon text-neutral-0 ml-2 -translate-y-1 shrink-0'
								/>
								<span class='sr-only'>Procurar por voz</span>
							</PureButton>
							<label htmlFor='search-input' class='sr-only'>Procurar produto</label>
							<input
								id='search-input'
								placeholder='O que você procura hoje?'
								class='microphone text-neutral-1 text-xs max-w-[150px] outline-none'
								onKeyPress={(e) => {
									if (e.key === 'Enter' && e.currentTarget.value) {
										location.href = `/s?q=${e.currentTarget.value}`
									}
								}}
							/>
							<button
								type='text'
								class='brightness-0 mb-2 mr-8 shrink-0'
								onClick={(e) => {
									const text =
										(e.currentTarget.previousElementSibling as HTMLInputElement)
											.value

									if (text) {
										location.href = `/s?q=${text}`
									}
								}}
							>
								<Icon
									id='MagnifyingGlass'
									size={28}
									strokeWidth={0.1}
								/>
							</button>
						</div>
					</>
				)
				: (
					<>
						{/* Desktop Version */}
						{displaySearchPopup.value && (
							<div
								class='w-screen h-screen bg-black/50 absolute inset-0 z-[99]'
								onClick={() => {
									displaySearchPopup.value = false
									if (isHomePage) {
										document.querySelector('.root')!.classList.remove(
											'header-hover',
										)
									}
								}}
							/>
						)}

						<button
							class='flex items-center gap-2 group relative z-[100]'
							onClick={() => displaySearchPopup.value = true}
						>
							<Icon
								id='MagnifyingGlass'
								class='flex-shrink-0 header-icon group-data-[micro-header="true"]/header:!brightness-0'
								width={24}
								htmlFor='searchbar'
								height={24}
							/>

							<div class='text-sm whitespace-nowrap'>
								<p class='text-search-text group-data-[micro-header="true"]/header:text-neutral-0'>
									BUSCAR
								</p>
							</div>

							<Searchbar searchbar={searchbar} />
						</button>
					</>
				)}
		</>
	)
}
