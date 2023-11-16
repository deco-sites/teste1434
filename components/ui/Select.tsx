import { ComponentChildren, JSX } from 'preact'
import { useId } from '$store/sdk/useId.ts'

function Select({
	title,
	class: _class = '',
	children,
	...rest
}: Omit<JSX.IntrinsicElements['label'], 'title'> & {
	title: ComponentChildren
}) {
	const id = useId()

	return (
		<>
			<label
				for={id}
				class={`group relative cursor-pointer select-none ${_class}`}
				{...rest}
			>
				{title}
				<input
					id={id}
					type='checkbox'
					class='hidden [&:checked+div]:grid-rows-[1fr] [&:checked+div]:z-50'
				/>
				{children}
			</label>
		</>
	)
}

function Options({
	children,
	activeId,
	subClass = '',
	class: _class = '',
	...rest
}: JSX.IntrinsicElements['div'] & {
	activeId: string
	subClass?: string
}) {
	return (
		<div
			role='listbox'
			aria-labelledby='label'
			aria-expanded='true'
			aria-activedescendant={activeId}
			tabIndex={0}
			class={`
                absolute left-0 top-full z-0 grid w-full grid-rows-[0fr] transition-all duration-300
                ${_class}
            `}
			{...rest}
		>
			<div class={`flex w-full flex-col overflow-y-auto ${subClass}`}>{children}</div>
		</div>
	)
}

// https://www.24a11y.com/2019/select-your-poison/

Select.Options = Options

export default Select
