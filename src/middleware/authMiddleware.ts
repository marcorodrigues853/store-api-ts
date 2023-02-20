import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import AppError from '../exceptions/AppError';

export default (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'OPTIONS') next();

    const authHeader = req.headers.authorization;

    if (!authHeader) next(new AppError('No Authorization Header', 401));

    const token = authHeader.split(' ')[1];
    if (!token) next(new AppError('Invalid token', 401));

    req.user = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET_KEY));
    next();
  } catch (error) {
    next(error);
  }
};
