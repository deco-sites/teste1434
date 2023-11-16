export default function LoaderUrl<T>(props: T, req: Request) {
	return {
		...props,
		url: req.url,
	}
}
