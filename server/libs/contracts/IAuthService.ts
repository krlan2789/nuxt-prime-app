import { H3Event, EventHandlerRequest } from "h3";

export const AuthServiceToken = "IAuthService";

export interface IAuthService {
    generateJwt(event: H3Event<EventHandlerRequest>, payload?: Record<string, any>): string;
    getJwtFromCookie(event: H3Event<EventHandlerRequest>): string | undefined;
    verifyJwt(token?: string): { secret: string } | null;
}
