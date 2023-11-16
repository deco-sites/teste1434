export { default } from '$store/components/header/Header.tsx'
import type { Props } from '$store/components/header/Header.tsx'
import isMobileLoader from '$store/loaders/isMobile.ts'

export function loader(props: Props, req: Request) {
	return {
		...props,
		url: req.url,
		isMobile: isMobileLoader(props, req).isMobile,
	}
}
