import jwt from 'jsonwebtoken';
import { User } from '../types';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'Gm3mkskEJlDnb1OZr2h65Hj91sEdXyZKJX79DzHsqBQ=';

export function generateToken(user: User): string {

  return jwt.sign(
    { _id: user._id, email: user.email },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, SECRET_KEY) as User;
  } catch {
    return null;
  }
}
