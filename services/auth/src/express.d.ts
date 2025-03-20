import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            // Middleware adds user object to request if authenticated
            user?: JwtPayload | { id: number };
        }
    }
}