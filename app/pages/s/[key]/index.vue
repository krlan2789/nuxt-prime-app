<script lang="ts" setup>
import type { IListItemData } from '~/components/ListItemComponent.props';
import type INoteContent from '~/utils/models/INoteContent';

const route = useRoute();
const router = useRouter();
const key = route.params.key as string;
const secretNotes = ref<INoteContent[]>([]);
const secretCodeCookie = useCookie(key + '.secret-code', {
	secure: true,
	maxAge: 24 * 60 * 60, // 1 day
	sameSite: "strict",
	default: () => '',
});

const fetchContent = async () => {
	secretNotes.value = await fetchAllNotes({ latestFirst: true, slug: key, secretCode: secretCodeCookie.value ?? undefined });
};

const metadata = await fetchNoteMetadata(key);
if (metadata == undefined) throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
if (secretCodeCookie.value.length > 0) await fetchContent();

const onItemClicked = (data: IListItemData) => {
	router.push("/s/" + (data.slug ? data.slug : ""));
};

const metaTitle = `${metadata?.title} - ${appTitle}`;
const metaDesc = metadata?.description;
useSeoMeta({
	title: metaTitle,
	ogTitle: metaTitle,
	description: metaDesc,
	ogDescription: metaDesc,
	articleTag: () => metadata?.tags,
});
</script>

<template>
	<div class="relative flex flex-col max-w-full lg:min-w-xl h-full max-h-full overflow-hidden">
		<div id="markdown" class="container flex flex-col mb-8 mt-14 sm:mt-18 px-6 xl:px-4">
			<div id="markdown-header" class="flex flex-col gap-2 w-full px-0">
				<h1 v-if="metadata?.title" class="w-full text-center text-4xl font-semibold" v-html="metadata?.title">
				</h1>
				<p v-if="metadata?.description" class="w-full" v-html="metadata?.description"></p>
			</div>
		</div>
		<ListComponent v-if="secretNotes?.length > 0" class="container px-6 xl:px-4 w-full mb-16 mx-auto"
			:items="secretNotes" @item-clicked="onItemClicked" paginate />
		<div v-else class="fixed z-99 inset-0 flex flex-col justify-center align-middle bg-surface-600/80">
			<div class="flex flex-col gap-4 max-w-xl w-full m-auto bg-surface-100 p-8">
				<div class="w-full h-auto text-center text-lg py-4">
					<h3>Input the Secret Code for this {{ metadata.status == 'group' ? 'Directory' : 'Note' }}
						<span class="text-orange-700 pi pi-exclamation-triangle"></span>
					</h3>
				</div>
				<form @submit.prevent>
					<div class="flex flex-col gap-2 w-full">
						<InputText type="password" placeholder="Secret Code" class="w-full text-center"
							v-model="secretCodeCookie" :autofocus="!secretCodeCookie" required />
						<Button class="relative w-full" type="submit" @click="fetchContent">
							<span class="pi pi-lock-open -translate-y-0.5"></span>
							Unlock
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>