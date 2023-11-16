import LoaderUrl from '$store/loaders/url.ts'
export { default } from '$store/components/product/ProductBuyTogether.tsx'
import type { Props } from '$store/components/product/ProductBuyTogether.tsx'

export function loader(props: Props, req: Request) {
	return LoaderUrl(props, req)
}
