import isMobileLoader from '$store/loaders/isMobile.ts'
export { default } from '$store/components/footer/Footer.tsx'
import type { Props } from '$store/components/footer/Footer.tsx'

export function loader(props: Props, req: Request) {
	return isMobileLoader(props, req)
}
