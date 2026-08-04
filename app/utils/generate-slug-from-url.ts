export default (url: string, options?: {
	toRemoves?: string[];
	dontSplit?: boolean;
}) => {
	const urlArr = url.split("/");
	let slug = options?.dontSplit ? url : (urlArr[urlArr.length - 1] || "");
	if (options?.toRemoves) {
		for (const remove of options.toRemoves) {
			slug = slug.replace(remove, "");
		}
	}
	return slug;
};
