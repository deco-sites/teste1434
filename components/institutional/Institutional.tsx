import Sidebar from '$store/components/institutional/Sidebar.tsx'
import { HTMLWidget } from 'apps/admin/widgets.ts'
import RenderHTML from '$store/components/ui/RenderHTML.tsx'
import Breadcrumb from '$store/components/ui/Breadcrumb.tsx'
import { BreadcrumbList } from 'apps/commerce/types.ts'
import { formatUrl, formatUrlToBreadcrumbName } from '$store/sdk/formatUrl.ts'
export interface Props {
	/**
	 * @title Conteúdo da página
	 */
	content: HTMLWidget
	url?: string
}

export function loader({ ...props }: Props, req: Request) {
	const url = req.url
	return { ...props, url }
}

function Institutional({
	content,
	url,
}: Props) {
	const formatedUrl = formatUrl(url!)
	const urlName = formatUrlToBreadcrumbName(url!)

	const itemListElement: BreadcrumbList['itemListElement'] = [
		{
			name: urlName,
			item: url || '',
			'@type': 'ListItem',
			position: 0,
		},
	]

	return (
		<div class='flex flex-col px-3 mx-auto gap-x-[3.125rem] gap-y-[35px] mt-14 mb-10 container'>
			<div class='col-span-2 mt-[12px]'>
				<Breadcrumb
					itemListElement={itemListElement}
				/>
			</div>
			<div class='flex flex-col lg:flex-row gap-x-10'>
				<Sidebar currentUrl={formatedUrl} />
				<div class='text-neutral-0 mb-[50px] w-full space-y-5 prose max-w-none'>
					<RenderHTML
						html={content}
						class='flex flex-col items-center'
					/>
				</div>
			</div>
		</div>
	)
}

export default Institutional
