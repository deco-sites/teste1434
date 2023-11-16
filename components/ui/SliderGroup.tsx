import type { ComponentChildren, JSX } from 'preact'

interface SliderGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
	id: string
	children: ComponentChildren
}

export function SliderGroup({ id, children, ...rest }: SliderGroupProps) {
	return (
		<div class='slider-group' {...rest} id={id} data-slider-group>
			{children}
		</div>
	)
}
