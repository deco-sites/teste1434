import Icon from '$store/components/ui/Icon.tsx'

interface Props {
	quantity: number
	disabled?: boolean
	loading?: boolean
	onChange?: (quantity: number) => void
	variant?: 'minicart'
}

const QUANTITY_MAX_VALUE = 100

function ProductQuantitySelector({ onChange, quantity, disabled, loading, variant }: Props) {
	const decrement = () => onChange?.(Math.max(0, quantity - 1))
	const increment = () => onChange?.(Math.min(quantity + 1, QUANTITY_MAX_VALUE))

	return (
		<div
			class={`flex w-full justify-between overflow-hidden rounded border border-[#252525] font-light text-black min-w-[110px] sm:max-w-[110px] ${
				variant === 'minicart' ? 'h-9 max-w-[120px]' : 'h-12'
			}`}
		>
			<button
				class='grid place-items-center bg-transparent px-2 text-2xl font-bold'
				onClick={decrement}
				disabled={disabled || loading}
			>
				<Icon id='Minus' size={24} class='text-[#252525]' />
			</button>
			<label class='h-full w-1/2'>
				<input
					class='h-full w-full text-center text-[#252525] outline-none [appearance:textfield] placeholder:text-[#252525]'
					type='number'
					inputMode='numeric'
					pattern='[0-9]*'
					max={QUANTITY_MAX_VALUE}
					min={1}
					value={quantity}
					disabled={disabled}
					onBlur={(e) => onChange?.(e.currentTarget.valueAsNumber)}
					maxLength={3}
					size={3}
				/>
				<span class='sr-only'>{quantity}</span>
			</label>
			<button
				class='grid place-items-center bg-transparent px-2 text-2xl font-bold'
				onClick={increment}
				disabled={disabled || loading}
			>
				<Icon id='Plus' size={28} class='text-[#252525]' />
			</button>
		</div>
	)
}

export default ProductQuantitySelector
