import { ComponentChild } from 'preact'

const Collapsable = ({
	title,
	children,
	open = false,
	class: _class,
	contentClass,
	detailsClass,
}: {
	title: ComponentChild
	children: ComponentChild
	open?: boolean
	class?: string
	contentClass?: string
	detailsClass?: string
}) => {
	return (
		<div class={_class}>
			<details
				class={`group peer cursor-pointer select-none marker:content-[""] ${
					detailsClass ?? ''
				}`}
			>
				<summary>{title}</summary>
			</details>
			<div
				class={`grid transition-all duration-300 ${
					open
						? 'grid-rows-[1fr] peer-open:grid-rows-[0fr]'
						: 'grid-rows-[0fr] peer-open:grid-rows-[1fr]'
				} ${contentClass ?? ''}`}
			>
				<div class='overflow-hidden'>{children}</div>
			</div>
		</div>
	)
}

export default Collapsable
