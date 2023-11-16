import NewsletterFooter from '../../components/footer/Newsletter.tsx'

export interface Props {
	title?: string
}

export default function Newsletter(props: Props) {
	return (
		<div class='bg-[#f2f2f2]'>
			<div class='flex flex-col 2xl:flex-row rounded p-4 gap-6 pt-4 pb-7 xl:gap-12'>
				<div class='flex flex-col justify-center items-center 2xl:items-start xl:justify-between gap-y-5 lg:px-10 xl:px-0 xl:w-full 2xl:flex-row'>
					<NewsletterFooter title={props.title} />
				</div>
			</div>
		</div>
	)
}
