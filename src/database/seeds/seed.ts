import { AppDataSource } from '../../config/data-source';
import { env } from '../../config/env';
import { User } from '../../modules/users/user.entity';
import { UserRole, ProjectStatus, TaskStatus, TaskPriority } from '../../common/types';
import { Project } from '../../modules/projects/project.entity';
import { Task } from '../../modules/tasks/task.entity';
import bcrypt from 'bcrypt';

const seed = async (): Promise<void> => {
  await AppDataSource.initialize();
  console.log('Database connected for seeding...');

  const userRepository = AppDataSource.getRepository(User);
  const projectRepository = AppDataSource.getRepository(Project);
  const taskRepository = AppDataSource.getRepository(Task);

  // Clear existing data
  await taskRepository.createQueryBuilder().delete().execute();
  await projectRepository.createQueryBuilder().delete().execute();
  await userRepository.createQueryBuilder().delete().execute();

  // Create admin user
  const hashedPassword = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, env.BCRYPT_SALT_ROUNDS);
  const admin = userRepository.create({
    name: 'Admin User',
    email: env.SEED_ADMIN_EMAIL,
    password: hashedPassword,
    role: UserRole.ADMIN,
  });
  await userRepository.save(admin);

  // Create regular user
  const userPassword = await bcrypt.hash(env.SEED_USER_PASSWORD, env.BCRYPT_SALT_ROUNDS);
  const user = userRepository.create({
    name: 'Regular User',
    email: env.SEED_USER_EMAIL,
    password: userPassword,
    role: UserRole.MEMBER,
  });
  await userRepository.save(user);

  // Create sample projects for admin
  const project1 = projectRepository.create({
    title: 'Project Alpha',
    description: 'First sample project',
    status: ProjectStatus.ACTIVE,
    ownerId: admin.id,
  });
  await projectRepository.save(project1);

  const project2 = projectRepository.create({
    title: 'Project Beta',
    description: 'Second sample project',
    status: ProjectStatus.COMPLETED,
    ownerId: admin.id,
  });
  await projectRepository.save(project2);

  // Create sample project for regular user
  const project3 = projectRepository.create({
    title: 'User Project',
    description: 'Regular user project',
    status: ProjectStatus.ACTIVE,
    ownerId: user.id,
  });
  await projectRepository.save(project3);

  // Create sample tasks for project1
  const tasks = [
    taskRepository.create({
      title: 'Setup project structure',
      description: 'Initialize the project folder structure',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: project1.id,
    }),
    taskRepository.create({
      title: 'Implement authentication',
      description: 'Add JWT authentication',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: project1.id,
      dueDate: new Date('2026-07-01'),
    }),
    taskRepository.create({
      title: 'Create database schema',
      description: 'Define entities and migrations',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      projectId: project1.id,
    }),
  ];

  for (const task of tasks) {
    await taskRepository.save(task);
  }

  console.log('Seed completed successfully!');

  await AppDataSource.destroy();
};

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
