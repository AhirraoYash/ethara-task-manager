import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    // Provide details for Mongoose validation errors
    ...(err.name === 'ValidationError' && { details: err.errors })
  });
};
