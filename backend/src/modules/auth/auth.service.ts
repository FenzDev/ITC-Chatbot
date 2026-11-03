import bcrypt from 'bcryptjs';
import { User } from "../users/user.model.js";
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

export async function getCurrentUser(userId: string) {
  return User.findById(userId).select('-password');
}
