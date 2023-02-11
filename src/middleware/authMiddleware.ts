import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export default (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'OPTIONS') next();

    const authHeader = req.headers.authorization;

    if (!authHeader)
      res.status(401).json({
        message: 'No authorization header', // TODO: change to class errors
      });

    const token = authHeader.split(' ')[1];
    if (!token)
      res.status(401).json({
        message: 'Invalid token', // TODO: change to class errors
      });

    req.user = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET_KEY));
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Bad format token' });
  }
};
