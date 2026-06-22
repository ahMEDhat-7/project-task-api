import bcrypt from 'bcrypt';
import { AppDataSource } from '../../config/data-source';
import { User } from '../users/user.entity';
import { IUserRepository } from '../users/user.repository';
import { RegisterInput, LoginInput, AuthResponse } from './auth.types';
import { IAuthService } from './auth.interface';
import { jwtUtil } from '../../common/utils/jwt';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../common/errors';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new BadRequestError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

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

    const { password: _, ...userWithoutPassword } = savedUser as User & { password: string };

    return { user: userWithoutPassword as any, token };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: input.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwtUtil.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as any, token };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

const userRepository = AppDataSource.getRepository(User);
export const authService = new AuthService(userRepository);
