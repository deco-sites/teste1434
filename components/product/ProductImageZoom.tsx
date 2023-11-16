import PureModal from '$store/components/ui/PureModal.tsx'
import Slider from '$store/components/ui/Slider.tsx'
import { useId } from '$store/sdk/useId.ts'
import { useSignal } from '@preact/signals'
import { Video } from '$store/components/product/ProductDetails.tsx'
import RenderHTML from '$store/components/ui/RenderHTML.tsx'
import { ImageObject } from 'apps/commerce/types.ts'
import Image from 'apps/website/components/Image.tsx'

type Props = {
	image: ImageObject | Video | null
	index: number
}

const WIDTH = 500
const HEIGHT = 500
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`

export default function ProductImageZoom({ image, index }: Props) {
	const id = useId()
	const open = useSignal(false)

	// thx who make this <3
	// https://github.com/deco-sites/carolbassi/blob/9a41919754597cbdf1b30db27fe5ac2bb1e39db2/components/product/SliderProductShowcase.tsx
	const handleMouseLeave = (e: MouseEvent) => {
		const target = e.target as HTMLImageElement
		const parent = target.parentElement
		const image = parent?.querySelector('div')

		if (image) image.style.display = 'none'
		target.style.opacity = '1'
	}

	const handleMouseMove = (e: MouseEvent) => {
		const target = e.target as HTMLImageElement
		const image = target.nextElementSibling as HTMLDivElement

		const container = target.parentElement as HTMLLIElement
		const containerWidth = container.offsetWidth
		const containerHeight = container.offsetHeight

		const { left, top } = container.getBoundingClientRect()

		const xPercentage = ((e.clientX - left) / containerWidth) * 100
		const yPercentage = ((e.clientY - top) / containerHeight) * 100

		image.style.display = 'block'
		target.style.opacity = '0'
		image.style.backgroundPosition = `${xPercentage * 5}% ${yPercentage}%`
	}

	return (
		<Slider.Item index={index} id={id} class='carousel-item relative w-full m-auto'>
			<div class='hidden lg:block w-full h-full isolate'>
				{image && (image as Video).value
					? (
						<RenderHTML
							html={(image as Video).value}
							class='w-full h-[300px] grid place-items-center max-w-[500px]'
						/>
					)
					: (
						<>
							<Image
								sizes='(max-width: 640px) 100vw, 40vw'
								style={{ aspectRatio: ASPECT_RATIO }}
								src={image
									? (image as ImageObject).url!
									: 'https://files.catbox.moe/33nrqz.webp'}
								alt={image ? (image as ImageObject).alternateName : ''}
								width={WIDTH}
								height={HEIGHT}
								// Preload LCP image for better web vitals
								preload={index === 0}
								loading={index === 0 ? 'eager' : 'lazy'}
								onMouseLeave={handleMouseLeave}
								onMouseMove={handleMouseMove}
							/>
							{image && (
								<div
									class='hidden inset-0 absolute bg-no-repeat w-full h-full pointer-events-none'
									style={{
										backgroundImage: `url(${(image as ImageObject).url})`,
										backgroundSize: '200%',
										backgroundPosition: 'center',
									}}
								/>
							)}
						</>
					)}
			</div>
			<div class='lg:hidden grid w-full h-full'>
				{image && (image as Video).value
					? (
						<RenderHTML
							html={(image as Video).value}
							class='w-full h-[300px] grid place-items-center max-w-[500px]'
						/>
					)
					: (
						<>
							<Image
								sizes='(max-width: 640px) 100vw, 40vw'
								style={{ aspectRatio: ASPECT_RATIO }}
								src={image
									? (image as ImageObject).url!
									: 'https://files.catbox.moe/33nrqz.webp'}
								alt={image ? (image as ImageObject).alternateName : ''}
								width={WIDTH}
								height={HEIGHT}
								// Preload LCP image for better web vitals
								preload={index === 0}
								loading={index === 0 ? 'eager' : 'lazy'}
								onClick={() => {
									open.value = true
								}}
							/>

							<PureModal open={open.value}>
								<Image
									sizes='(max-width: 640px) 100vw, 40vw'
									style={{ aspectRatio: ASPECT_RATIO }}
									src={image
										? (image as ImageObject).url!
										: 'https://files.catbox.moe/33nrqz.webp'}
									alt={image ? (image as ImageObject).alternateName : ''}
									width={WIDTH}
									height={HEIGHT}
									// Preload LCP image for better web vitals
									preload={index === 0}
									loading={index === 0 ? 'eager' : 'lazy'}
								/>
							</PureModal>
						</>
					)}
			</div>
		</Slider.Item>
	)
}
