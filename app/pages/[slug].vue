<script setup lang="ts">
import type { NoteContentType } from '~/utils/models/INoteContent';

const route = useRoute();
const page = ref<NoteContentType | undefined>();

page.value = await fetchNoteContent(route.params.slug as string);
if (!page.value) {
	throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

const metaTitle = `${page.value.metadata?.title} - ${appTitle}`;
const metaDesc = page.value.metadata?.description;
useSeoMeta({
	title: metaTitle,
	ogTitle: metaTitle,
	description: metaDesc,
	ogDescription: metaDesc,
	articleTag: () => page.value?.metadata?.tags,
});
</script>

<template>
	<div class="container px-6 xl:px-4 mt-14 sm:mt-18 mb-16">
		<MarkdownContentComponent v-if="page" :page="page"></MarkdownContentComponent>
	</div>
</template>
