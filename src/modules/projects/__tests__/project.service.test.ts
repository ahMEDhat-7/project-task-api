import { ProjectService } from '../project.service';
import { Project, ProjectStatus } from '../project.entity';
import { IProjectRepository } from '../project.repository';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockProjectRepository: jest.Mocked<IProjectRepository>;

  beforeEach(() => {
    mockProjectRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    projectService = new ProjectService(mockProjectRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a project successfully', async () => {
      const input = { title: 'Test Project', description: 'Test description' };
      const userId = 'user-uuid';
      const project = { id: 'project-uuid', ...input, ownerId: userId, status: ProjectStatus.ACTIVE };

      mockProjectRepository.create.mockReturnValue(project);
      mockProjectRepository.save.mockResolvedValue(project);

      const result = await projectService.create(input, userId);

      expect(mockProjectRepository.create).toHaveBeenCalledWith({ ...input, ownerId: userId });
      expect(result).toEqual(project);
    });
  });

  describe('findById', () => {
    it('should return project if owner matches', async () => {
      const projectId = 'project-uuid';
      const userId = 'user-uuid';
      const project = { id: projectId, ownerId: userId } as Project;

      mockProjectRepository.findOne.mockResolvedValue(project);

      const result = await projectService.findById(projectId, userId, false);

      expect(result).toEqual(project);
    });

    it('should throw error if project not found', async () => {
      mockProjectRepository.findOne.mockResolvedValue(null);

      await expect(projectService.findById('non-existent', 'user-uuid', false)).rejects.toThrow(
        'Project not found',
      );
    });

    it('should throw error if user is not owner and not admin', async () => {
      const project = { id: 'project-uuid', ownerId: 'other-user' } as Project;
      mockProjectRepository.findOne.mockResolvedValue(project);

      await expect(projectService.findById('project-uuid', 'user-uuid', false)).rejects.toThrow(
        'Access denied',
      );
    });

    it('should allow admin to access any project', async () => {
      const project = { id: 'project-uuid', ownerId: 'other-user' } as Project;
      mockProjectRepository.findOne.mockResolvedValue(project);

      const result = await projectService.findById('project-uuid', 'admin-uuid', true);

      expect(result).toEqual(project);
    });
  });
});
