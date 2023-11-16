import type { HTMLWidget, ImageWidget } from 'apps/admin/widgets.ts'
import { Picture, Source } from 'apps/website/components/Picture.tsx'

export type Image = {
	desktop: {
		src: ImageWidget
		width: number
		height: number
	}
	mobile: {
		src: ImageWidget
		width: number
		height: number
	}
	alt: string
	/**
	 * @description Por questões de performance, caso o componente seja uma das primeiras coisas que o usuário visualiza, ative essa opção.
	 */
	lcp: boolean
}

export type Props = {
	image: Image
	content?: HTMLWidget
}

export default function Banner(
	{ image: { alt, lcp, desktop, mobile }, content }: Props,
) {
	return (
		<div class='relative mt-12' style={{ height: desktop.height }}>
			<Picture preload={lcp}>
				<Source
					media='(max-width: 467px)'
					fetchPriority={lcp ? 'high' : 'auto'}
					src={mobile.src}
					width={mobile.width}
					height={mobile.height}
				/>
				<Source
					media='(min-width: 468px)'
					fetchPriority={lcp ? 'high' : 'auto'}
					src={desktop.src}
					width={desktop.width}
					height={desktop.height}
				/>
				<img
					class='object-cover w-full h-full'
					loading={lcp ? 'eager' : 'lazy'}
					src={desktop.src}
					alt={alt}
				/>
			</Picture>
			{content && (
				<div
					class='px-3 w-full absolute inset-0 z-10 container flex items-center prose'
					dangerouslySetInnerHTML={{ __html: content }}
				>
				</div>
			)}
		</div>
	)
}
