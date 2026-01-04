import BaseResponseDto from "~~/server/libs/dtos/BaseResponseDto";

export default defineEventHandler(async () => {
	const res: BaseResponseDto = {
		status: 200,
		data: {
			userId: "-",
			userToken: "-",
			refreshToken: "-",
			nickname: "",
		},
	};
	return Promise.resolve(res);
});
