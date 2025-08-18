import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query.dto';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  const mockTodosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 'user-id',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createTodoDto: CreateTodoDto = {
        description: 'Test todo',
        priority: 1,
        date: new Date(),
      };

      const expectedResult = {
        id: 'todo-id',
        ...createTodoDto,
        userId: 'user-id',
        completed: false,
      };

      mockTodosService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(mockRequest as any, createTodoDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(
        mockRequest.user.userId,
        createTodoDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
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
          userId: 'user-id',
        },
      ];

      mockTodosService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest as any, query);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(
        mockRequest.user.userId,
        query,
      );
    });
  });

  describe('findCompleted', () => {
    it('should call service.findAll with completed set to true', async () => {
      const query: QueryTodoDto = {
        page: 1,
        pageSize: 10,
      };

      const expectedResult = [
        {
          id: 'todo-id',
          description: 'Test todo',
          priority: 1,
          date: new Date(),
          completed: true,
          userId: 'user-id',
        },
      ];

      mockTodosService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findCompleted(mockRequest as any, query);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(mockRequest.user.userId, {
        ...query,
        completed: 'true',
      });
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const todoId = 'todo-id';
      const updateTodoDto: UpdateTodoDto = {
        description: 'Updated todo',
        completed: true,
      };

      const expectedResult = {
        id: todoId,
        ...updateTodoDto,
        priority: 1,
        date: new Date(),
        userId: 'user-id',
      };

      mockTodosService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        mockRequest as any,
        todoId,
        updateTodoDto,
      );

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(
        mockRequest.user.userId,
        todoId,
        updateTodoDto,
      );
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct parameters', async () => {
      const todoId = 'todo-id';
      const expectedResult = {
        id: todoId,
        description: 'Test todo',
        priority: 1,
        date: new Date(),
        completed: false,
        userId: 'user-id',
      };

      mockTodosService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(mockRequest as any, todoId);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(
        mockRequest.user.userId,
        todoId,
      );
    });
  });
});