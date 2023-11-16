import { SendEventOnLoad } from '$store/components/Analytics.tsx'
import { Layout as cardLayout } from '$store/components/product/ProductCard.tsx'
import Pagination from '$store/components/search/Pagination.tsx'
import SearchResultJS from '$store/components/search/SearchResultJS.tsx'
import Breadcrumb from '$store/components/ui/Breadcrumb.tsx'
import { type Banner, default as CategoryBanner } from '$store/components/ui/CategoryBanner.tsx'
import Icon from '$store/components/ui/Icon.tsx'
import RenderHTML from '$store/components/ui/RenderHTML.tsx'
import SearchControls from '$store/islands/SearchControls.tsx'
import { useOffer } from '$store/sdk/useOffer.ts'
import type { ProductListingPage } from 'apps/commerce/types.ts'
import { mapProductToAnalyticsItem } from 'apps/commerce/utils/productToAnalyticsItem.ts'
import Image from 'apps/website/components/Image.tsx'
import { HTMLWidget, ImageWidget } from 'apps/admin/widgets.ts'
import ProductGallery, { Columns } from '../product/ProductGallery.tsx'
import { default as isMobileLoader } from '$store/loaders/isMobile.ts'

export interface Layout {
	/**
	 * @description Use drawer for mobile like behavior on desktop. Aside for rendering the filters alongside the products
	 */
	variant?: 'aside' | 'drawer'
	/**
	 * @description Number of products per line on grid
	 */
	columns: Columns
}

export interface SEO {
	banner: ImageWidget
	bannerAlt: string
	bottomImage: ImageWidget
	bottomImageAlt: string
	bottomText: HTMLWidget
	/** @description RegExp to enable this banner on the current URL. Use /feminino/* to display this banner on feminino category  */
	matcher: string
}

export interface Props {
	/** @title Integration */
	page: ProductListingPage | null
	SEO?: SEO[]
	layout?: Layout
	cardLayout?: cardLayout
	banners?: Banner[]

	/**
	 * @ignore
	 */
	banner?: Banner
	/**
	 * @ignore
	 */
	url: string
	/**
	 * @ignore
	 */
	isMobile: boolean
}

function NotFound({
	url,
}: Props) {
	const search = new URL(url).searchParams.get('q')

	// deno-lint-ignore no-explicit-any
	const paths = [] as any[]

	paths.push({ name: 'Busca não encontrada', item: '#/' })

	return (
		<>
			<div class='container pt-16 pb-5'>
				<Breadcrumb itemListElement={paths} />
			</div>
			<div class='bg-primary-300/30'>
				<div class='container pb-10 w-[95%]'>
					<div class='flex flex-col w-full items-center justify-center font-tt-norms'>
						<strong class='font-tt-norms text-neutral-0 text-xl lg:text-2xl font-bold mb-6 mt-10 text-center'>
							{search
								? `Não encontramos nenhum resultado para “${search}”`
								: 'Você chegou no fim do tunel, mas encontrou apenas uma página que não existe'}
						</strong>

						<span class='text-sm text-center font-medium'>
							Tente novamente seguindo nossas dicas:
						</span>
						<ul class='flex flex-col items-center font-medium'>
							<li class='list-disc text-sm'>Tente palavras menos específicas.</li>
							<li class='list-disc text-sm'>Tente palavras-chave diferentes.</li>
							<li class='list-disc text-sm'>
								Verifique a ortografia da palavra-chave
							</li>
						</ul>

						<div class='flex items-center gap-x-4 px-3 h-9 mt-6 w-full max-w-[245px] bg-white rounded overflow-hidden'>
							<Icon id='MagnifyingGlass' size={20} class='text-neutral-0 shrink-0' />
							<input
								type='text'
								placeholder='Faça sua busca novamente'
								class='not-found-input text-neutral-0/50 h-full outline-none text-xs w-full'
							/>
						</div>

						<a
							href='/'
							class='flex items-center justify-center font-bold gap-x-3 py-3 text-primary-500 rounded border border-primary-500 transition-colors hover:text-white hover:bg-primary-500 mt-6 w-full max-w-[250px] bg-white'
						>
							<Icon id='BackToHomeArrow' size={20} />
							Voltar para a Home
						</a>
					</div>
					{
						/* {currentSEO && (
                        <div class='container w-[95%] py-11 flex flex-col lg:flex-row gap-4 items-center justify-center'>
                        <Image
						src={currentSEO.bottomImage}
						alt={currentSEO.bottomImageAlt}
						width={620}
						height={200}
                        />
                        <RenderHTML html={currentSEO.bottomText} class='prose [&_*]:m-0' />
                        </div>
                        )} */
					}
					<SearchResultJS />
				</div>
			</div>
		</>
	)
}

const matchUrl = (url: string, path?: string): boolean => {
	if (!path) return false

	const urlObj = new URL(url)
	const pathRegex = new RegExp(`^${path.replace(/\*/g, '.*')}$`)

	if (!pathRegex.test(urlObj.pathname)) {
		return false
	}

	return true
}

function Result({
	page,
	layout,
	cardLayout,
	url,
	SEO = [],
	banner,
	isMobile,
}: Omit<Props, 'page'> & { page: ProductListingPage; isMobile: boolean }) {
	const { products, filters, breadcrumb, pageInfo, sortOptions } = page
	const currentSEO = SEO?.find((item) => matchUrl(url, item.matcher))
	console.log('currentSEO', currentSEO)

	return (
		<>
			{banner && <CategoryBanner banner={banner} />}
			<div class='mb-11 border-b border-[#C8C8C8]/50 pb-8 font-tt-norms'>
				<SearchControls
					sortOptions={sortOptions}
					filters={filters}
					breadcrumb={breadcrumb}
					displayFilter={layout?.variant === 'drawer'}
					url={url}
					pageInfo={pageInfo}
					hasBanner={!!banner}
				/>

				<div class='mx-auto max-w-[1220px] pb-11'>
					<div class='mb-6 mt-2'>
						<Pagination pageInfo={pageInfo} url={url} />
					</div>

					<ProductGallery products={products} layout={cardLayout} isMobile={isMobile} />

					<Pagination pageInfo={pageInfo} url={url} center />
				</div>
				{currentSEO && (
					<div class='border-t border-[#C8C8C8]/50 py-11 bg-[#F2F2F2]'>
						<div class='container font-tt-norms w-[95%] flex flex-col lg:flex-row gap-4 items-center justify-center'>
							<Image
								src={currentSEO.bottomImage}
								alt={currentSEO.bottomImageAlt}
								width={620}
								height={200}
							/>
							<RenderHTML
								html={currentSEO.bottomText}
								class='prose [&_*]:m-0 prose-p:leading-normal prose-p:text-sm prose-p:text-neutral-0/80 prose-headings:text-2xl prose-headings:text-neutral-0 prose-headings:font-bold prose-headings:mb-[5px] prose-headings:font-tt-norms'
							/>
						</div>
					</div>
				)}
			</div>
			<SendEventOnLoad
				event={{
					name: 'view_item_list',
					params: {
						// TODO: get category name from search or cms setting
						item_list_name: '',
						item_list_id: '',
						items: page.products?.map((product) =>
							mapProductToAnalyticsItem({
								...useOffer(product.offers),
								product,
								breadcrumbList: page.breadcrumb,
							})
						),
					},
				}}
			/>
		</>
	)
}

function SearchResult({ page, ...props }: Props) {
	if (!page || !page?.products || page?.products.length === 0) {
		return <NotFound {...props} page={page} />
	}

	return <Result {...props} page={page} />
}

export const loader = ({ banners = [], url, ...rest }: Props, req: Request) => {
	const banner = banners.find(({ matcher }) =>
		new URLPattern({ pathname: matcher }).test(req.url)
	)

	return { banner, url: req.url, ...isMobileLoader(rest, req) }
}

export default SearchResult
