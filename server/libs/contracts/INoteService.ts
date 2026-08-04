import type INoteContent from "~/utils/models/INoteContent";
import { INoteContentRaw } from "~/utils/models/INoteContent";

export const NoteServiceToken = "INoteService";

export type MarkdownContentTransform = {
	metadata: { title: string, description: string, tags?: string[], date?: string, url?: string, type?: string };
	content?: string;
};

export interface INoteServiceFilter {
	tags?: string[] | string;
	lastFirst?: boolean;
	earlyFirst?: boolean;
	secretCode?: string;
	slug?: string;
}

export interface INoteService {
	getListNotes(filters?: INoteServiceFilter): Promise<INoteContent[] | null>;
	getSecretNoteMetadata(slug: string): Promise<INoteContentRaw | null>;
	getNoteContentBySlug(slug: string, secret?: string): Promise<MarkdownContentTransform | undefined>;
}
