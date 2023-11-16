import Icon from '$store/components/ui/Icon.tsx'
import { ProductListingPage } from 'apps/commerce/types.ts'

export interface Props {
	pageInfo: ProductListingPage['pageInfo']
	url: string
	class?: string
	center?: boolean
}

class Ellipsis {}

function Pagination({ pageInfo, class: _class = '', center, url: _url }: Props) {
	const totalPages = Math.floor(pageInfo.records! / pageInfo.recordPerPage!)
	const maxPageNumbers = 4
	const allPages = Array(totalPages + 1)
		.fill(0)
		.map((_, i) => i + 1)

	let paginations = [] as (number | Ellipsis)[]

	const currentPageIndex = pageInfo.currentPage - 1
	const lastPageIndex = currentPageIndex + maxPageNumbers - 1
	const url = new URL(_url)
	const query = url.searchParams.get('q')

	if (totalPages - pageInfo.currentPage <= maxPageNumbers) {
		// [6, 7, 8, 9, 10]
		paginations = allPages.slice(
			Math.max(0, currentPageIndex - 2),
			Math.min(totalPages + 1, currentPageIndex + 3),
		)
	} else {
		// [1, 2, 3, 4, ..., 10]
		paginations = [
			...allPages.slice(Math.max(0, currentPageIndex - 2), lastPageIndex),
			Ellipsis,
			allPages.at(-1)!,
		]
	}

	return (
		<div
			class={`flex items-center text-black ${_class} ${
				center ? 'justify-center' : 'justify-center lg:justify-end'
			}`}
		>
			{pageInfo.previousPage && (
				<a
					aria-label='previous page link'
					rel='prev'
					href={pageInfo.previousPage ?? '#'}
					class='flex items-center justify-center gap-x-1 text-sm font-light text-neutral-0 md:gap-x-5'
				>
					<span class='group grid h-11 w-11 cursor-pointer place-items-center transition-colors duration-300 hover:bg-primary-500'>
						<Icon
							size={16}
							id='ChevronRight'
							strokeWidth={3}
							class='rotate-180 transition-colors group-hover:text-white'
						/>
					</span>
					Anterior
				</a>
			)}
			<div class='mx-2 flex items-center'>
				{paginations.map((i) =>
					i === Ellipsis ? <span class='text-primary-500'>...</span> : (
						<a
							aria-label={`page ${i}`}
							href={query
								? `${url.origin}${url.pathname}?q=${query}&page=${i}`
								: `?page=${i}`}
							data-current={pageInfo.currentPage === i}
							class='px-2 text-xs font-light text-neutral-0 data-[current=true]:text-lg data-[current=true]:font-bold data-[current=true]:text-primary-500'
						>
							{i}
						</a>
					)
				)}
			</div>
			{pageInfo.nextPage && (
				<a
					aria-label='next page link'
					rel='next'
					href={pageInfo.nextPage ?? '#'}
					class='flex items-center justify-center gap-x-1 text-sm font-light text-neutral-0 md:gap-x-5'
				>
					Próximo
					<span class='group grid h-11 w-11 cursor-pointer place-items-center transition-colors duration-300 hover:bg-primary-500'>
						<Icon
							size={16}
							id='ChevronRight'
							strokeWidth={3}
							class='transition-colors group-hover:text-white'
						/>
					</span>
				</a>
			)}
		</div>
	)
}

export default Pagination
