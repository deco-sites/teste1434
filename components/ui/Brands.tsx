import Icon from '$store/components/ui/Icon.tsx'
import Slider from '$store/components/ui/Slider.tsx'
import SliderJS from '$store/components/ui/SliderJS.tsx'
import type { ImageWidget } from 'apps/admin/widgets.ts'
import Image from 'apps/website/components/Image.tsx'
import { useId } from '$store/sdk/useId.ts'

// @titleBy alt
export interface Brands {
	/**
	 * @title Logotipo da marca
	 */
	image: ImageWidget

	/**
	 * @title Texto alternativo
	 */
	alt: string

	/**
	 * @title Link para página da marca
	 */
	href: string
}

export interface Props {
	/**
	 * @title Título
	 */
	title: string
	brands: Brands[]
}

export default function Benefits({ title, brands }: Props) {
	const id = useId()

	return (
		<div
			class='container flex flex-col justify-center w-full items-center px-[38px] lg:px-0 font-tt-norms'
			id={id}
		>
			<h1 class='text-neutral-0 text-xl lg:text-2xl font-bold mb-6'>
				{title}
			</h1>
			<div class='flex gap-x-8 w-full lg:gap-[19px] items-center relative'>
				<Slider.PrevButton class='absolute -left-1 top-1/2 -translate-y-1/2 w-[40px] h-[35px] flex justify-center items-center transition-colors bg-white lg:hover:bg-primary-500'>
					<Icon
						size={16}
						id='ChevronLeft'
						strokeWidth={3}
					/>
				</Slider.PrevButton>
				<Slider class='carousel flex items-center max-w-[200px] min-[500px]:max-w-none mx-auto gap-8'>
					{brands?.map((brand, index) => (
						<Slider.Item
							index={index}
							key={index}
							class='carousel-item flex justify-center items-center lg:first:pl-16 lg:last:pr-5'
						>
							<a
								href={brand.href}
								class='rounded-full border-2 border-neutral-3 p-0.5 transition-colors hover:border-primary-500 overflow-hidden'
							>
								<Image
									src={brand.image}
									alt={brand.alt}
									width={74}
									height={74}
									class='rounded-full overflow-hidden'
								/>
							</a>
						</Slider.Item>
					))}
				</Slider>
				<Slider.NextButton class='absolute -right-1 top-1/2 -translate-y-1/2 w-[40px] h-[35px] flex justify-center items-center transition-colors bg-white lg:hover:bg-primary-500 lg:hover:text-white'>
					<Icon
						size={22}
						id='ChevronRight'
						strokeWidth={2}
					/>
				</Slider.NextButton>
			</div>
			<SliderJS rootId={id} infinite />
		</div>
	)
}
