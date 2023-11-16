/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { signal } from '@preact/signals'

export type BuyData = {
	skuID: string
	quantity: number
	seller: string
}

const displayCart = signal(false)
const displayMenu = signal(false)
const displaySearchbar = signal(false)
const searchBarInputValue = signal('')
const displaySearchDrawer = signal(false)
const listingType = signal('grid')
const shelfProducts = signal<BuyData[]>([])
const displaySearchPopup = signal(false)
const displayVideoModal = signal(false)

const state = {
	displayCart,
	displayMenu,
	displaySearchbar,
	displaySearchDrawer,
	displaySearchPopup,
	searchBarInputValue,
	listingType,
	shelfProducts,
	displayVideoModal,
}

export const useUI = () => state
