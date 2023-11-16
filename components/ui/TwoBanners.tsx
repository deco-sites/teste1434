import Image from 'apps/website/components/Image.tsx'
import type { ImageWidget } from 'apps/admin/widgets.ts'
import Button from '$store/components/ui/Button.tsx'

export interface Props {
	/**
	 * @title Banner da esquerda
	 */
	bannerLeft: ImageProps

	/**
	 * @title Banner da direira
	 */
	bannerRight: ImageProps

	/**
	 * @ignore
	 */
	isMobile: boolean
}

export interface ImageProps {
	/**
	 * @title Imagem Desktop
	 */
	desktopSrc: ImageWidget
	/**
	 * @title Imagem Mobile
	 */
	mobileSrc: ImageWidget
	/**
	 * @title Texto alternativo
	 */
	alt?: string
	/**
	 * @title Link para onde o banner redireciona
	 */
	href?: string
}

function TwoBanners(
	{ bannerLeft, bannerRight, isMobile }: Props,
) {
	return (
		<div class='container container-center xl:px-0 w-full px-16'>
			<div class='gap-3 xl:gap-6 flex flex-col md:flex-row px-0 w-full'>
				<div class='
            flex items-center relative w-full after:w-full after:h-full after:bg-[#BB7C39] 
            after:absolute after:mix-blend-multiply after:opacity-0 hover:after:opacity-10 
            after:transition-all after:rounded-[5px] 
          '>
					{isMobile
						? (
							<>
								<Image
									class='w-full h-auto rounded-[7px] block'
									src={bannerLeft.mobileSrc}
									alt={bannerLeft.alt}
									width={280}
									height={300}
								/>
								<a
									href={bannerLeft.href}
									class='absolute bottom-[3.5%] md:bottom-[3%] left-[25%] text-primary-500 font-bold text-xs sm:text-xl w-[51%] 
						py-[8px] sm:py-[10px] rounded-[5px] bg-white border border-primary-500 text-center cursor-pointer hover:bg-primary-500 hover:text-white
						transition-all ease-in-out duration-[400ms]
						'
								>
									Quero conferir!
								</a>
							</>
						)
						: (
							<>
								<Image
									class='w-full h-auto rounded-[5px]'
									src={bannerLeft.desktopSrc}
									alt={bannerLeft.alt}
									width={595}
									height={300}
									loading='eager'
								/>
								<a
									href={bannerLeft.href}
									class='hidden md:block absolute z-10 bottom-[20%] xl:bottom-[62px] left-[9%] text-primary-500 font-bold text-xs lg:text-base w-[33%] 
						py-[5px] rounded-[5px] bg-white border border-primary-500 text-center cursor-pointer hover:bg-primary-500 hover:text-white 
						transition-all ease-in-out duration-[400ms]'
								>
									Quero conferir!
								</a>
							</>
						)}
				</div>

				<div
					href={bannerRight.href}
					class='flex items-center relative w-full after:w-full after:h-full after:bg-[#BB7C39] 
					after:absolute after:mix-blend-multiply after:opacity-0 hover:after:opacity-10 
					after:transition-all after:rounded-[5px]'
				>
					{isMobile
						? (
							<>
								<Image
									class='w-full h-auto rounded-[7px] block'
									src={bannerRight.mobileSrc}
									alt={bannerRight.alt}
									width={280}
									height={300}
								/>
								<a
									href={bannerLeft.href}
									class='absolute z-10 bottom-[3.5%] md:bottom-[3%] left-[24.8%] text-white font-bold text-xs sm:text-xl w-[51%] 
						py-[8px] sm:py-[10px] rounded-[5px] bg-primary-500 border border-primary-600 text-center cursor-pointer hover:bg-white hover:text-primary-600
						transition-all ease-in-out duration-[400ms]'
								>
									Quero conferir!
								</a>
							</>
						)
						: (
							<>
								<Image
									class='w-full h-auto rounded-[5px]'
									src={bannerRight.desktopSrc}
									alt={bannerRight.alt}
									width={595}
									height={300}
									loading='eager'
								/>
								<a
									href={bannerLeft.href}
									class='hidden md:block absolute z-10 bottom-[20%] xl:bottom-[61px] left-[9%] text-white font-bold text-xs lg:text-base w-[33%] 
						py-[5.5px] rounded-[5px] bg-primary-500 border border-primary-600 text-center cursor-pointer hover:bg-white hover:text-primary-600
						transition-all ease-in-out duration-[400ms]'
								>
									Quero conferir!
								</a>
							</>
						)}
				</div>
			</div>
		</div>
	)
}

export default TwoBanners
