export default function v<T>(...fns: ((a: T) => string | false)[]) {
	return (a: T) => {
		for (const fn of fns) {
			const r = fn(a)

			if (r) return r as string
		}
	}
}
