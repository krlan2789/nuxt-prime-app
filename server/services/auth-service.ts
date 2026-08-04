import jwt from "jsonwebtoken";
import { H3Event, EventHandlerRequest } from "h3";
import { IAuthService } from "~~/server/libs/contracts/IAuthService";

const JWT_SECRET_NAME = process.env.JWT_SECRET_NAME || "secret-name";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret-key";

export class AuthService implements IAuthService {
    constructor(event: H3Event<EventHandlerRequest>) { }

    generateJwt(event: H3Event<EventHandlerRequest>, payload?: Record<string, any>): string {
        // Issue JWT valid for 1 day
        const token = jwt.sign(payload ?? {}, JWT_SECRET_KEY, { expiresIn: "1d" });
        setCookie(event, JWT_SECRET_NAME, token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60, // 1 day
            sameSite: "strict",
        });
        console.log(`Token sets to cookie: ${token}`);
        return token;
    }

    getJwtFromCookie(event: H3Event<EventHandlerRequest>): string | undefined {
        return getCookie(event, JWT_SECRET_NAME);
    }

    verifyJwt(token?: string): { secret: string } | null {
        if (!token) return null;
        try {
            const payload = jwt.verify(token, JWT_SECRET_KEY) as { secret: string };
            console.log(payload);
            return payload;
        } catch {
            return null;
        }
    }
}
