import MatchDevice from 'deco/matchers/MatchDevice.ts'

export default function IsMobileLoader<T>({ ...props }: T, req: Request) {
	const isMobile = MatchDevice({ mobile: true, tablet: true }, { siteId: 0, request: req })
	return { ...props, isMobile }
}
