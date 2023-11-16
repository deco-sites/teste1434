import type { JSX } from 'preact/jsx-runtime'

export default function PrevButtonJS(props: JSX.IntrinsicElements['button']) {
	return <button data-slide='prev' aria-label='Previous item' {...props} />
}
