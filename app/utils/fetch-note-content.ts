import type { NoteContentType } from "./models/INoteContent";

export default async (slug: string, secret?: string): Promise<NoteContentType | undefined> => {
	const { data } = await useAsyncData(slug, async () => {
		let json: NoteContentType | undefined;
		let noteUrl = `/api/notes/${slug}`;
		if (secret) noteUrl += '?secret=' + secret;
		await $fetch<{ data: NoteContentType }>(noteUrl, { method: "get" })
			.then(res => {
				json = res.data;
			})
			.catch(res => {
				console.error(res);
			});
		return await Promise.resolve(json);
	});
	return data.value;
};
