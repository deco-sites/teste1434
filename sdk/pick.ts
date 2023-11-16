export function pick<T extends object, K extends keyof T>(o: T, ...keys: K[]): Pick<T, K> {
	return Object.entries(o).reduce((acc, [k, v]) => {
		if (keys.includes(k as K)) {
			acc[k as K] = v
		}

		return acc
	}, {} as Pick<T, K>)
}
