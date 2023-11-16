import daisyui, { Config } from 'daisyui'
import tailwindcssTypography from '@tailwindcss/typography'
import tailwindcssForms from '@tailwindcss/forms'
import tailwindScrollbar from 'tailwind-scrollbar'

export default {
	plugins: [
		daisyui,
		tailwindcssTypography(),
		tailwindScrollbar,
		tailwindcssForms({
			strategy: 'class',
		}),
	],
	daisyui: { themes: [], logs: false },
	content: ['./**/*.tsx'],
	theme: {
		container: {
			center: true,
			screens: {
				'2xl': '1219px',
			},
		},
		extend: {
			colors: {
				'primary-100': '#F8D1E6',
				'primary-200': '#F0A3CE',
				'primary-300': '#E974B5',
				'primary-400': '#CD3D82',
				'primary-500': '#DA1884',
				'primary-600': '#AE136A',
				'primary-700': '#830E4F',
				'client-primary': '#CD3D82',
				'client-primary-dark': '#C0387A',
				'info-300': '#04CCF4',
				'info-400': '#029FD1',
				'info-500': '#0278AF',
				'info-600': '#01558D',
				'info-700': '#003E75',
				'neutral-0': '#2D2926',
				'neutral-1': '#575451',
				'neutral-2': '#817F7D',
				'neutral-3': '#ABA9A8',
				'neutral-4': '#EAEAE9',
				'success': '#44B32E',
				'success-dark': '#2A9620',
				'danger': '#D83613',
				'danger-dark': '#B51F0D',
				'favorite-text': 'var(--favorite-text)',
				'navbar-item-text': 'var(--navbar-item-text)',
				'login-text': 'var(--login-text)',
				'search-text': 'var(--search-text)',
				'cart-text': 'var(--cart-text)',
				'last-navbar-item-text': 'var(--last-navbar-item-text)',
			},
			fontFamily: {
				'tt-norms': ['TT Norms'],
			},
		},
	},
} as Config
