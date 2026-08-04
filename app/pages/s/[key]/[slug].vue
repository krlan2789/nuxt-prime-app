<script setup lang="ts">
import type { NoteContentType } from '~/utils/models/INoteContent';

definePageMeta({
	layout: "notes",
});

const route = useRoute();
const router = useRouter();
const key = route.params.key as string;
const slug = route.params.slug as string;
const secretPage = ref<NoteContentType | undefined>();
const secretCodeCookie = useCookie(key + '.secret-code', {
	secure: true,
	maxAge: 24 * 60 * 60, // 1 day
	sameSite: "strict",
	default: () => '',
});

const home = ref({
	icon: "pi pi-home",
	route: "/all",
});
const items = ref([
	{ label: key, route: "/s/" + key, }
]);

secretPage.value = await fetchNoteContent(`${key}/${slug}`, secretCodeCookie.value ?? undefined);
if (!secretPage.value) {
	throw router.replace(`/s/${key}`);
	// throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

const metadata = secretPage.value.metadata;
const metaTitle = `${metadata?.title} - ${appTitle}`;
const metaDesc = metadata?.description;
useSeoMeta({
	title: metaTitle,
	ogTitle: metaTitle,
	description: metaDesc,
	ogDescription: metaDesc,
	articleTag: () => secretPage.value?.metadata?.tags,
});
</script>

<template>
	<section class="container px-6 xl:px-4 mt-14 sm:mt-18 mb-16">
		<Breadcrumb :home="home" :model="items">
			<template #item="{ item }">
				<router-link v-if="item.route" v-slot="{ href }" :to="item.route" custom>
					<a :href="href">
						<span :class="[item.icon, 'text-color']"></span>
						<span class="text-primary font-semibold">{{ item.label }}</span>
					</a>
				</router-link>
				<a v-else :href="item.url" :target="item.target">
					<span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
				</a>
			</template>
		</Breadcrumb>
		<MarkdownContentComponent v-if="secretPage" :page="secretPage"></MarkdownContentComponent>
	</section>
</template>
