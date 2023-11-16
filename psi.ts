import { expandGlob } from 'https://deno.land/std@0.201.0/fs/expand_glob.ts'

try {
	await Deno.remove('.lighthouseci', { recursive: true })
} catch { /* ignore */ }
try {
	await Deno.remove('results', { recursive: true })
} catch { /* ignore */ }

function computeMultiplierMessages(benchmarkIndex: number) {
	if (!Number.isFinite(benchmarkIndex)) return undefined
	if (benchmarkIndex >= 1300) {
		// 2000 = 6x slowdown
		// 1766 = 5x slowdown
		// 1533 = 4x slowdown
		// 1300 = 3x slowdown
		const excess = (benchmarkIndex - 1300) / 233
		const multiplier = 3 + excess
		const confidenceRange = Math.min(Math.max(excess, 1.5, multiplier * 0.3))
		const lowerBound = multiplier - confidenceRange / 2
		const upperBound = multiplier + confidenceRange / 2
		return { multiplier, range: [lowerBound, upperBound] }
	} else if (benchmarkIndex >= 800) {
		// 1300 = 3x slowdown
		// 800 = 2x slowdown
		const excess = (benchmarkIndex - 800) / 500
		const multiplier = 2 + excess
		const confidenceRange = 1.5
		const lowerBound = multiplier - confidenceRange / 2
		const upperBound = multiplier + confidenceRange / 2
		return { multiplier, range: [lowerBound, upperBound] }
	} else if (benchmarkIndex >= 150) {
		// 800 = 2x slowdown
		// 150 = 1x
		const excess = (benchmarkIndex - 150) / 650
		const multiplier = 1 + excess
		const confidenceRange = 0.5
		const lowerBound = multiplier - confidenceRange / 2
		const upperBound = multiplier + confidenceRange / 2
		return { multiplier, range: [lowerBound, upperBound] }
	} else {
		return {
			message: 'This device is too slow to accurately emulate the target Lighthouse device.',
		}
	}
}

const CALIBRATE_TESTS_COUNT = 20
const LIGHTHOUSE_TESTS_COUNT = 20

await new Deno.Command('npx', {
	args:
		`@lhci/cli collect --url https://deco-sites-dabelleultimate.deno.dev -n ${CALIBRATE_TESTS_COUNT}`
			.split(' '),
}).spawn().status

const results = []

for await (const result of expandGlob('.lighthouseci/*.json')) {
	results.push(JSON.parse(await Deno.readTextFile(result.path))?.environment?.benchmarkIndex ?? 0)
}

const benchmarkIndex = Math.max(...results)
const throttlingLevel = (computeMultiplierMessages(benchmarkIndex)?.multiplier ?? 1).toFixed(2)

console.log(`Throttling: ${throttlingLevel}`)

await new Deno.Command('npx', {
	args:
		`@lhci/cli collect --throttling-method="simulate" --throttling.cpuSlowdownMultiplier=${throttlingLevel} --url https://deco-sites-dabelleultimate.deno.dev -n ${LIGHTHOUSE_TESTS_COUNT}`
			.split(' '),
}).spawn().status

await new Deno.Command('npx', {
	args: `@lhci/cli upload --target filesystem --outputDir results`
		.split(' '),
}).spawn().status

const lhciManifest = JSON.parse(await Deno.readTextFile('results/manifest.json'))
const medianEntry = lhciManifest.find((entry: any) => entry.isRepresentativeRun)
const medianResult = JSON.parse(await Deno.readTextFile(medianEntry.jsonPath))
console.log('Median performance score was', medianResult.categories.performance.score * 100)
