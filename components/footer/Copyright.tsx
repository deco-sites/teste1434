export interface CopyrightProps {
	textCopyright: string
	infoCompany: string
}

export default function Copyright(
	{ textCopyright, infoCompany }: CopyrightProps,
) {
	return (
		<div class='bg-neutral-4 flex flex-col items-center pt-2.5 pb-[13px] px-[50px] font-light'>
			<p class='text-center text-neutral-0 text-xs font-tt-norms'>
				{textCopyright}
			</p>
			<p class='text-center text-neutral-0 text-xs font-tt-norms'>
				{infoCompany}
			</p>
		</div>
	)
}
