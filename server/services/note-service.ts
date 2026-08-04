import { H3Event, EventHandlerRequest } from "h3";
import INoteContent, { INoteContentRaw, INoteGroupRaw } from "~/utils/models/INoteContent";
import generateSlugFromUrl from "~/utils/generate-slug-from-url";
import containerRegistry from "~~/server/libs/container-registry";
import { INoteService, INoteServiceFilter, MarkdownContentTransform } from "~~/server/libs/contracts/INoteService";
import { IS3ClientService, S3ClientServiceToken } from "~~/server/libs/contracts/IS3ClientService";
import { CacheServiceToken, ICacheService } from "~~/server/libs/contracts/ICacheService";
import parseGithubReadme from "../libs/parse-github-readme";

export class NoteService implements INoteService {
	private notesKey = "notes.json";
	private groupKey = "group.json";
	private s3ClientService: IS3ClientService;
	private cacheService: ICacheService;

	constructor(event?: H3Event<EventHandlerRequest>) {
		this.s3ClientService = containerRegistry.resolve<IS3ClientService>(S3ClientServiceToken, event) || (() => { throw new Error('Failed to resolve S3ClientService in NoteService'); })();
		this.cacheService = containerRegistry.resolve<ICacheService>(CacheServiceToken, event) || (() => { throw new Error('Failed to resolve CacheService in NoteService'); })();
	}

	private convertRawContent(raw: INoteContentRaw[], filters?: INoteServiceFilter): INoteContent[] {
		// Filter and map notes
		let notes: INoteContent[] = [];
		if (raw) {
			// Prepare filter tags
			let filterTags: Set<string> | undefined;
			if (filters?.tags) {
				let tagsArray: string[] | undefined = [];
				if (typeof filters.tags === "string") {
					tagsArray =
						filters.tags && filters.tags.includes(",")
							? filters.tags?.split(",").map((t) => t.toLowerCase())
							: filters.tags
								? [filters.tags.toLowerCase()]
								: undefined;
				} else if (Array.isArray(filters.tags)) {
					tagsArray = filters.tags.map((t) => t.toLowerCase());
				}
				filterTags = new Set(tagsArray);
			}
			const path = '/notes/' + filters?.slug;
			notes = raw
				.filter((e) => {
					if (filters?.slug && !e.source.url.startsWith(path)) return false;
					if (filterTags && filterTags.size > 0) return e.tags?.some((tag) => filterTags!.has(tag.toLowerCase()));
					return true;
				})
				.map((e) => {
					const toRemoves = [".md", ".mdx", "/notes/"];
					const formatted = {
						slug: generateSlugFromUrl(e.source.url, { toRemoves, dontSplit: e.source.type == "s3" }),
						title: e.title,
						description: e.description,
						date: e.date,
						tags: e.tags,
					};
					if (!filters?.secretCode) this.cacheService.set<INoteContentRaw>(formatted.slug, e);
					return formatted;
				});
		}

		// Sort notes
		if (notes) {
			if (filters?.lastFirst) {
				notes = notes.sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
			} else if (filters?.earlyFirst) {
				notes = notes.sort((a, b) => new Date(a.date || "").getTime() - new Date(b.date || "").getTime());
			}
		}
		return notes;
	}

	public async getListNotes(filters?: INoteServiceFilter): Promise<INoteContent[] | null> {
		// Fetch notes list from S3
		const obj = filters?.secretCode
			? await this.s3ClientService.fetchStringSecretObject(this.notesKey)
			: await this.s3ClientService.fetchStringObject(this.notesKey);
		const raw = JSON.parse(obj?.data || "[]") as INoteContentRaw[];
		return this.convertRawContent(raw, filters);
	}

	public async getSecretNoteMetadata(slug: string): Promise<INoteContentRaw | null> {
		const notesObj = await this.s3ClientService.fetchStringSecretObject(this.notesKey);
		const groupObj = await this.s3ClientService.fetchStringSecretObject(this.groupKey);
		const notesRaw = JSON.parse(notesObj?.data || "[]") as INoteContentRaw[];
		const groupRaw = JSON.parse(groupObj?.data || "[]") as INoteGroupRaw[];
		const path = '/notes/' + slug;
		const note = notesRaw.find((e) => e.source.url == path + '.md');
		const group = groupRaw.find((e) => note?.source.url.startsWith(e.directory) || e.directory == path);
		if (group && !note) return {
			title: group.title,
			date: "",
			description: "",
			source: {
				type: "s3",
				url: group.directory,
			},
			secret: group.secret,
			tags: [group.type, group.purpose],
			status: 'group',
		};
		if (note) return {
			...note,
			secret: group?.secret,
			status: 'note',
		}
		return null;
	}

	public async getNoteContentBySlug(slug: string, secret?: string): Promise<MarkdownContentTransform | undefined> {
		let markdownRaw: string | undefined;
		let title: string;
		let description: string;
		let date: string;
		let tags: string[] | undefined;
		let sourceUrl: string;
		let sourceType: string;

		if (secret) {
			const cached = await this.getSecretNoteMetadata(slug);
			if (cached == null) return undefined;
			if (cached.secret !== secret) return undefined;
			title = cached.title;
			description = cached.description;
			date = cached.date;
			tags = cached.tags;
			sourceUrl = cached?.source.url;
			sourceType = cached?.source.type;

			const obj = await this.s3ClientService.fetchStringSecretObject(sourceUrl);
			markdownRaw = obj?.data;
		} else {
			const cachedSize = await this.cacheService.count();
			if (cachedSize == 0) {
				await this.getListNotes();
			}
			const cached = await this.cacheService.get<INoteContentRaw>(slug);
			if (cached == null) return undefined;
			title = cached.title;
			description = cached.description;
			date = cached.date;
			tags = cached.tags;
			sourceUrl = cached?.source.url;
			sourceType = cached?.source.type;

			// Fetch markdown content based on type
			if (sourceType == "github") {
				markdownRaw = await parseGithubReadme(sourceUrl);
			} else if (sourceType == "s3") {
				const obj = await this.s3ClientService.fetchStringObject(sourceUrl);
				markdownRaw = obj?.data;
			} else {
				return undefined;
			}
		}

		const results: MarkdownContentTransform = {
			metadata: {
				title: title,
				description: description,
				date: date,
				tags: tags,
				url: sourceUrl,
				type: sourceType,
			},
			content: markdownRaw,
		};
		return results;
	}
}
