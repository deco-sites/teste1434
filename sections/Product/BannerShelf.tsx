import isMobileLoader from '$store/loaders/isMobile.ts'
export { default } from '$store/components/product/BannerShelf.tsx'
import type { Props } from '$store/components/product/BannerShelf.tsx'

export function loader(props: Props, req: Request) {
	return isMobileLoader(props, req)
}
