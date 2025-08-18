import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QueryTodoDto } from './dto/query.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateTodoDto) {
    return this.todosService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) query: QueryTodoDto,
  ) {
    const completed =
      typeof query.completed === 'string'
        ? query.completed
        : 'false';

    return this.todosService.findAll(req.user.userId, {
      ...query,
      completed,
    });
  }

  @Get('completed')
  findCompleted(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) query: QueryTodoDto,
  ) {
    return this.todosService.findAll(req.user.userId, {
      ...query,
      completed: 'true',
    });
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.todosService.remove(req.user.userId, id);
  }
}
