import { H3Event, EventHandlerRequest } from "h3";
import containerRegistry from "~~/server/libs/container-registry";
import { IAuthService, AuthServiceToken } from "../libs/contracts/IAuthService";
import { AuthService } from "../services/auth-service";
import { IFirebaseService, FirebaseServiceToken } from "~~/server/libs/contracts/IFirebaseService";
import { FirebaseService } from "~~/server/services/firebase-service";
import { IS3ClientService, S3ClientServiceToken } from "~~/server/libs/contracts/IS3ClientService";
import { S3ClientService } from "~~/server/services/s3-client-service";
import { ICacheService, CacheServiceToken } from "~~/server/libs/contracts/ICacheService";
import { CacheService } from "~~/server/services/cache-service";
import { INoteService, NoteServiceToken } from "~~/server/libs/contracts/INoteService";
import { NoteService } from "~~/server/services/note-service";
import { ICommentService, CommentServiceToken } from "~~/server/libs/contracts/ICommentService";
import { CommentService } from "~~/server/services/comment-service";

export default defineNitroPlugin(() => {
    console.log('Registering services to containerRegistry..');
    containerRegistry.registerScoped<IAuthService>(AuthServiceToken, (event: H3Event<EventHandlerRequest>) => new AuthService(event));
    containerRegistry.registerScoped<ICacheService>(CacheServiceToken, (event: H3Event<EventHandlerRequest>) => new CacheService(event));
    containerRegistry.registerScoped<IFirebaseService>(FirebaseServiceToken, (event: H3Event<EventHandlerRequest>) => new FirebaseService(event));
    containerRegistry.registerScoped<IS3ClientService>(S3ClientServiceToken, (event: H3Event<EventHandlerRequest>) => new S3ClientService(event));
    containerRegistry.registerScoped<INoteService>(NoteServiceToken, (event: H3Event<EventHandlerRequest>) => new NoteService(event));
    containerRegistry.registerScoped<ICommentService>(CommentServiceToken, (event: H3Event<EventHandlerRequest>) => new CommentService(event));
    console.log('Services registration succeed!');
});
