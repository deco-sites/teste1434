import { IS_BROWSER } from '$fresh/runtime.ts'

interface Props {
	rootId: string
	threshold?: number
}

// deno-lint-ignore no-explicit-any
const debounce = <T extends (...args: any[]) => any>(fn: T) => {
	let frame: number

	return (...params: Parameters<T>): void => {
		if (frame) {
			cancelAnimationFrame(frame)
		}

		frame = requestAnimationFrame(() => {
			fn(...params)
		})
	}
}

const storeHasScrolledPast = (root: HTMLElement, threshold: number) => {
	const hasScrolledPastTresHold = window.pageYOffset >= threshold
	const previousValue = root.getAttribute(
		'data-micro-header',
	)

	if (previousValue === hasScrolledPastTresHold.toString()) return

	root.setAttribute(
		'data-micro-header',
		hasScrolledPastTresHold.toString(),
	)
}

const setup = ({ rootId, threshold = 300 }: Props) => {
	const root = document.getElementById(rootId)

	if (!root) {
		console.warn('Unable to find root element with id', rootId)
		return
	}

	document.addEventListener(
		'scroll',
		debounce(() =>
			storeHasScrolledPast(
				root,
				threshold,
			)
		),
		{ passive: true },
	)

	storeHasScrolledPast(root, threshold)
}

function HasScrolledPastThresholdDataAttributeSetup(
	{ rootId, threshold }: Props,
) {
	if (IS_BROWSER) {
		setup({ rootId, threshold })
	}

	return null
}

export default HasScrolledPastThresholdDataAttributeSetup
