import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}
declare const middleware: (req: Request, res: Response, next: NextFunction) => void;
export default middleware;
