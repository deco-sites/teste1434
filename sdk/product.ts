import { useVariantPossibilities } from '$store/sdk/useVariantPossiblities.ts'
import { Product } from 'apps/commerce/types.ts'
import { zip } from 'std/collections/zip.ts'

export function findVariantOnProducts(
	product: Product,
	variations: { name: string; value: string }[],
) {
	const prodsAndVariations = [
		product,
		...(product.isVariantOf?.hasVariant ?? []),
	] as unknown as Product[]

	return prodsAndVariations.find((i) => {
		const add = i.additionalProperty!

		const v = variations.map((v) => add.find((i) => i.name == v.name)!)

		return zip(v, variations).every(([v, v2]) => v.value === v2.value)
	}) as Product
}

export function getVariationsFromProduct<T extends string[]>(
	product: Product,
	...productVariations: T
) {
	const variations = useVariantPossibilities(product)
	const variationsKeys = Object.keys(variations)

	type TheReturnType = Partial<
		Record<
			typeof productVariations[number],
			(Record<typeof productVariations[number], string> & { product: Product })[]
		>
	>

	if (!variationsKeys.length) {
		return {} as TheReturnType
	}

	if (variationsKeys.length === 1) {
		const variationName = variationsKeys[0]

		return {
			[variationName]: Object.entries(variations[variationName as string]).map((
				[n],
			) => ({
				[variationName]: n,
				product: findVariantOnProducts(product, [{
					name: variationName,
					value: n,
				}]),
			})),
		} as TheReturnType
	}

	const selectedVariants = {} as Record<string, string>
	const productVariants = {} as Record<string, Product[]>
	const variantsData = {} as TheReturnType

	for (const variationName of Object.keys(variations)) {
		const v = variations[variationName]

		selectedVariants[variationName] = Object.entries(v).find(([_name, [i]]) =>
			i === product.url
		)![0]
	}

	for (const variationName of Object.keys(variations)) {
		const differentVariations = Object.keys(variations).filter((j) => j !== variationName)

		productVariants[variationName] = Object.keys(variations[variationName]).map((i) => {
			return findVariantOnProducts(product, [
				{
					name: variationName,
					value: i,
				},
				...differentVariations.map((d) => ({
					name: d,
					value: selectedVariants[d],
				})),
			])
		})

		variantsData[variationName as typeof productVariations[number]] =
			productVariants[variationName].map((i) => ({
				...Object.fromEntries(
					Object.keys(variations).map((n) => [
						n,
						i?.additionalProperty!.find((j) => j.name === n)?.value!,
					]),
				),
				product: i,
			} as Record<typeof productVariations[number], string> & { product: Product }))
	}

	return variantsData
}
