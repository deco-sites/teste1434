import Avatar from '$store/components/ui/Avatar.tsx'
import { formatPrice } from '$store/sdk/format.ts'
import type {
	Filter,
	FilterToggle,
	FilterToggleValue,
	ProductListingPage,
} from 'apps/commerce/types.ts'
import { parseRange } from 'apps/commerce/utils/filters.ts'
import Icon from '$store/components/ui/Icon.tsx'
import Select from '$store/components/ui/Select.tsx'
import { IS_BROWSER } from '$fresh/runtime.ts'

interface Props {
	filters: ProductListingPage['filters']
	isAside?: boolean
}

const isToggle = (filter: Filter): filter is FilterToggle => filter['@type'] === 'FilterToggle'

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
	return (
		<a
			href={'?' + Object.entries(Object.fromEntries([
				...new URL('https://www.flamengo.com.br' + url)
					.searchParams.entries(),
			])).map(([k, v]) => `${k}=${v}`).join('&')}
			class='flex items-center gap-2'
		>
			<span class='relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-primary-500 sm:h-4 sm:w-4'>
				{selected && (
					<span class='absolute h-4 w-4 rounded-full bg-primary-500 sm:h-2 sm:w-2' />
				)}
			</span>
			{label}
			{quantity > 0 && (
				<span class='whitespace-nowrap font-light text-primary-500'>({quantity})</span>
			)}
		</a>
	)
}

function FilterValues({ key, values }: FilterToggle) {
	const flexDirection = key === 'tamanho' || key === 'cor' ? 'flex-row' : 'flex-col'

	return (
		<ul class={`flex flex-wrap gap-2 ${flexDirection}`}>
			{values.map((item) => {
				const { url, selected, value } = item

				if (key === 'cor' || key === 'tamanho') {
					return (
						<a href={url}>
							<Avatar content={value} variant={selected ? 'active' : 'default'} />
						</a>
					)
				}

				if (key === 'price') {
					const range = parseRange(item.value)

					return (
						range && (
							<ValueItem
								{...item}
								label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
							/>
						)
					)
				}

				return <ValueItem {...item} />
			})}
		</ul>
	)
}

function Filters({ filters, isAside }: Props) {
	filters = filters.filter((filter) => filter.label.toLowerCase() !== 'categoria').reduce(
		(acc, cur) => {
			if (cur.key === 'price') {
				const values = Array.isArray(cur.values) ? cur.values : [cur.values]

				// @ts-ignore this works
				cur.values = values.map((i) => {
					// @ts-ignore this works
					const [start, end] = i.label.split(':')

					// @ts-ignore this works
					if (!i.label.includes(':')) {
						return i
					}

					// @ts-ignore this works
					i.label = `${formatPrice(start)} - ${formatPrice(end)}`

					return i
				})
			}

			acc.push(cur)

			return acc
		},
		[] as Filter[],
	)

	return (
		<>
			<ul class='flex w-full flex-col justify-center gap-x-6 lg:flex-row'>
				{filters.filter(isToggle).map((filter) => (
					<li class='flex flex-col gap-4'>
						<div class={isAside ? 'mb-4 space-y-1' : 'hidden'}>
							<span>{filter.label}</span>
							<FilterValues {...filter} />
						</div>

						<Select
							class='hidden w-full max-w-[180px] font-light text-neutral-0 lg:block lg:text-xs'
							title={
								<div class='flex w-full items-center justify-end gap-x-3'>
									{filter.label}
									<Icon
										id='ChevronDown'
										size={14}
										class='transition-transform group-checked:rotate-180'
									/>
								</div>
							}
						>
							<Select.Options
								activeId={filter.values[0].value}
								class='!top-[calc(100%+20px)]'
								subClass='
                                    scroll
                                    max-h-[240px] bg-white !w-fit
                                    group-checked:border group-checked:border-[#BABABA80] group-checked:overflow-y-auto
                                '
							>
								<div class='flex flex-col gap-y-2.5 p-2.5'>
									{filter.values.map(
										({ value, label, quantity, selected, url }, i) => (
											<a
												href={'?' + Object.entries(Object.fromEntries([
													...new URL(
														'https://www.flamengo.com.br' + url,
													)
														.searchParams.entries(),
												])).map(([k, v]) => `${k}=${v}`).join('&')}
												role='option'
												id={label}
												class='flex items-center gap-x-2.5 whitespace-nowrap font-light text-neutral-0'
											>
												<span class='relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-primary-500 sm:h-4 sm:w-4'>
													{selected && (
														<span class='absolute h-4 w-4 rounded-full bg-primary-500 sm:h-2 sm:w-2' />
													)}
												</span>
												{`${label} (${quantity})`}
											</a>
										),
									)}
								</div>
							</Select.Options>
						</Select>
					</li>
				))}
			</ul>
			{IS_BROWSER && (
				<a
					href={location.href.replace(/\?.+/, '')}
					class='w-full h-12 bg-primary-500 text-white rounded font-bold grid place-content-center mt-4 lg:hidden'
				>
					Limpar
				</a>
			)}
		</>
	)
}

export default Filters
