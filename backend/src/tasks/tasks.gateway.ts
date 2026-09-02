import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Task } from '@prisma/client';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001')
      .split(',')
      .map((origin) => origin.trim()),
    credentials: true,
  },
})
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  emitTaskCreated(task: Task) {
    this.server.emit('taskCreated', task);
  }

  emitTaskUpdated(task: Task) {
    this.server.emit('taskUpdated', task);
  }

  emitTaskDeleted(taskId: string) {
    this.server.emit('taskDeleted', taskId);
  }
}
