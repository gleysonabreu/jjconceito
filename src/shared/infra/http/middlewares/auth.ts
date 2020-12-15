import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config/crypto';
import AppError from '@shared/errors/AppError';

interface IJwt {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
  role: number;
}

async function auth(request: Request, response: Response, next: NextFunction) {
  const { authorization } = request.headers;
  if (!authorization) throw new AppError('No token provided.', 401);

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') throw new AppError('Invalid bearer', 401);

  try {
    const tokenInfo = <IJwt>jwt.verify(token, config.jwt.pubicKey);
    request.customerId = tokenInfo.id;
    request.role = tokenInfo.role;

    return next();
  } catch (err) {
    throw new AppError('Token invalid', 401);
  }
}

export default auth;
