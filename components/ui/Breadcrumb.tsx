import type { BreadcrumbList } from 'apps/commerce/types.ts'
import Icon from '$store/components/ui/Icon.tsx'
import { capitalize } from '$store/sdk/capitalize.ts'

interface Props {
	itemListElement: BreadcrumbList['itemListElement']
	pageProduct?: boolean
}

function Breadcrumb({ itemListElement = [], pageProduct }: Props) {
	const items = [{ name: 'Home', item: '/' }, ...itemListElement]

	return (
		<ul
			data-page-product={pageProduct}
			class='data-[page-product=true]:inline-flex data-[page-product=true]:w-full data-[page-product=true]:whitespace-nowrap flex items-center text-xs gap-x-0.5 text-neutral-0 font-tt-norms data-[page-product=true]:truncate group/breadcrumb'
		>
			{items
				.filter(({ name, item }) => name && item)
				.map(({ name, item }, i) => (
					<>
						{i
							? (
								<Icon
									class={'group-data-[page-product=true]/breadcrumb:min-w-[14px]'}
									id='ChevronRight'
									width={14}
									height={20}
									strokeWidth={2}
								/>
							)
							: null}
						<li>
							<a
								href={item}
								class={i === items.length - 1 ? 'font-bold' : 'font-light'}
							>
								{capitalize(name!)}
							</a>
						</li>
					</>
				))}
		</ul>
	)
}

export default Breadcrumb
