
import type { ErrorRequestHandler } from 'express';
import { Prisma } from '../generated/prisma/client.js';

export class ErrorMiddleware {
  static handle: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);

    // Prisma: unique constraint violation
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      res.status(409).json({
        status: 'error',
        message: 'Username or email already exists',
      });
      return;
    }

    // Prisma: record not found
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      res.status(404).json({
        status: 'error',
        message: 'Requested resource not found',
      });
      return;
    }

    // Bad request: malformed JSON or another error with HTTP 400
    if (err.status === 400 || err.statusCode === 400) {
      res.status(400).json({
        status: 'error',
        message: 'Bad request',
      });
      return;
    }

    // Unexpected errors
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  };
}
