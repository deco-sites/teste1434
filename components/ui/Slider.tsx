import type { ComponentChildren, JSX } from 'preact'

function Dot({ index, children }: { index: number; children: ComponentChildren }) {
	return (
		<button
			data-dot={index}
			aria-label={`go to slider item ${index}`}
			class='group focus:outline-none'
		>
			{children}
		</button>
	)
}

function Slider(props: JSX.IntrinsicElements['ul']) {
	return <ul data-slider {...props} />
}

function Item({ index, ...props }: JSX.IntrinsicElements['li'] & { index: number }) {
	return <li data-slider-item={index} {...props} />
}

function NextButton(props: JSX.IntrinsicElements['button']) {
	return <button data-slide='next' aria-label='Next item' {...props} />
}

function PrevButton(props: JSX.IntrinsicElements['button']) {
	return <button data-slide='prev' aria-label='Previous item' {...props} />
}

function NextButtonDot(props: JSX.IntrinsicElements['button']) {
	return <button data-slide-dot='next' aria-label='Next item' {...props} />
}

function PrevButtonDot(props: JSX.IntrinsicElements['button']) {
	return <button data-slide-dot='prev' aria-label='Previous item' {...props} />
}

Slider.Dot = Dot
Slider.Item = Item
Slider.NextButton = NextButton
Slider.PrevButton = PrevButton
Slider.NextButtonDot = NextButtonDot
Slider.PrevButtonDot = PrevButtonDot

export default Slider
