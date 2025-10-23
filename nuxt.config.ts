import tailwindcss from "@tailwindcss/vite";
import Material from '@primeuix/themes/material';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: ['~/assets/css/tailwind.css'],
	modules: [
		'@nuxt/eslint',
		'@nuxt/content',
		'@nuxt/ui',
		'@nuxt/scripts',
		'@nuxt/image',
		'@primevue/nuxt-module',
	],
	primevue: {
		/* Configuration */
		components: {
			exclude: [],
		},
		usePrimeVue: true,
		autoImport: true,
		options: {
			ripple: true,
			inputVariant: 'filled',
			theme: {
				preset: Material,
				options: {
					prefix: 'p',
					darkModeSelector: 'system',
					// cssLayer: false,
					cssLayer: {
						name: 'primevue',
						order: 'theme, base, primevue'
					}
				},
			},
		},
	},
	// appConfig: {
	// 	nuxt: {
	// 		dark: false,
	// 	},
	// },
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
})