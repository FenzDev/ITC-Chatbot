import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'node:crypto';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../config/env.js';
import { User } from '../users/user.model.js';
import { generateToken } from '../../utils/jwt.js';
import type { RegisterInput, LoginInput } from './auth.validation.js';

export async function register(data: RegisterInput) {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function login(data: LoginInput) {
  const user = await User.findOne({ email: data.email }).select('+password');

  if (!user) {
    if (
      data.email === ADMIN_EMAIL &&
      secureCompare(data.password, ADMIN_PASSWORD)
    ) {
      const token = generateToken('admin', 'admin');

      return {
        token,
        user: {
          id: 'admin',
          name: 'Administrator',
          email: ADMIN_EMAIL,
          role: 'admin' as const,
        },
      };
    }

    throw new Error('INVALID_CREDENTIALS');
  }

  const passwordMatches = await bcrypt.compare(data.password, user.password);

  if (!passwordMatches) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

function secureCompare(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return (
    valueBuffer.length === expectedBuffer.length &&
    timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

export async function getCurrentUser(userId: string) {
  if (userId === 'admin') {
    return {
      id: 'admin',
      name: 'Administrator',
      email: ADMIN_EMAIL,
      role: 'admin' as const,
    };
  }

  return User.findById(userId).select('-password');
}
