import ImageSlider from '$store/components/quemsomos/ImageSlider.tsx'
import Breadcrumb from '$store/components/ui/Breadcrumb.tsx'
import Icon, { type AvailableIcons } from '$store/components/ui/Icon.tsx'
import VideoModal from '$store/islands/QuemSomos/VideoModal.tsx'
import VideoModalButton from '$store/islands/QuemSomos/VideoModalButton.tsx'
import { HTMLWidget, ImageWidget } from 'apps/admin/widgets.ts'
import Image from 'apps/website/components/Image.tsx'

function DifferenceCard({ title, description, icon }: Difference) {
	return (
		<div class='w-full flex flex-row md:flex-col gap-5 group'>
			<div class='flex flex-col md:flex-row items-center text-white'>
				<div class='w-16 h-16 bg-primary-500 rounded-full flex justify-center items-center shrink-0'>
					<Icon id={icon} size={33} />
				</div>
				<div
					class='md:hidden h-full w-[1px] group-last:hidden'
					style={{
						backgroundImage:
							'repeating-linear-gradient(to bottom, transparent, transparent 5px, rgb(0 128 251) 5px, rgb(0 128 251) 10px)',
					}}
				/>
				<div
					class='hidden md:block w-full h-[1px] group-last:hidden'
					style={{
						backgroundImage:
							'repeating-linear-gradient(to right, transparent, transparent 5px, rgb(0 128 251) 5px, rgb(0 128 251) 10px)',
					}}
				/>
				{/* <hr class="w-full border-dashed border-primary-500 border" /> */}
			</div>
			<div class='max-w-[100%] md:max-w-[90%] lg:max-w-[80%] text-neutral-600 space-y-2 mb-6 md:mb-0 group-last:mb-0'>
				<h3 class='text-xl'>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	)
}

/**
 * @titleBy title
 */
export type Difference = {
	title: string
	description: string
	icon: AvailableIcons
}

export type YoutubeVideo = {
	url: string
	thumbnail: {
		src: ImageWidget
		width: number
		height: number
		alt: string
	}
}

export type AboutSection = {
	title: string
	content: HTMLWidget
}

/**
 * @titleBy alt
 */
export type CarouselItem = {
	src: ImageWidget
	alt: string
}

export type Props = {
	about: AboutSection
	carousel: CarouselItem[]
	differences: Difference[]
	video: YoutubeVideo
	address: string
	contact: HTMLWidget
}

export default function QuemSomos(
	{
		about: { title, content },
		carousel,
		differences,
		video: { thumbnail, url: videoUrl },
		address,
		contact,
	}: Props,
) {
	return (
		<>
			<div class='mt-16 mb-6 lg:my-16 px-3 text-neutral-600'>
				<div class='container flex flex-col gap-6 md:gap-12'>
					<Breadcrumb
						itemListElement={[{
							'@type': 'ListItem',
							name: 'Quem Somos',
							item: '/institutional/quem-somos',
							position: 0,
						}]}
					/>
					<div class='flex flex-col gap-6 lg:flex-row'>
						<div class='space-y-8 w-full flex flex-col items-center lg:items-start'>
							<h2 class='text-xl underline underline-offset-8 font-bold'>{title}</h2>
							<div
								dangerouslySetInnerHTML={{ __html: content }}
								class='prose'
							/>
						</div>
						<div class='flex justify-center items-center h-[350px] sm:h-[400px] w-full lg:w-1/2 select-none'>
							<ImageSlider items={carousel} />
						</div>
					</div>
				</div>
			</div>
			<div class='bg-neutral-4 px-3 mt-6 lg:mt-24'>
				<div class='container grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 pt-8'>
					{differences.map((props) => <DifferenceCard {...props} />)}
				</div>
			</div>
			<div class='py-10'>
				<div class='container'>
					<VideoModalButton
						aria-label='Ver vídeo'
						class='relative w-full flex items-center justify-center h-[444px]'
					>
						<Image
							class='object-cover h-full'
							src={thumbnail.src}
							width={thumbnail.width}
							height={thumbnail.height}
							alt={thumbnail.alt}
						/>
						<Icon
							id='QuemSomosPlay'
							size={76}
							class='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 fill-white'
						/>
					</VideoModalButton>
					<VideoModal url={videoUrl} />
				</div>
			</div>
			<div class='py-10 flex justify-center items-center mb-10'>
				<div class='max-w-[1012px] w-full flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12'>
					<div class='w-full md:w-1/2'>
						<iframe
							title='Veja nosso endereço'
							loading='lazy'
							width='100%'
							height='310'
							frameBorder='0'
							scrolling='no'
							marginHeight={0}
							marginWidth={0}
							src={`https://maps.google.com/maps?width=100%25&height=310&hl=pt-BR&q=${
								encodeURI(address)
							}+(Vip%20Capas)&t=&z=17&ie=UTF8&iwloc=B&output=embed`}
						>
						</iframe>
					</div>
					<div class='space-y-3 w-full px-3 md:px-0 md:w-1/2 font-tt-norms'>
						<p class='text-xl'>Contatos</p>
						<div
							class='prose text-neutral-0'
							dangerouslySetInnerHTML={{ __html: contact }}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
