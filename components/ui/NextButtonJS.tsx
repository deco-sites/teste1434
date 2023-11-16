import type { JSX } from 'preact/jsx-runtime'

export default function NextButtonJS(props: JSX.IntrinsicElements['button']) {
	return <button data-slide='next' aria-label='Next item -10-' {...props} />
}
