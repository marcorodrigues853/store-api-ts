import { Response, NextFunction } from 'express';
import TokenService from '../services/TokenService';

interface TokenPayload {
  id: string;
  roles: string[];
}

export default (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const decoded = TokenService.validateAccessToken(token) as TokenPayload;

      const userRoles = decoded.roles;

      if (!userRoles.some((role) => allowedRoles.includes(role))) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
