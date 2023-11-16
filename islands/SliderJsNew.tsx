import { useEffect } from 'preact/compat'

interface Props {
	rootId: string
	scroll?: 'smooth' | 'auto'
	interval?: number
	infinite?: boolean
	groupId?: string
	pauseVideos?: boolean
	tabId?: string
	initialSlide?: number
	breakGreaterThan?: number
	axis?: 'x' | 'y'
	controller?: boolean
	perScroll?: number
}

const ATTRIBUTES = {
	'data-slider': 'data-slider',
	'data-slider-item': 'data-slider-item',
	'data-slide="prev"': 'data-slide="prev"',
	'data-slide="next"': 'data-slide="next"',
	'data-dot': 'data-dot',
}

// Percentage of the item that has to be inside the container
// for it it be considered as inside the container
const THRESHOLD = 0.8

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

// as any are ok in typeguard functions
const isHTMLElement = (x: Element): x is HTMLElement =>
	// deno-lint-ignore no-explicit-any
	typeof (x as any)?.offsetLeft === 'number'

const setup = ({
	rootId,
	scroll,
	interval,
	infinite,
	groupId,
	pauseVideos,
	tabId,
	initialSlide,
	breakGreaterThan,
	axis = 'x',
	controller,
	perScroll,
}: Props) => {
	const root = document.getElementById(rootId)
	const slider = root?.querySelector(`[${ATTRIBUTES['data-slider']}]`)
	const items = root?.querySelectorAll(`[${ATTRIBUTES['data-slider-item']}]`)

	const getElements = (selector: string, groupId?: string) => {
		if (groupId) {
			return document.querySelectorAll(`#${groupId} ${selector}`)
		}
		return root?.querySelectorAll(selector)
	}

	const prev = getElements(`[${ATTRIBUTES['data-slide="prev"']}]`, groupId)
	const next = getElements(`[${ATTRIBUTES['data-slide="next"']}]`, groupId)

	const dots = root?.querySelectorAll(`[${ATTRIBUTES['data-dot']}]`)

	if (breakGreaterThan) {
		const hasGreater = window.matchMedia(`(min-width: ${breakGreaterThan}px)`)
		if (hasGreater.matches) {
			return
		}
	}

	if (!root || !slider || !items || items.length === 0) {
		console.warn(
			'Missing necessary slider attributes. It will not work as intended. Necessary elements:',
			{
				root,
				slider,
				items,
				rootId,
			},
		)

		return
	}

	const getElementsInsideContainer = () => {
		const indices: number[] = []
		const sliderRect = slider.getBoundingClientRect()

		for (let index = 0; index < items.length; index++) {
			const item = items.item(index)
			const rect = item.getBoundingClientRect()

			const ratio = intersectionX(rect, sliderRect) / rect.width

			if (ratio > THRESHOLD) {
				indices.push(index)
			}
		}

		return indices
	}

	const goToItem = (index: number) => {
		const targetElement = items.item(index)

		if (!isHTMLElement(targetElement)) {
			return
		}

		const scrollOptions = {
			top: 0,
			behavior: scroll,
			left: targetElement.offsetLeft - root.offsetLeft,
		}

		slider.scrollTo(scrollOptions)
	}

	const goToItemGroup = (
		index: number,
		target?: HTMLElement,
		axis?: string,
	) => {
		const targetElement = target
			? target
				.querySelectorAll(`[${ATTRIBUTES['data-slider-item']}]`)
				.item(index)
			: items.item(index)

		if (!isHTMLElement(targetElement)) {
			return
		}

		let scrollOptions = {
			top: 0,
			behavior: scroll,
			left: targetElement.offsetLeft -
				(target ? target.offsetLeft : root.offsetLeft),
		}

		if (axis === 'y') {
			scrollOptions = {
				top: targetElement.offsetTop -
					(target ? target.offsetTop : root.offsetTop),
				behavior: scroll,
				left: 0,
			}
		}

		if (target) {
			target.scrollTo(scrollOptions)
		} else {
			slider.scrollTo(scrollOptions)
		}
	}

	const onClickPrev = () => {
		const indices = getElementsInsideContainer()
		const itemsPerPage = perScroll ?? indices.length
		const isShowingFirst = indices[0] === 0
		const pageIndex = Math.floor(indices[indices.length - 1] / itemsPerPage)

		if (isShowingFirst && infinite) {
			goToItem(items.length - 1)
			return
		}

		goToItem((pageIndex - 1) * itemsPerPage)
	}

	const onClickNext = () => {
		const indices = getElementsInsideContainer()
		const itemsPerPage = perScroll ?? indices.length
		const isShowingLast = indices[indices.length - 1] === items.length - 1
		const pageIndex = Math.floor(indices[0] / itemsPerPage)

		if (isShowingLast && infinite) {
			goToItem(0)
			return
		}

		goToItem((pageIndex + 1) * itemsPerPage)
	}

	const handleHasPauseVideos = () => {
		const videos = document.querySelectorAll('video')
		videos.forEach((video) => video.pause())
	}

	const handleHasTabs = () => {
		if (!tabId) return

		const container = document.getElementById(tabId)
		if (!container) return

		const currentSlider = container.querySelector(`#${rootId}`)
		const sliderFirstVisible = currentSlider?.getAttribute(
			'data-first-visible-slide',
		)

		const currentItem = container.querySelector(
			`[data-tab="${sliderFirstVisible}"]`,
		)
		const allTabItems = container.querySelectorAll(`[data-tab]`)

		allTabItems.forEach((item) => {
			if (item !== currentItem) {
				item.setAttribute('data-tab-visible', 'false')
				item.setAttribute('data-tab-shift', 'false')
			}
		})

		if (currentItem) {
			currentItem.setAttribute('data-tab-visible', 'true')
		}
	}

	if (initialSlide) {
		goToItem(initialSlide)
	}

	let skipPauseVideo = true

	const observer = new IntersectionObserver(
		(elements) =>
			elements.forEach((item) => {
				if (!skipPauseVideo && pauseVideos) {
					handleHasPauseVideos()
				}

				skipPauseVideo = false
				const index = Number(item.target.getAttribute('data-slider-item')) || 0
				const dot = dots?.item(index)

				if (item.isIntersecting) {
					const rootIsGroup = root.getAttribute('data-group-slider')
					if (!rootIsGroup) {
						root.setAttribute('data-first-visible-slide', String(index))
					}
					item?.target.removeAttribute('data-not-visible')
					slider.setAttribute('data-axis', axis!)
					item?.target.setAttribute('data-visible', '')
					dot?.setAttribute('disabled', '')
					handleHasTabs()
				} else {
					item?.target.setAttribute('data-not-visible', '')
					item?.target.removeAttribute('data-visible')
					dot?.removeAttribute('disabled')
				}

				if (!infinite) {
					if (index === 0) {
						if (item.isIntersecting) {
							prev?.forEach((prev) => prev?.setAttribute('disabled', ''))
						} else {
							prev?.forEach((prev) => prev?.removeAttribute('disabled'))
						}
					}
					if (index === items.length - 1) {
						if (item.isIntersecting) {
							next?.forEach((next) => next?.setAttribute('disabled', ''))
						} else {
							next?.forEach((next) => next?.removeAttribute('disabled'))
						}
					}
				}
			}),
		{ threshold: THRESHOLD, root: slider },
	)

	function handleClickGroupItem(event: Event) {
		const target = event.target
		if (target instanceof Element) {
			const closestItem = target.closest('[data-slider-item]')
			if (closestItem) {
				const itemIndex = Number(closestItem.getAttribute('data-slider-item'))
				goToItem(itemIndex)
			}
		}
	}

	if (controller && groupId) {
		const $group = document.getElementById(groupId)
		if (!$group) return

		const $controller = $group.querySelector('[data-group-controller]')
		if (!$controller) return

		const $items = $group.querySelectorAll('[data-group-slider]')

		$group.addEventListener('click', handleClickGroupItem)

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'data-first-visible-slide'
				) {
					const itemActiveInGroup = $controller.getAttribute(
						'data-first-visible-slide',
					)

					$items.forEach((item) => {
						const lis = item.querySelectorAll('[data-slider-item]')
						lis.forEach((li) => {
							li.removeAttribute('data-active')
						})
						const itemActive = item.querySelector(
							`[data-slider-item='${itemActiveInGroup}']`,
						)
						itemActive?.setAttribute('data-active', '')
						item.setAttribute(
							'data-first-visible-slide',
							String(itemActiveInGroup),
						)
						const slide = item.querySelector(
							'[data-slider="true"]',
						) as HTMLElement
						const axis = slide?.getAttribute('data-axis')
						goToItemGroup(Number(itemActiveInGroup), slide, axis!)
					})
				}
			})
		})

		observer.observe($controller, { attributes: true })
	}

	items.forEach((item) => observer.observe(item))

	for (let it = 0; it < (dots?.length ?? 0); it++) {
		dots?.item(it).addEventListener('click', () => goToItem(it))
	}

	prev?.forEach((prev) => prev?.addEventListener('click', onClickPrev))
	next?.forEach((next) => next?.addEventListener('click', onClickNext))

	const timeout = interval && setInterval(onClickNext, interval)

	// Unregister callbacks
	return () => {
		for (let it = 0; it < (dots?.length ?? 0); it++) {
			dots?.item(it).removeEventListener('click', () => goToItem(it))
		}

		prev?.forEach((prev) => prev?.removeEventListener('click', onClickPrev))
		next?.forEach((next) => next?.removeEventListener('click', onClickNext))

		observer.disconnect()

		clearInterval(timeout)
	}
}

function SliderJS({
	breakGreaterThan,
	rootId,
	scroll = 'smooth',
	interval,
	infinite = false,
	groupId,
	pauseVideos = false,
	tabId,
	initialSlide,
	axis,
	controller,
	perScroll,
}: Props) {
	useEffect(
		() =>
			setup({
				rootId,
				scroll,
				interval,
				infinite,
				groupId,
				pauseVideos,
				tabId,
				initialSlide,
				breakGreaterThan,
				axis,
				controller,
				perScroll,
			}),
		[
			rootId,
			scroll,
			interval,
			infinite,
			pauseVideos,
			tabId,
			initialSlide,
			breakGreaterThan,
			axis,
			controller,
			perScroll,
		],
	)

	return <div data-slider-controller-js />
}

export default SliderJS
