import type { INoteContentRaw } from "./models/INoteContent";

export default async (slug: string): Promise<INoteContentRaw | undefined> => {
	const { data } = await useAsyncData(slug, async () => {
		let json: INoteContentRaw | undefined;
		let noteUrl = `/api/metadata/${slug}`;
		await $fetch<{ data: INoteContentRaw }>(noteUrl)
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
