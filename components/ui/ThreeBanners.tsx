import Image from 'apps/website/components/Image.tsx'
import type { ImageWidget } from 'apps/admin/widgets.ts'

export interface Props {
	/**
	 * @title Banner da esquerda
	 */
	bannerLeft: ImageProps

	/**
	 * @title Banner da direira superior
	 */
	bannerRightTop: ImageProps

	/**
	 * @title Banner da direira inferior
	 */
	bannerRightBottom: ImageProps
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

function ThreeBanners(
	{ bannerLeft, bannerRightTop, bannerRightBottom }: Props,
) {
	return (
		<div class='container px-4 lg:px-0'>
			<div class='container-center gap-6 flex flex-col md:flex-row px-0 w-full justify-center'>
				<div class='flex flex-col lg:flex-row gap-[7px] xl:gap-[28px]'>
					<a
						href={bannerLeft.href}
						class='flex items-center relative after:w-full after:h-full after:bg-[#BB7C39] 
            after:absolute after:mix-blend-multiply after:opacity-0 hover:after:opacity-10 
            after:transition-all after:rounded-[5px]'
					>
						<Image
							class='hidden md:block w-[614px] h-[629px]'
							src={bannerLeft.desktopSrc}
							alt={bannerLeft.alt}
							width={614}
							height={629}
						/>
						<Image
							class='w-full h-auto rounded-[7px] block md:hidden'
							src={bannerLeft.mobileSrc}
							alt={bannerLeft.alt}
							width={376}
							height={300}
						/>
					</a>
					<div class='flex flex-col gap-[7px] xl:gap-[28px]'>
						<div class='flex items-center relative after:w-full after:h-full after:bg-[#BB7C39] 
					after:absolute after:mix-blend-multiply after:opacity-0 hover:after:opacity-10 
					after:transition-all after:rounded-[5px]'>
							<Image
								class='hidden md:block md:w-full lg:w-[575px] h-[300px] rounded-[5px]'
								src={bannerRightTop.desktopSrc}
								alt={bannerRightTop.alt}
								width={575}
								height={300}
							/>
							<Image
								class='w-full h-auto rounded-[7px] block md:hidden'
								src={bannerRightTop.mobileSrc}
								alt={bannerRightTop.alt}
								width={376}
								height={300}
							/>
							<a
								href={bannerRightTop.href}
								class=' absolute z-10 bottom-[10px] left-[12px] md:bottom-[17px] md:left-[14px] lg:left-[12px] text-primary-500 font-bold
								 text-xs lg:text-base w-[38%] md:w-[34%] py-[10px] lg:py-[6px] rounded-[5px] bg-white 
								 border border-primary-500 text-center cursor-pointer hover:bg-primary-500 hover:text-white transition-all ease-in-out duration-[400ms]'
							>
								Quero conferir!
							</a>
						</div>
						<div class='flex items-center relative after:w-full after:h-full after:bg-[#BB7C39] 
					after:absolute after:mix-blend-multiply after:opacity-0 hover:after:opacity-10 
					after:transition-all after:rounded-[5px]'>
							<Image
								class='hidden md:block md:w-full lg:w-[575px] h-[300px] rounded-[5px]'
								src={bannerRightBottom.desktopSrc}
								alt={bannerRightBottom.alt}
								width={575}
								height={300}
							/>
							<Image
								class='w-full h-auto rounded-[7px] block md:hidden'
								src={bannerRightBottom.mobileSrc}
								alt={bannerRightBottom.alt}
								width={376}
								height={300}
							/>
							<a
								href={bannerRightBottom.href}
								class=' absolute z-10 bottom-[10px] left-[12px] md:bottom-[16px] md:left-[14px]  lg:left-[12px] text-white font-bold
								 text-xs lg:text-base w-[38%] md:w-[34%] py-[10px] lg:py-[6px] rounded-[5px] bg-primary-500 
								 border border-primary-500 text-center cursor-pointer hover:bg-white hover:text-primary-500 transition-all ease-in-out duration-[400ms]'
							>
								Quero conferir!
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ThreeBanners
