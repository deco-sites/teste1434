import isMobileLoader from '$store/loaders/isMobile.ts'
export { default } from '$store/components/ui/TwoBanners.tsx'
import type { Props } from '$store/components/ui/TwoBanners.tsx'

export function loader(props: Props, req: Request) {
	return isMobileLoader(props, req)
}
