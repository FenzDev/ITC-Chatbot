import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export function generateToken(userId: string, role: string) {
  return jwt.sign({ role }, JWT_SECRET, {
    subject: userId,
    expiresIn: '1d',
  });
}
