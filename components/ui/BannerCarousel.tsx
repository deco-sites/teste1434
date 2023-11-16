import Icon from '$store/components/ui/Icon.tsx'
import Slider from '$store/components/ui/Slider.tsx'
import SliderJS from '$store/components/ui/SliderJS.tsx'
import { Picture, Source } from 'deco-sites/std/components/Picture.tsx'
import { useId } from '$store/sdk/useId.ts'
import type { Image as LiveImage } from 'deco-sites/std/components/types.ts'

/**
 * @titleBy alt
 */
export interface Banner {
	/** @description desktop otimized image */
	desktop: LiveImage
	/** @description mobile otimized image */
	mobile: LiveImage
	/** @description Image alt text */
	alt: string
	/** @description when user clicks on the image, go to this link */
	href: string
}

export interface Props {
	images?: Banner[]
	/**
	 * @description Check this option when this banner is the biggest image on the screen for image optimizations
	 */
	preload?: boolean
	/**
	 * @title Autoplay interval
	 * @description time (in seconds) to start the carousel autoplay
	 */
	interval?: number
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
	const {
		alt,
		mobile,
		desktop,
	} = image

	return (
		<a
			href={image?.href ?? '#'}
			class='relative h-[508px] overflow-y-hidden w-full'
		>
			<Picture preload={lcp}>
				<Source
					media='(max-width: 767px)'
					fetchPriority={lcp ? 'high' : 'auto'}
					src={mobile}
					width={360}
					height={508}
				/>
				<Source
					media='(min-width: 768px)'
					fetchPriority={lcp ? 'high' : 'auto'}
					src={desktop}
					width={1920}
					height={508}
				/>
				<img
					class='object-cover w-full h-full'
					loading={lcp ? 'eager' : 'lazy'}
					src={desktop}
					alt={alt}
				/>
			</Picture>
		</a>
	)
}

function Dots({ images, interval = 0 }: Props) {
	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: `
          @property --dot-progress {
            syntax: '<percentage>';
            inherits: false;
            initial-value: 0%;
          }
          `,
				}}
			/>
			<ul class='carousel justify-center absolute bottom-6 left-1/2 -translate-x-1/2'>
				{images?.map((_, index) => (
					<li class='carousel-item p-1'>
						<button
							data-dot={index}
							aria-label={`go to slider item ${index}`}
							class='focus:outline-none group'
						>
							<div class='w-[15px] h-2 bg-none border border-white rounded group-disabled:w-[37px] group-disabled:bg-white' />
						</button>
					</li>
				))}
			</ul>
		</>
	)
}

function Buttons() {
	return (
		<>
			<div class='w-12 h-12 absolute translate-y-[-50%] left-5 top-1/2 xl:left-[calc(50%-610px)]'>
				<Slider.PrevButton class='btn flex items-center justify-center btn-square min-w-10 max-w-10 min-h-10 max-h-10 !bg-white !bg-opacity-50 backdrop-blur-sm border-none hover:text-gray-500 cursor-pointer'>
					<Icon
						class=''
						size={20}
						id='ChevronLeft'
						data-slide='prev'
						strokeWidth={2}
					/>
				</Slider.PrevButton>
			</div>
			<div class='w-12 h-12 absolute translate-y-[-50%] right-5 top-1/2 xl:right-[calc(50%-610px)]'>
				<Slider.NextButton class='btn btn-square !bg-white !bg-opacity-50 backdrop-blur-sm border-none hover:text-gray-500 cursor-pointer'>
					<Icon
						class=''
						size={24}
						id='ChevronRight'
						strokeWidth={1}
					/>
				</Slider.NextButton>
			</div>
		</>
	)
}

function BannerCarousel({ images, preload, interval = 10 }: Props) {
	const id = useId()

	return (
		<div
			id={id}
			class='grid grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr_64px] relative mt-[35px]'
		>
			<Slider class='carousel carousel-center w-full col-span-full row-span-full gap-6 max-h-[508px]'>
				{images?.map((image, index) => (
					<Slider.Item index={index} class='carousel-item w-full'>
						<BannerItem image={image} lcp={preload} />
					</Slider.Item>
				))}
			</Slider>

			<Buttons />

			<Dots images={images} interval={interval} />

			<SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
			<div class='absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none'>
			</div>
		</div>
	)
}

export default BannerCarousel
