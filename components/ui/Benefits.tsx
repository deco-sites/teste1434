import Icon, { AvailableIcons } from '$store/components/ui/Icon.tsx'
import type { HTMLWidget } from 'apps/admin/widgets.ts'
import Slider from '$store/components/ui/Slider.tsx'
import SliderJS from '$store/components/ui/SliderJS.tsx'
import { useId } from '$store/sdk/useId.ts'
import RenderHTML from '$store/components/ui/RenderHTML.tsx'

export interface Benefit {
	/**
	 * @title Ícone
	 */
	icon: AvailableIcons
	/**
	 * @title Texto
	 */
	label: HTMLWidget
}

export interface Props {
	benefits?: Benefit[]
	interval?: number
}

function Buttons() {
	return (
		<>
			<div class='w-[35px] h-full absolute translate-y-[-50%] left-5 top-1/2 xl:hidden flex items-center py-2'>
				<Slider.PrevButton class='w-full h-[35px] xl:hidden flex justify-center items-center bg-transparent xl:bg-none'>
					<Icon
						class='text-neutral-0'
						size={20}
						id='ChevronLeft'
						strokeWidth={2}
					/>
				</Slider.PrevButton>
			</div>
			<div class='w-[35px] h-full absolute translate-y-[-50%] right-5 top-1/2 xl:hidden flex items-center py-2'>
				<Slider.NextButton class='w-full h-[35px] flex justify-center items-center bg-transparent xl:bg-none'>
					<Icon
						class='text-neutral-0'
						size={22}
						id='ChevronRight'
						strokeWidth={1}
					/>
				</Slider.NextButton>
			</div>
		</>
	)
}

export default function Benefits(
	props: Props,
) {
	const id = useId()

	const {
		benefits,
		interval = 5,
	} = props

	return (
		<div
			id={id}
			class='relative bg-client-primary py-2 h-[52px] max-h-[52px] xl:max-h-[35px] xl:h-[35px] font-tt-norms'
		>
			<div class='mx-4 xl:mx-auto my-0 xl:max-w-[1216px] mt-2.5 xl:mt-0'>
				<Slider class='carousel carousel-center flex items-center overflow-x-auto snap-x lg:justify-center'>
					{benefits?.map((benefit, index) => {
						return (
							<Slider.Item
								index={index}
								key={index}
								class='carousel-item w-full xl:w-[25%] xl:flex xl:items-center group'
							>
								<div class='flex gap-x-2 justify-center items-center w-full group-last:pr-0 group-first:pl-0'>
									<Icon
										id={benefit.icon}
										class={'text-neutral-0'}
										width={index === 0 && 24 || index === 1 && 19 ||
											index === 2 && 18 || index === 3 && 60 || 24}
										height={index === 0 && 18 || index === 1 && 20 ||
											index === 2 && 13 || index === 3 && 16 || 24}
										fill='reda'
										stroke='2'
									/>
									<RenderHTML
										html={benefit.label}
										class='text-white text-sm'
									/>
								</div>
							</Slider.Item>
						)
					})}
				</Slider>
				<Buttons />
				<SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
			</div>
		</div>
	)
}
