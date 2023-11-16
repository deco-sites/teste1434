import { ProductListingPage } from 'apps/commerce/types.ts'
import Select from '$store/components/ui/Select.tsx'
import Icon from '$store/components/ui/Icon.tsx'

const SORT_QUERY_PARAM = 'sort'

// TODO: Replace with "search utils"
const applySort = (v: string, url: string) => {
	const theUrl = new URL(url)
	const urlSearchParams = new URLSearchParams(theUrl.search)

	urlSearchParams.set(SORT_QUERY_PARAM, v)
	theUrl.search = urlSearchParams.toString()

	return theUrl.toString()
}

export type Props = Pick<ProductListingPage, 'sortOptions'> & {
	url: string
}

// TODO: move this to the loader
const portugueseMappings = {
	'relevance:desc': 'Relevância',
	'price:desc': 'Maior Preço',
	'price:asc': 'Menor Preço',
	'orders:desc': 'Mais vendidos',
	'name:desc': 'Nome de Z a A',
	'name:asc': 'Nome de A a Z',
	'release:desc': 'Relevância - Decrescente',
	'discount:desc': 'Maior desconto',
}

function Sort({ sortOptions, url }: Props) {
	const sort = new URLSearchParams(new URL(url).search).get(SORT_QUERY_PARAM) ?? ''
	const index = sortOptions.findIndex(({ value }) => value === sort)

	const ss = sortOptions
		.map(({ value, label }) => ({
			value,
			label: portugueseMappings[label as keyof typeof portugueseMappings] ?? label,
		}))
		.filter(({ label }) => label)

	return (
		<Select
			class='hidden w-[144px] text-xs font-light text-neutral-0 sm:block'
			title={
				<div class='flex w-full items-center justify-end gap-x-3'>
					{portugueseMappings[
						(sortOptions.find(({ value }) => value === sort)
							?.label as keyof typeof portugueseMappings) ??
							'relevance:desc'
					]}
					<Icon
						id='ChevronDown'
						size={14}
						class='transition-transform group-checked:rotate-180'
					/>
				</div>
			}
		>
			<Select.Options
				activeId={ss[index]?.label ?? ''}
				class='!top-[calc(100%+20px)]'
				subClass='
                    scroll
                    max-h-[120px] bg-white
                    group-checked:border group-checked:border-[#BABABA80] group-checked:overflow-y-auto
                '
			>
				<div class='flex flex-col gap-y-2.5 p-2.5'>
					{ss.map(({ value, label }, i) => (
						<a
							href={applySort(value, url)}
							key={label}
							role='option'
							id={label}
							class='flex items-center gap-x-2.5 text-xs font-light text-neutral-0'
						>
							<span class='relative grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-primary-500'>
								{index === i && (
									<span class='absolute h-2 w-2 rounded-full bg-primary-500' />
								)}
							</span>
							{label}
						</a>
					))}
				</div>
			</Select.Options>
		</Select>
	)
}

export default Sort
