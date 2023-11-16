import { IS_BROWSER } from '$fresh/runtime.ts'
import { useId } from '$store/sdk/useId.ts'
import { PropsWithChildren } from 'preact/compat'

type Props = PropsWithChildren & {
	open?: boolean
}

export default function PureModal({ children, open }: Props) {
	const id = useId()

	if (IS_BROWSER) {
		const dialog = document.getElementById(id) as HTMLDialogElement

		if (dialog) {
			if (open) {
				dialog.showModal()
			} else {
				dialog.close()
			}
		}
	}

	return (
		<dialog id={id} class='backdrop:bg-black/50'>
			<div onClick={(e) => e.stopPropagation()}>{children}</div>
		</dialog>
	)
}
