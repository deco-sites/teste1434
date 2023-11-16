import Slider from '$store/components/ui/Slider.tsx'
import Image from 'apps/website/components/Image.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import type { ImageWidget } from 'apps/admin/widgets.ts'
import SliderJS from '$store/components/ui/SliderJS.tsx'
import { useId } from '$store/sdk/useId.ts'

/**
 * @titleBy descPost
 */
export interface PostProps {
	/**
	 * @title Imagem do post
	 */
	imagePost: ImageWidget

	/**
	 * @title Descrição do post
	 */
	descPost: string

	/**
	 * @title Link do post
	 */
	hrefPost: string
}

export interface Props {
	/**
	 * @title Título do componente
	 */
	sectionTitle: string

	/**
	 * @title Descrição do componente
	 */
	sectionDescription: string

	/**
	 * @title Posts
	 */
	posts: PostProps[]
}

export default function TipsForBusiness(
	{
		sectionTitle,
		sectionDescription,
		posts,
	}: Props,
) {
	const id = useId()
	return (
		<div class='container' id={id}>
			<h2 class='text-center text-2xl text-neutral-0 font-bold mb-[5px] font-tt-norms'>
				{sectionTitle}
			</h2>
			<p class='text-center text-neutral-1 text-sm font-normal mb-4 font-tt-norms'>
				{sectionDescription}
			</p>
			<div class='flex gap-[22px] items-center max-w-6xl relative w-fit mx-auto'>
				<Slider class='carousel gap-x-4 lg:gap-x-5'>
					{posts?.map((post, index) => (
						<Slider.Item
							index={index}
							key={index}
							class='carousel-item flex items-start justify-start group first:pl-5 last:pr-5 lg:first:pl-0 lg:last:pr-0'
						>
							<a
								href={post?.hrefPost}
								class='flex flex-col justify-center items-center max-w-[260px] group-[&:not([data-intersection])]:opacity-50 transition-opacity'
							>
								<Image
									class='h-auto rounded-lg mb-3'
									src={post?.imagePost}
									/*
                                        WAVE: Redundant text
                                        Already understand image by post description
                                    */
									alt=''
									width={260}
									height={165}
								/>
								<p class='text-sm text-neutral-0 font-tt-norms'>
									{post?.descPost}
								</p>
							</a>
						</Slider.Item>
					))}
				</Slider>
				<Slider.PrevButton class='w-10 h-10 hidden lg:flex justify-center items-center absolute top-1/2 -translate-y-1/2 -left-14'>
					<Icon
						class='text-neutral-0 -rotate-180'
						size={20}
						id='ChevronRight'
					/>
				</Slider.PrevButton>
				<Slider.NextButton class='w-10 h-10 hidden lg:flex justify-center items-center absolute top-1/2 -translate-y-1/2 -right-14'>
					<Icon
						class='text-neutral-0'
						size={20}
						id='ChevronRight'
					/>
				</Slider.NextButton>
			</div>
			<SliderJS
				rootId={id}
				infinite
			/>
		</div>
	)
}
