import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query.dto';
import { ForbiddenException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const userId = 'user-id';
      const createTodoDto: CreateTodoDto = {
        description: 'Test todo',
        priority: 1,
        date: new Date(),
      };

      const expectedResult = {
        id: 'todo-id',
        ...createTodoDto,
        userId,
        completed: false,
      };

      mockPrismaService.todo.create.mockResolvedValue(expectedResult);

      const result = await service.create(userId, createTodoDto);

      expect(result).toEqual(expectedResult);
      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: {
          ...createTodoDto,
          userId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const userId = 'user-id';
      const query: QueryTodoDto = {
        completed: 'false',
        page: 1,
        pageSize: 10,
      };

      const expectedResult = [
        {
          id: 'todo-id',
          description: 'Test todo',
          priority: 1,
          date: new Date(),
          completed: false,
          userId,
        },
      ];

      mockPrismaService.todo.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll(userId, query);

      expect(result).toEqual(expectedResult);
      expect(prismaService.todo.findMany).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const userId = 'user-id';
      const todoId = 'todo-id';
      const updateTodoDto: UpdateTodoDto = {
        description: 'Updated todo',
        completed: true,
      };

      const existingTodo = {
        id: todoId,
        userId,
        description: 'Original todo',
        priority: 1,
        date: new Date(),
        completed: false,
      };

      const updatedTodo = {
        ...existingTodo,
        ...updateTodoDto,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.update(userId, todoId, updateTodoDto);

      expect(result).toEqual(updatedTodo);
      expect(prismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(prismaService.todo.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      const userId = 'user-id';
      const todoId = 'todo-id';
      const updateTodoDto: UpdateTodoDto = {
        description: 'Updated todo',
      };

      const existingTodo = {
        id: todoId,
        userId: 'different-user-id',
        description: 'Original todo',
        priority: 1,
        date: new Date(),
        completed: false,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);

      await expect(
        service.update(userId, todoId, updateTodoDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete a todo', async () => {
      const userId = 'user-id';
      const todoId = 'todo-id';

      const existingTodo = {
        id: todoId,
        userId,
        description: 'Test todo',
        priority: 1,
        date: new Date(),
        completed: false,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);
      mockPrismaService.todo.delete.mockResolvedValue(existingTodo);

      const result = await service.remove(userId, todoId);

      expect(result).toEqual(existingTodo);
      expect(prismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: todoId },
      });
      expect(prismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: todoId },
      });
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      const userId = 'user-id';
      const todoId = 'todo-id';

      const existingTodo = {
        id: todoId,
        userId: 'different-user-id',
        description: 'Test todo',
        priority: 1,
        date: new Date(),
        completed: false,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(existingTodo);

      await expect(service.remove(userId, todoId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});