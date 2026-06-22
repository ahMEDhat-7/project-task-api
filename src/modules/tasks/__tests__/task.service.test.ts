import { TaskService } from '../task.service';
import { AppDataSource } from '../../../config/data-source';
import { Task, TaskStatus, TaskPriority } from '../task.entity';
import { Project } from '../../projects/project.entity';

jest.mock('../../../config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: any;
  let mockProjectRepository: any;

  beforeEach(() => {
    mockTaskRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    mockProjectRepository = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity: any) => {
      if (entity === Project) return mockProjectRepository;
      return mockTaskRepository;
    });

    taskService = new TaskService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const input = { title: 'Test Task', description: 'Test description' };
      const projectId = 'project-uuid';
      const userId = 'user-uuid';
      const project = { id: projectId, ownerId: userId };
      const task = { id: 'task-uuid', ...input, projectId, status: TaskStatus.PENDING, priority: TaskPriority.MEDIUM };

      mockProjectRepository.findOne.mockResolvedValue(project);
      mockTaskRepository.create.mockReturnValue(task);
      mockTaskRepository.save.mockResolvedValue(task);

      const result = await taskService.create(input, projectId, userId, false);

      expect(result).toEqual(task);
    });

    it('should throw error if project not found', async () => {
      mockProjectRepository.findOne.mockResolvedValue(null);

      await expect(
        taskService.create({ title: 'Test' }, 'non-existent', 'user-uuid', false),
      ).rejects.toThrow('Project not found');
    });

    it('should throw error if user is not owner and not admin', async () => {
      const project = { id: 'project-uuid', ownerId: 'other-user' };
      mockProjectRepository.findOne.mockResolvedValue(project);

      await expect(
        taskService.create({ title: 'Test' }, 'project-uuid', 'user-uuid', false),
      ).rejects.toThrow('Access denied');
    });
  });

  describe('findById', () => {
    it('should return task if found', async () => {
      const task = { id: 'task-uuid', title: 'Test Task' };
      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await taskService.findById('task-uuid');

      expect(result).toEqual(task);
    });

    it('should throw error if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(taskService.findById('non-existent')).rejects.toThrow('Task not found');
    });
  });
});
