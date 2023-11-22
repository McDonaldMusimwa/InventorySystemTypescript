// auth/is-auth.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new AuthenticationError('Not authenticated.');
    next(error);
  }

  const token = authHeader!.split(' ')[1];
  let decodedToken: any;

  try {
    decodedToken = jwt.verify(token!, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }

  if (!decodedToken) {
    const error = new AuthenticationError('Not authenticated.');
    next(error);
  }

  req.userId = decodedToken.userId;
  next();
};
