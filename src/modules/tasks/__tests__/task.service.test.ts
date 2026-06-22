import { TaskService } from '../task.service';
import { Task, TaskStatus, TaskPriority } from '../task.entity';
import { ITaskRepository } from '../task.repository';
import { IProjectRepository } from '../../projects/project.repository';
import { Project } from '../../projects/project.entity';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;
  let mockProjectRepository: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as jest.Mocked<ITaskRepository>;

    mockProjectRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as jest.Mocked<IProjectRepository>;

    taskService = new TaskService(mockTaskRepository, mockProjectRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const input = { title: 'Test Task', description: 'Test description' };
      const projectId = 'project-uuid';
      const userId = 'user-uuid';
      const project = { id: projectId, ownerId: userId } as Project;
      const task = {
        id: 'task-uuid',
        ...input,
        projectId,
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        project: {} as never,
      } as Task;

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
      const project = { id: 'project-uuid', ownerId: 'other-user' } as Project;
      mockProjectRepository.findOne.mockResolvedValue(project);

      await expect(
        taskService.create({ title: 'Test' }, 'project-uuid', 'user-uuid', false),
      ).rejects.toThrow('Access denied');
    });
  });

  describe('findById', () => {
    it('should return task if found and user is owner', async () => {
      const task = { id: 'task-uuid', title: 'Test Task', projectId: 'project-uuid' } as Task;
      const project = { id: 'project-uuid', ownerId: 'user-uuid' } as Project;
      mockTaskRepository.findOne.mockResolvedValue(task);
      mockProjectRepository.findOne.mockResolvedValue(project);

      const result = await taskService.findById('task-uuid', 'user-uuid', false);

      expect(result).toEqual(task);
    });

    it('should return task for admin even if not owner', async () => {
      const task = { id: 'task-uuid', title: 'Test Task', projectId: 'project-uuid' } as Task;
      const project = { id: 'project-uuid', ownerId: 'other-user' } as Project;
      mockTaskRepository.findOne.mockResolvedValue(task);
      mockProjectRepository.findOne.mockResolvedValue(project);

      const result = await taskService.findById('task-uuid', 'admin-uuid', true);

      expect(result).toEqual(task);
    });

    it('should throw error if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(taskService.findById('non-existent', 'user-uuid', false)).rejects.toThrow('Task not found');
    });

    it('should throw error if user is not owner and not admin', async () => {
      const task = { id: 'task-uuid', title: 'Test Task', projectId: 'project-uuid' } as Task;
      const project = { id: 'project-uuid', ownerId: 'other-user' } as Project;
      mockTaskRepository.findOne.mockResolvedValue(task);
      mockProjectRepository.findOne.mockResolvedValue(project);

      await expect(taskService.findById('task-uuid', 'user-uuid', false)).rejects.toThrow('Access denied');
    });
  });
});
