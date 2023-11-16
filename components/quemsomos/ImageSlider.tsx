import Icon from '$store/components/ui/Icon.tsx'

type Item = {
	alt: string
	src: string
}

type Props = {
	items: Item[]
}

export default function ImageSlider({ items }: Props) {
	if (items.length < 3) {
		return <></>
	}

	return (
		<div class='w-full h-full [transform-style:preserve-3d] flex justify-center items-center flex-col'>
			<div class='w-full h-full relative'>
				<input
					class='hidden peer/item-1'
					type='radio'
					name='slider'
					id='item-1'
					checked
				/>
				<input
					class='hidden peer/item-2'
					type='radio'
					name='slider'
					id='item-2'
				/>
				<input
					class='hidden peer/item-3'
					type='radio'
					name='slider'
					id='item-3'
				/>
				{/* Left Buttons */}
				<label
					htmlFor='item-1'
					class='hidden z-[2] peer-checked/item-2:flex absolute left-[20%] top-1/2 -translate-y-1/2 cursor-pointer w-12 h-12 justify-center items-center bg-white/50'
				>
					<Icon id='ChevronRight' size={24} class='rotate-180' />
				</label>
				<label
					htmlFor='item-2'
					class='hidden z-[2] peer-checked/item-3:flex absolute left-[20%] top-1/2 -translate-y-1/2 cursor-pointer w-12 h-12 justify-center items-center bg-white/50'
				>
					<Icon id='ChevronRight' size={24} class='rotate-180' />
				</label>
				<label
					htmlFor='item-3'
					class='hidden z-[2] peer-checked/item-1:flex absolute left-[20%] top-1/2 -translate-y-1/2 cursor-pointer w-12 h-12 justify-center items-center bg-white/50'
				>
					<Icon id='ChevronRight' size={24} class='rotate-180' />
				</label>
				{/* Right Buttons */}
				<label
					htmlFor='item-1'
					class='hidden z-[2] peer-checked/item-3:flex absolute right-[20%] top-1/2 -translate-y-1/2 cursor-pointer w-12 h-12 justify-center items-center bg-white/50'
				>
					<Icon id='ChevronRight' size={24} />
				</label>
				<label
					htmlFor='item-2'
					class='hidden z-[2] peer-checked/item-1:flex absolute right-[20%] top-1/2 -translate-y-1/2 cursor-pointer w-12 h-12 justify-center items-center bg-white/50'
				>
					<Icon id='ChevronRight' size={24} />
				</label>
				<label
					htmlFor='item-3'
					class='hidden z-[2] peer-checked/item-2:flex absolute right-[20%] top-1/2 -translate-y-1/2 cursor-pointer w-12 h-12 justify-center items-center bg-white/50'
				>
					<Icon id='ChevronRight' size={24} />
				</label>
				{/* Image 1 */}
				<div
					class='duration-300 peer-checked/item-1:translate-x-0 peer-checked/item-1:opacity-100 peer-checked/item-1:scale-100 peer-checked/item-1:z-[1] peer-checked/item-2:-translate-x-[40%] peer-checked/item-3:translate-x-[40%] opacity-40 scale-75 z-0 absolute w-[60%] h-full left-0 right-0 top-1/2 -translate-y-1/2 m-auto transition-transform'
					htmlFor='item-1'
					id='song-1'
				>
					<img
						class='object-contain w-full h-full'
						src={items[0].src}
						alt={items[0].alt}
					/>
				</div>
				{/* Image 2 */}
				<div
					class='duration-300 peer-checked/item-2:translate-x-0 peer-checked/item-2:opacity-100 peer-checked/item-2:z-[1] peer-checked/item-2:scale-100 peer-checked/item-3:-translate-x-[40%] peer-checked/item-1:translate-x-[40%] opacity-40 scale-75 z-0 absolute w-[60%] h-full left-0 right-0 top-1/2 -translate-y-1/2 m-auto transition-transform'
					htmlFor='item-2'
					id='song-2'
				>
					<img
						class='object-contain w-full h-full'
						src={items[1].src}
						alt={items[1].alt}
					/>
				</div>
				{/* Image 3 */}
				<div
					class='duration-300 peer-checked/item-3:translate-x-0 peer-checked/item-3:opacity-100 peer-checked/item-3:z-[1] peer-checked/item-3:scale-100 peer-checked/item-1:-translate-x-[40%] peer-checked/item-2:translate-x-[40%] opacity-40 scale-75 z-0 absolute w-[60%] h-full left-0 right-0 top-1/2 -translate-y-1/2 m-auto transition-transform'
					htmlFor='item-3'
					id='song-3'
				>
					<img
						class='object-contain w-full h-full'
						src={items[2].src}
						alt={items[2].alt}
					/>
				</div>
			</div>
		</div>
	)
}
