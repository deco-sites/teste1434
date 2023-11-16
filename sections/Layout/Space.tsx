import isMobileLoader from '$store/loaders/isMobile.ts'

export function loader(props: Props, req: Request) {
	return {
		...props,
		isMobile: isMobileLoader(props, req).isMobile,
	}
}

export interface Props {
	/**
	 * @title Espaçamento
	 * @description Tamanho do espaçamento, e.g. 100px
	 */
	size: string
	/**
	 * @title Espaçamento no mobile
	 * @description Tamanho do espaçamento, e.g. 100px
	 */
	sizeMobile: string
	/**
	 * @ignore
	 */
	isMobile: boolean
}

export default function Space(
	{ size, sizeMobile, isMobile }: Props,
) {
	if (isMobile) {
		return <div style={{ height: sizeMobile, width: '100%' }} />
	}

	return <div style={{ height: size, width: '100%' }} />
}
