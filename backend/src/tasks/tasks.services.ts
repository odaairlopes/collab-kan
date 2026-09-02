import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';

interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: CreateTaskData) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status ?? 'todo',
      },
    });
  }

  async update(id: string, data: UpdateTaskData) {
    await this.ensureTaskExists(id);

    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<string> {
    await this.ensureTaskExists(id);
    await this.prisma.task.delete({
      where: { id },
    });
    return id;
  }

  private async ensureTaskExists(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
