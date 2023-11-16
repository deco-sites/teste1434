import { IS_BROWSER } from '$fresh/runtime.ts'
import { chunk } from 'std/collections/chunk.ts'

export interface Props {
	rootId: string
	scroll?: 'smooth' | 'auto'
	interval?: number
	infinite?: boolean
	dotIsPage?: boolean
	startFrom?: number
	orientation?: 'horizontal' | 'vertical'
}

const ATTRIBUTES = {
	'data-slider': 'data-slider',
	'data-slider-item': 'data-slider-item',
	'data-slide="prev"': 'data-slide="prev"',
	'data-slide="next"': 'data-slide="next"',
	'data-slide-dot="prev"': 'data-slide-dot="prev"',
	'data-slide-dot="next"': 'data-slide-dot="next"',
	'data-dot': 'data-dot',
}

// Percentage of the item that has to be inside the container
// for it it be considered as inside the container
const THRESHOLD = 0.6

const intersectionX = (element: DOMRect, container: DOMRect): number => {
	const delta = container.width / 1_000

	if (element.right < container.left - delta) {
		return 0.0
	}

	if (element.left > container.right + delta) {
		return 0.0
	}

	if (element.left < container.left - delta) {
		return element.right - container.left + delta
	}

	if (element.right > container.right + delta) {
		return container.right - element.left + delta
	}

	return element.width
}

const intersectionY = (element: DOMRect, container: DOMRect): number => {
	const delta = container.height / 1_000

	if (element.bottom < container.top - delta) {
		return 0.0
	}

	if (element.top > container.bottom + delta) {
		return 0.0
	}

	if (element.top < container.top - delta) {
		return element.bottom - container.top + delta
	}

	if (element.bottom > container.bottom + delta) {
		return container.bottom - element.top + delta
	}

	return element.height
}

// as any are ok in typeguard functions
const isHTMLElement = (x: Element): x is HTMLElement =>
	// deno-lint-ignore no-explicit-any
	typeof (x as any).offsetLeft === 'number'

const setup = (
	{ rootId, scroll, interval, infinite, dotIsPage = false, startFrom = 0, orientation }: Props,
) => {
	const root = document.getElementById(rootId)

	if (!root) {
		return
	}

	const slider = root?.querySelector<HTMLElement>(`[${ATTRIBUTES['data-slider']}]`)
	const items = root!.querySelectorAll(
		`[${ATTRIBUTES['data-slider-item']}]`,
	) as NodeListOf<HTMLElement>
	const prev = root?.querySelector(`[${ATTRIBUTES['data-slide="prev"']}]`)
	const next = root?.querySelector(`[${ATTRIBUTES['data-slide="next"']}]`)
	const prevDot = root?.querySelector(`[${ATTRIBUTES['data-slide-dot="prev"']}]`)
	const nextDot = root?.querySelector(`[${ATTRIBUTES['data-slide-dot="next"']}]`)
	const dots = root?.querySelectorAll(`[${ATTRIBUTES['data-dot']}]`)

	if (!root || !slider || !items || items.length === 0) {
		console.warn(
			'Missing necessary slider attributes. It will not work as intended. Necessary elements:',
			{ root, slider, items, rootId },
		)

		return
	}

	const isVertical = orientation === 'vertical'

	const getElementsInsideContainer = () => {
		const indices: number[] = []
		const sliderRect = slider.getBoundingClientRect()

		for (let index = 0; index < items.length; index++) {
			const item = items.item(index)
			const rect = item.getBoundingClientRect()

			const ratio = isVertical
				? intersectionY(rect, sliderRect) / rect.height
				: intersectionX(rect, sliderRect) / rect.width

			if (ratio > THRESHOLD) {
				indices.push(index)
			}
		}

		return indices
	}

	const goToItem = (index: number) => {
		const item = items[index] as HTMLElement

		if (item && !isHTMLElement(item)) {
			console.warn(
				`Element at index ${index} is not an html element. Skipping carousel`,
			)

			return
		}

		const dot = dots?.[index]
		dot?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'start',
		})

		slider.scrollTo({
			top: isVertical ? item.offsetTop - slider.offsetTop : 0,
			behavior: scroll,
			left: isVertical ? 0 : (index === -1 ? 0 : items[index].offsetLeft) - root.offsetLeft,
		})
	}

	const onClickPrev = () => {
		const indices = getElementsInsideContainer()
		const itemsPerPage = indices.length
		const isShowingFirst = indices[0] === 0

		goToItem(
			isShowingFirst ? items.length - 1 : Math.max(-1, indices[0] - itemsPerPage),
		)
	}

	const onClickNext = () => {
		const indices = getElementsInsideContainer()
		const isShowingLast = indices[indices.length - 1] === items.length - 1

		goToItem(
			isShowingLast ? 0 : indices.at(-1)! + 1,
		)
	}

	const inside = getElementsInsideContainer()

	if (inside.length === items.length) {
		prev && ((prev as HTMLElement).style.display = 'none')
		next && ((next as HTMLElement).style.display = 'none')
		prevDot && ((prevDot as HTMLElement).style.display = 'none')
		nextDot && ((nextDot as HTMLElement).style.display = 'none')
	} else {
		prev && (prev as HTMLElement).style.removeProperty('display')
		next && (next as HTMLElement).style.removeProperty('display')
		prevDot && (prevDot as HTMLElement).style.removeProperty('display')
		nextDot && (nextDot as HTMLElement).style.removeProperty('display')
	}

	let chunkedElements = [] as number[]
	let extraItems: number | undefined = undefined

	function setupDotIsPage() {
		const indexes = [...items.entries()].map((_, i) => i)
		if (!indexes.length) return

		const insideElements = getElementsInsideContainer()
		if (!insideElements.length) return

		chunkedElements = chunk(indexes, insideElements.length).map((i) => i[0])
		extraItems = indexes.length % insideElements.length

		dots?.forEach((e, i) => {
			if (!chunkedElements.includes(i)) {
				e.parentElement!.remove()
			}
		})
	}

	if (dotIsPage) {
		setupDotIsPage()
	}

	const observer = new IntersectionObserver(
		(elements) => {
			elements.forEach((item) => {
				const index = Number(item.target.getAttribute('data-slider-item')) || 0

				if (item.isIntersecting) {
					item.target.setAttribute('data-intersection', '1')
				} else {
					item.target.removeAttribute('data-intersection')
				}

				if (!infinite) {
					if (index === 0) {
						if (item.isIntersecting) {
							prev?.setAttribute('disabled', '')
						} else {
							prev?.removeAttribute('disabled')
						}
					}
					if (index === items.length - 1) {
						if (item.isIntersecting) {
							next?.setAttribute('disabled', '')
						} else {
							next?.removeAttribute('disabled')
						}
					}
				}
			})

			const insideElements = getElementsInsideContainer()
			if (!insideElements.length) return

			if (dotIsPage) {
				let dotIndex = chunkedElements.indexOf(insideElements[0])
				const alternativeDotIndex = chunkedElements.indexOf(
					insideElements[0] + extraItems!,
				)

				dotIndex = dotIndex === -1 ? alternativeDotIndex : dotIndex

				if (dotIndex === -1) {
					return
				}
			}

			dots?.forEach((dot, i) => {
				if (i === insideElements[0] || i === insideElements[0] + extraItems!) {
					dot.setAttribute('disabled', '')
				} else {
					dot.removeAttribute('disabled')
				}
			})
		},
		{ threshold: THRESHOLD, root: slider },
	)

	items.forEach((item) => observer.observe(item))
	if (startFrom) goToItem(startFrom)

	for (let it = 0; it < (dots?.length ?? 0); it++) {
		dots?.item(it).addEventListener('click', () => goToItem(it))
	}

	prev?.addEventListener('click', onClickPrev)
	next?.addEventListener('click', onClickNext)
	prevDot?.addEventListener('click', onClickPrev)
	nextDot?.addEventListener('click', onClickNext)

	const timeout = interval && setInterval(onClickNext, interval)

	// Unregister callbacks
	return () => {
		for (let it = 0; it < (dots?.length ?? 0); it++) {
			dots?.item(it).removeEventListener('click', () => goToItem(it))
		}

		prev?.removeEventListener('click', onClickPrev)
		next?.removeEventListener('click', onClickNext)
		prevDot?.removeEventListener('click', onClickPrev)
		nextDot?.removeEventListener('click', onClickNext)

		observer.disconnect()

		clearInterval(timeout)
	}
}

function waitForElm(selector: string) {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector))
		}

		const observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				observer.disconnect()
				resolve(document.querySelector(selector))
			}
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		})
	})
}

function Slider({
	rootId,
	scroll = 'smooth',
	interval,
	infinite = false,
	dotIsPage,
	startFrom,
	orientation,
}: Props) {
	if (IS_BROWSER) {
		waitForElm(`#${rootId}`).then(() => {
			setup({ rootId, scroll, interval, infinite, dotIsPage, startFrom ,orientation})
		})
	}

	return <div data-slider-controller-js />
}

export default Slider
