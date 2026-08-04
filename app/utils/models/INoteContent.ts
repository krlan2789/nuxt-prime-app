export interface INoteMetadata {
	title: string;
	description: string;
	tags?: string[];
	date?: string;
};

export type NoteContentType = {
	content?: string;
	metadata: INoteMetadata
};

export default interface INoteContent {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags?: string[];
}

export interface INoteContentRaw {
	title: string;
	description: string;
	date: string;
	tags?: string[];
	source: {
		url: string;
		type: string;
	};
	status?: string;
	secret?: string;
}

export interface INoteGroupRaw {
	title: string;
	type: string;
	purpose: string;
	target: string;
	secret: string;
	directory: string;
}
