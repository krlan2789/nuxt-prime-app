<script lang="ts" setup>
import "highlight.js/styles/stackoverflow-dark.min.css";
import { DialogCommentEventName } from "./DialogCommentComponent.props";
import type { MarkdownContentComponentProps } from "./MarkdownContentComponent.props";

const props = defineProps<MarkdownContentComponentProps>();
const { eventBus } = useEventBus();

</script>

<template>
	<section v-if="page" id="markdown" class="flex flex-col">
		<div id="markdown-header" class="flex flex-col gap-2 w-full px-0 pt-4">
			<h1 v-if="page.metadata?.title" class="w-full text-center text-4xl font-semibold"
				v-html="page.metadata?.title"></h1>
			<div v-if="page.metadata?.tags && page.metadata?.tags.length > 0"
				class="flex flex-wrap justify-center w-full gap-4">
				<template v-for="tag of page.metadata?.tags">
					<NuxtLink :to="'/all/' + tag">
						<Tag :key="tag" :value="'#' + tag" class="text-xs rounded-none"
							:severity="severityOptions[page.metadata?.tags.indexOf(tag) % severityOptions.length]"
							rounded>
						</Tag>
					</NuxtLink>
				</template>
			</div>
			<p v-if="page.metadata?.description" class="w-full py-2" v-html="page.metadata?.description"></p>
		</div>
		<div id="markdown-content" v-html="page.content"></div>
		<DialogCommentComponent />
	</section>
	<div class="fixed bottom-6 right-6 xl:right-1/2 xl:translate-x-156 w-auto">
		<Button class="w-auto" size="small" aria-label="Comment" @click="eventBus.$emit(DialogCommentEventName.OnShow)">
			<template #default>
				<span class="pi pi-comments"></span>
				<span class="text-xs italic"> CTRL+/ </span>
			</template>
		</Button>
	</div>
</template>