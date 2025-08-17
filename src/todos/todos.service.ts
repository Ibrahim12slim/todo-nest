import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string, completed?: boolean) {
    return this.prisma.todo.findMany({
      where: { userId, completed: completed ?? false },
      orderBy: [{ date: 'asc' }, { priority: 'desc' }],
    });
  }

  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
    return this.prisma.todo.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
    return this.prisma.todo.delete({ where: { id } });
  }
}
