import IsMobileLoader from '$store/loaders/isMobile.ts'
export { default } from '$store/components/product/ProductShelf.tsx'
import type { Props } from '$store/components/product/ProductShelf.tsx'

export function loader(props: Props, req: Request) {
	return IsMobileLoader(props, req)
}
