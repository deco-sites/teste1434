import Icon from '$store/components/ui/Icon.tsx'
import Select from '$store/components/ui/Select.tsx'

const links = [
	{
		id: 1,
		url: '/institutional/quem-somos',
		title: 'Quem somos',
	},
	{
		id: 2,
		url: '/institutional/FAQ',
		title: 'FAQ',
	},
	{
		id: 3,
		url: '/institutional/fale-conosco',
		title: 'Fale conosco',
	},
	{
		id: 4,
		url: '/institutional/contato',
		title: 'Contato',
	},
	{
		id: 5,
		url: '/institutional/politica-de-entrega',
		title: 'Política de entrega',
	},
	{
		id: 6,
		url: '/institutional/politica-de-privacidade',
		title: 'Política de privacidade',
	},
	{
		id: 7,
		url: '/institutional/politica-de-frete',
		title: 'Política de frete',
	},
	{
		id: 8,
		url: '/institutional/formas-de-pagamento',
		title: 'Formas de pagamento',
	},
	{
		id: 9,
		url: '/institutional/troca-e-devolucoes',
		title: 'Trocas e devoluções',
	},
]

export interface SidebarProps {
	/**
	 * @title Current URL
	 */
	currentUrl: string
}

function Sidebar({ currentUrl }: SidebarProps) {
	const currentInstitutional = links.find((link) => link.url === '/institutional/' + currentUrl)
	return (
		<>
			<aside className='hidden w-full max-w-xs lg:flex flex-col gap-5 text-black'>
				<h2 className='text-[28px] font-bold'>NAVEGUE</h2>
				<ul className='space-y-2'>
					{links.map((link) => (
						<li
							key={link.id}
							className={`group py-2 px-[13px] max-h-[42px] flex justify-start items-center border border-primary-200 cursor-pointer relative overflow-hidden ${
								'/institutional/' + currentUrl === link.url
									? 'border-primary-500'
									: 'border-[#ECECEC]'
							}`}
						>
							<span
								className={`absolute top-0 left-0 h-full rounded-e-full w-[4px] block bg-primary-500 ${
									'/institutional/' + currentUrl === link.url
										? '-translate-x-0'
										: '-translate-x-2'
								}  group-hover:translate-x-0 transition duration-200 ease-in-out`}
							>
							</span>
							<a
								href={link.url}
								className='block transform group-hover:translate-x-2 transition duration-200 ease-in-out font-semibold text-lg text-primary-500'
							>
								{link.title}
							</a>
						</li>
					))}
				</ul>
			</aside>
			<Select
				class='lg:hidden text-xs font-light text-primary-500 h-10 border-2 border-primary-200 rounded-md max-w-md mx-auto px-8 mb-10'
				title={
					<div class='flex w-full h-full items-center justify-center gap-x-3 text-xl font-bold whitespace-nowrap line-clamp-1 text-ellipsis'>
						{currentInstitutional?.title}
						<Icon
							id='ChevronDown'
							size={14}
							class='transition-transform group-focus-within:rotate-180'
						/>
					</div>
				}
			>
				<Select.Options
					activeId={''}
					class='top-full'
					subClass='
                        scroll
                        max-h-[160px] bg-white
                        group-focus-within:border-2 group-focus-within:border-primary-200 group-focus-within:overflow-y-auto
                    '
				>
					<div class='flex flex-col gap-y-2.5 p-2.5 text-xl font-bold'>
						{links.map((link) => (
							<a
								href={link.url}
								class='text-primary-400'
							>
								{link.title}
							</a>
						))}
					</div>
				</Select.Options>
			</Select>
		</>
	)
}

export default Sidebar
