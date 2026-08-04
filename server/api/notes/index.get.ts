import BaseResponseDto from "~~/server/libs/dtos/BaseResponseDto";
import containerRegistry from "~~/server/libs/container-registry";
import { INoteService, NoteServiceToken } from "~~/server/libs/contracts/INoteService";
import { AuthServiceToken, IAuthService } from "~~/server/libs/contracts/IAuthService";

export default defineEventHandler(async (event): Promise<BaseResponseDto> => {
	let res: BaseResponseDto = {
		status: 500,
		cause: [{ field: "exception", message: 'Some service no found' }],
	};

	try {
		const slug = getQuery(event).slug as string | undefined;
		const tags = getQuery(event).tags as string | undefined;
		const secretCode = getQuery(event).secretCode as string | undefined;
		const noteService = containerRegistry.resolve<INoteService>(NoteServiceToken, event);
		if (!noteService) {
			throw createError(res);
		}

		const notes = await noteService.getListNotes({ tags, secretCode, slug });
		return { status: 200, data: notes };
	} catch (err) {
		res.cause = [{ field: "exception", message: JSON.stringify(err) }];
		throw createError(res);
	}
});
