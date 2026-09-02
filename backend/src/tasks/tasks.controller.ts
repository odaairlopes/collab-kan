import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.services.js';
import { TasksGateway } from './tasks.gateway.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  async create(@Body() data: CreateTaskDto) {
    const task = await this.tasksService.create(data);
    this.tasksGateway.emitTaskCreated(task);
    return task;
  }

  @Put(':id')
  async update(@Body() data: UpdateTaskDto, @Param('id') id: string) {
    const task = await this.tasksService.update(id, data);
    this.tasksGateway.emitTaskUpdated(task);
    return task;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const task = await this.tasksService.delete(id);
    this.tasksGateway.emitTaskDeleted(task);
    return task;
  }
}
