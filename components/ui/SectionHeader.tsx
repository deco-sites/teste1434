interface Props {
	title?: string
	fontSize?: 'Normal' | 'Large'
	description?: string
	alignment: 'center' | 'left'
	colorReverse?: boolean
}

function Header(props: Props) {
	return (
		<>
			{props.title || props.description
				? (
					<div
						class={`flex flex-col ${
							props.alignment === 'left' ? 'text-left' : 'text-center'
						}`}
					>
						{props.title &&
							(
								<h1
									class={`text-2xl text-neutral-0 font-bold font-tt-norms
                  ${props.colorReverse ? 'text-primary-content' : 'text-base-content'}
                `}
								>
									{props.title}
								</h1>
							)}
						{props.description &&
							(
								<h2
									class={`text-sm text-neutral-1 font-tt-norms
                  ${props.colorReverse ? 'text-primary-content' : 'text-neutral'}
                `}
								>
									{props.description}
								</h2>
							)}
					</div>
				)
				: null}
		</>
	)
}

export default Header
