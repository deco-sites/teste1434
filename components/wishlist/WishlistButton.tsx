import Icon from '$store/components/ui/Icon.tsx'
import { useComputed } from '@preact/signals'
import type { Product } from 'apps/commerce/types.ts'
import { useUser } from 'apps/vtex/hooks/useUser.ts'
import { useWishlist } from 'apps/vtex/hooks/useWishlist.ts'
import clsx from 'deco-sites/dabelleultimate/sdk/clsx.ts'

export interface Props {
	product: Product
	variant?: 'product'
}

export default function WishlistButton({ product, variant }: Props) {
	const { user } = useUser()

	const { productID, isVariantOf } = product
	const productGroupID = isVariantOf?.productGroupID
	const item = { sku: productID, productId: productGroupID! }
	const { loading, addItem, removeItem, getItem } = useWishlist()
	const listItem = useComputed(() => getItem(item))

	const isUserLoggedIn = Boolean(user.value?.email)
	const inWishlist = Boolean(listItem.value)

	const tooltip = isUserLoggedIn ? (inWishlist ? 'Favoritado!' : 'Favoritar') : 'Fazer login'

	const handleClick = async (e: MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()

		if (!isUserLoggedIn) {
			window.location.href = '/login'
			return
		}

		if (loading.value) return

		try {
			inWishlist ? await removeItem({ id: listItem.value!.id }!) : await addItem(item)
		} finally {
			//
		}
	}

	return (
		<button
			class='group/wishlist relative flex items-center content-center text-neutral p-2'
			aria-label='Add to wishlist'
			disabled={loading.value}
			onClick={handleClick}
		>
			<Icon
				class={clsx(
					'duration-300',
					variant === 'product'
						? 'text-neutral-0 group-hover/wishlist:text-[#A40202]'
						: 'text-[#A40202]',
				)}
				id='Heart'
				height={22}
				width={24}
			/>
			<p class='flex rounded-md px-2 py-1 absolute top-full right-0 border whitespace-nowrap bg-gray-300 text-gray-500 text-xs translate-y-1 opacity-0 group-hover/wishlist:opacity-100 duration-300 group-hover/wishlist:delay-1000 shadow pointer-events-none'>
				{tooltip}
				<span class='block absolute bottom-full right-[13px] h-3 w-3 bg-gray-300 rotate-45 translate-y-1/2 rounded-sm shadow' />
			</p>
		</button>
	)
}
