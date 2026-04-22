import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {
  static async generateToken(userId: string, role: string) {
    return jwt.sign({ id: userId, role }, JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
