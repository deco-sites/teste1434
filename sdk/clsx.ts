export default function clsx(...inputs: (string | boolean | undefined)[]) {
	return inputs.filter(Boolean).join(' ')
}
