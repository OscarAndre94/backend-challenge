
import type { Request, Response, NextFunction } from 'express';

export class ContentTypeMiddleware {
    static validate(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        // Only requests with a body must provide JSON content.
        const methodsWithBody = ['POST', 'PUT', 'PATCH'];

        if (!methodsWithBody.includes(req.method)) {
            return next();
        }

        const contentType = req.get('Content-Type');

        if (
            !contentType ||
            contentType.split(';')[0].trim().toLowerCase() !== 'application/json'
        ) {
            return res.status(415).json({
                status: 'error',
                message: 'Unsupported Media Type. Only application/json is accepted.'
            });
        }

        next();
    }
}


