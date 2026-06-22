import { AuthService } from '../auth.service';
import { User, UserRole } from '../../users/user.entity';
import bcrypt from 'bcrypt';
import { jwtUtil } from '../../../common/utils/jwt';

jest.mock('../../../common/utils/jwt', () => ({
  jwtUtil: {
    generateToken: jest.fn(),
  },
}));

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    authService = new AuthService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const input = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const savedUser = { id: 'uuid-1', ...input, password: hashedPassword, role: UserRole.MEMBER };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('mock-token');

      const result = await authService.register(input);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
      expect(result).toHaveProperty('token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error if email already exists', async () => {
      const input = { name: 'Test User', email: 'existing@example.com', password: 'password123' };
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing-user' });

      await expect(authService.register(input)).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const user = { id: 'uuid-1', email: input.email, password: 'hashedPassword', role: UserRole.MEMBER };

      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(user),
      };
      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('mock-token');

      const result = await authService.login(input);

      expect(result).toHaveProperty('token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error with invalid credentials', async () => {
      const input = { email: 'wrong@example.com', password: 'wrongpassword' };
      mockUserRepository.createQueryBuilder.mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(authService.login(input)).rejects.toThrow('Invalid email or password');
    });
  });
});
