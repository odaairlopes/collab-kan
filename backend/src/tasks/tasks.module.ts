import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.services.js';
import { TasksGateway } from './tasks.gateway.js';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksGateway],
})
export class TasksModule {}
