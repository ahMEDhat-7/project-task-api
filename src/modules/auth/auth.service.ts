import bcrypt from 'bcrypt';
import { AppDataSource } from '../../config/data-source';
import { env } from '../../config/env';
import { User } from '../users/user.entity';
import { IUserRepository } from '../users/user.repository';
import { RegisterInput, LoginInput, AuthResponse } from './auth.types';
import { IAuthService } from './auth.interface';
import { jwtUtil } from '../../common/utils/jwt';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../common/errors';
import { logger } from '../../common/utils/logger';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (existingUser) {
      logger.warn('Registration attempt with existing email', { email: input.email });
      throw new BadRequestError('If this email is not registered, you will receive a confirmation');
    }

    const hashedPassword = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

    const user = this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const token = jwtUtil.generateToken({
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    logger.info('User registered successfully', { userId: savedUser.id, email: savedUser.email });

    const { password: _, ...userWithoutPassword } = savedUser as User & { password: string };

    return { user: userWithoutPassword as Omit<User, 'password'>, token };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: input.email })
      .getOne();

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email: input.email });
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      logger.warn('Login attempt with invalid password', { email: input.email, userId: user.id });
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as Omit<User, 'password'>, token };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

const userRepository = AppDataSource.getRepository(User);
export const authService = new AuthService(userRepository);
