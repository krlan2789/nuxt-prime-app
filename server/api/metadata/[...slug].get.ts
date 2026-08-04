import BaseResponseDto from "~~/server/libs/dtos/BaseResponseDto";
import containerRegistry from "~~/server/libs/container-registry";
import { INoteService, NoteServiceToken } from "~~/server/libs/contracts/INoteService";

export default defineEventHandler(async (event): Promise<BaseResponseDto> => {
	let res: BaseResponseDto = {
		status: 500,
		cause: [{ field: "exception", message: 'Some service no found' }],
	};

	const noteService = containerRegistry.resolve<INoteService>(NoteServiceToken, event);
	if (!noteService) {
		console.error(res);
		throw createError(res);
	}
	const slug = getRouterParam(event, "slug") ?? "";
	const metadata = await noteService.getSecretNoteMetadata(slug);

	if (metadata) {
		return {
			status: 200,
			data: {
				title: metadata.title,
				description: metadata.description,
				status: metadata.status,
				tags: metadata.tags,
				date: metadata.date,
				source: metadata.source,
			},
		};
	} else {
		res.cause = [{ field: "slug", message: "Note not found" }];
		console.error(res);
		throw createError(res);
	}
});
