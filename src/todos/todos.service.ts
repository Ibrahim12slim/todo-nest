import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        userId,
      },
    });
  }

async findAll(userId: string, query: QueryTodoDto) {
  const {
    search,
    completed,
    priority,
    startDate,
    endDate,
    orderBy,
    orderDirection,
    page = 1,
    pageSize = 10,
  } = query;

  const where: Prisma.TodoWhereInput = { userId };

  if (completed === 'true') where.completed = true;
  else if (completed === 'false') where.completed = false;

  if (typeof priority === 'number') where.priority = priority;

  if (search?.trim().length) {
    where.description = { contains: search.trim(), mode: 'insensitive' };
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) (where.date as Prisma.DateTimeFilter).gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) end.setHours(23, 59, 59, 999);
      (where.date as Prisma.DateTimeFilter).lte = end;
    }
  }

  const primaryOrderBy = orderBy ?? 'date';
  const direction: 'asc' | 'desc' =
    orderDirection ?? (primaryOrderBy === 'priority' ? 'desc' : 'asc');

  const orderByArray: Prisma.TodoOrderByWithRelationInput[] = [
    { [primaryOrderBy]: direction } as Prisma.TodoOrderByWithRelationInput,
  ];

  if (primaryOrderBy !== 'date') orderByArray.push({ date: 'asc' });
  if (primaryOrderBy !== 'priority') orderByArray.push({ priority: 'desc' });

  const take = Math.max(1, Number(pageSize) || 10);
  const skip = Math.max(0, (Number(page) - 1) * take || 0);

  return this.prisma.todo.findMany({ where, orderBy: orderByArray, skip, take });
}
  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    const data: Prisma.TodoUpdateInput = {
      ...dto,
      ...(dto.date ? { date: new Date(dto.date as any) } : {}),
    };

    return this.prisma.todo.update({ where: { id }, data });
  }

  async remove(userId: string, id: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
    return this.prisma.todo.delete({ where: { id } });
  }
}
