export default function calcOFF(previous: number, now: number) {
	return 100 - ((now / previous) * 100)
}
