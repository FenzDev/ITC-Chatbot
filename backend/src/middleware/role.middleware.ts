import type { Request, Response, NextFunction } from 'express';
import { UserRole } from '../modules/users/user.model.js';

function forbidden(res: Response) {
  res.status(403).json({
    success: false,
    error: {
      code: 'FORBIDDEN',
      message: 'You do not have permission',
    },
  });
}

export function requireRole(role: UserRole) {
  return requireAnyRole(role);
}

export function requireAnyRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      forbidden(res);
      return;
    }

    next();
  };
}
