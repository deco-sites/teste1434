import Image from 'apps/website/components/Image.tsx'
import { HTMLWidget } from 'apps/admin/widgets.ts'
import RenderHTML from '$store/components/ui/RenderHTML.tsx'

export interface INavItem {
	label?: string
	href?: string
	seeMore?: string
	children?: INavItem[]
	image?: { src?: string; alt?: string }
	textBelowImage?: HTMLWidget
}

function NavItem({ children, label, seeMore, image, textBelowImage }: INavItem) {
	return (
		<div class='fixed w-screen text-neutral-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-white z-50 flex gap-4 left-1/2 top-[148px] group-data-[micro-header="true"]/header:top-[100px] -translate-x-1/2 transition-all p-6 min-h-[340px] max-h-[340px] rounded-bl-lg rounded-br-lg shadow-md overflow-hidden pr-3 min-w-[140px]'>
			<div class='flex w-full container max-w-[1138px] gap-[80px]'>
				<ul class='grid grid-cols-4 gap-[57px] items-start overflow-auto w-full'>
					{children!.map(({ children, href, label }, i) => (
						<li class=''>
							{label &&
								(
									<div>
										<a
											class='hover:underline pt-2 pb-1 flex items-center font-bold text-sm border-b border-b-neutral-3/50'
											href={href}
										>
											<span>{label}</span>
										</a>
										<div class='bg-neutral-4 w-full h-[1px] mb-[14px]' />
									</div>
								)}

							<ul
								class={`flex flex-col gap-1 ${label ? '' : 'mt-[48px]'}`}
							>
								{children?.map((leaf) => (
									<li>
										<a
											class='hover:underline text-xs'
											href={leaf.href}
											aria-label={leaf.href}
										>
											<span
												class={`text-xs ${
													leaf.label === 'Ver mais' ? 'font-bold' : ''
												}`}
											>
												{leaf.label}
											</span>
										</a>
									</li>
								))}
								{seeMore && i === children!.length - 1 && (
									<li>
										<a
											href={seeMore}
											class='font-bold text-xs hover:underline block mt-1'
										>
											Ver mais
										</a>
									</li>
								)}
							</ul>
						</li>
					))}
				</ul>
				{image && (
					<div class='max-w-[300px] max-h-[250px] w-full h-full'>
						<Image
							src={image.src!}
							alt={image.alt ?? label}
							width={300}
							height={250}
						/>
						{textBelowImage && (
							<RenderHTML
								html={textBelowImage}
								class='mt-4 grid place-content-center'
							/>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default NavItem
