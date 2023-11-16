import { effect, useSignal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'

type Props = {
	// deno-lint-ignore no-explicit-any
	onError?: (event: any) => void
	onSpeech?: () => void
}

/*
    It works, but for some reason isListening.value doesn't update with correct value
    so, i can't show an a proper visual feedback of microphone being active :)
*/
export function useSpeechRecognition({ onError, onSpeech }: Props = {}) {
	const isListening = useSignal(false)
	const detectedText = useSignal('')

	if (!IS_BROWSER || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
		return {
			detectedText,
			isListening,
			start: () => {},
			stop: () => {},
			supported: false,
		}
	}

	// @ts-ignore dont have types on vscode
	const recognition = new webkitSpeechRecognition() || SpeechRecognition()

	recognition.onstart = function () {
		isListening.value = true
	}

	// deno-lint-ignore no-explicit-any
	recognition.onerror = (e: any) => {
		isListening.value = false
		onError?.(e)
	}

	// deno-lint-ignore no-explicit-any
	recognition.onresult = function (event: any) {
		isListening.value = false
		detectedText.value = event.results?.[0]?.[0].transcript ?? ''
		onSpeech?.()
	}

	recognition.onspeechend = function () {
		isListening.value = false
	}

	const start = () => {
		if (!isListening.value) {
			recognition.start()
		}
	}

	const stop = () => {
		if (isListening.value) {
			recognition.stop()
		}
	}

	return {
		supported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
		detectedText,
		isListening,
		start,
		stop,
	}
}
