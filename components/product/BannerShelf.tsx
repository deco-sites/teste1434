import type { ImageWidget } from 'apps/admin/widgets.ts'
import type { Product } from 'apps/commerce/types.ts'
import Image from 'apps/website/components/Image.tsx'

import ProductCard from '$store/components/product/ProductCard.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import Slider from '$store/components/ui/Slider.tsx'
import SliderJS from '$store/components/ui/SliderJS.tsx'
import { useId } from 'preact/hooks'
import { sample } from 'std/collections/sample.ts'

export interface Props {
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
	products: Product[] | null
	title?: string

	/**
	 * @ignore
	 */
	isMobile: boolean
}

function BannerShelf(
	{ href = '#', mobileSrc, desktopSrc, alt = '', products, title = '', isMobile }: Props,
) {
	const id = useId()

	if (!products?.length) return null

	const prod1 = sample(products)!
	let prod2 = sample(products)!

	while (prod2.url === prod1.url) {
		prod2 = sample(products)!
	}

	products = [prod1, prod2]

	return (
		<div class='container font-tt-norms' id={id}>
			<div class='items-center lg:items-start gap-5 lg:gap-24 flex-col lg:flex-row flex px-0'>
				{/* Banner */}
				<div
					aria-label='Imagem'
					class='flex items-center shrink-0'
				>
					<div class='hidden lg:flex relative after:rounded-[5px]'>
						<Image
							class='hidden lg:flex w-[415px] h-auto'
							src={desktopSrc}
							alt={alt}
							width={415}
							height={535}
						/>
						<a
							href={href}
							class='absolute bottom-[21px] right-[23px] flex items-center font-bold text-primary-500
              border border-primary-500 rounded-[5px] bg-white px-[21px] py-[10px] gap-3 hover:bg-primary-500
              hover:text-white transition-all ease-in-out duration-[400ms]'
						>
							<p>
								Conheça toda a coleção
							</p>
							<Icon id='ArrowRight' size={20} />
						</a>
					</div>
					<div class='block lg:hidden relative'>
						<Image
							src={mobileSrc}
							alt={alt}
							width={768}
							height={425}
						/>
					</div>
				</div>

				{/* Shelf */}
				<div id={id} class='container grid place-content-center'>
					<Slider class='carousel carousel-center gap-x-4 lg:gap-x-16 max-w-3xl w-full lg:max-w-none'>
						{products?.map((product, index) => (
							<Slider.Item
								index={index}
								class='carousel-item group first:pl-5 last:pr-5 lg:first:pl-0 lg:last:pr-0'
							>
								<ProductCard
									product={product}
									itemListName={title}
									isMobile={isMobile}
								/>
							</Slider.Item>
						))}
					</Slider>

					<SliderJS rootId={id} />
				</div>
			</div>
		</div>
	)
}

export default BannerShelf
