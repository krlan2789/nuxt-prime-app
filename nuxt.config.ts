import tailwindcss from "@tailwindcss/vite";
import Noir from './privmevue.theme';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	ssr: false,
	devtools: { enabled: true },
	css: ['~/assets/css/tailwind.css'],
	app: {
		head: {
			link: [
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png', },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png', },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png', },
				{ rel: 'manifest', href: '/site.webmanifest', },
			],
		},
	},
	modules: [
		'@nuxt/eslint',
		'@nuxt/content',
		'@nuxt/ui',
		'@nuxt/scripts',
		'@nuxt/image',
		'@primevue/nuxt-module',
	],
	primevue: {
		components: {
			exclude: [],
		},
		usePrimeVue: true,
		autoImport: true,
		options: {
			ripple: true,
			inputVariant: 'filled',
			theme: {
				preset: Noir,
				options: {
					prefix: 'p',
					darkModeSelector: '.my-app-dark',
					cssLayer: {
						name: 'primevue',
						order: 'theme, base, primevue',
					},
				},
			},
		},
	},
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
});
