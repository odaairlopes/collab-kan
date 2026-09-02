"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ConnectionStatus, Task } from "@/types/task";
import { io, Socket } from "socket.io-client";

interface TaskContextType {
  tasks: Task[];
  status: ConnectionStatus;
  createTask: (
    title: string,
    description?: string,
    status?: string,
  ) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// URL do servidor do NestJS
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  useEffect(() => {
    const abortController = new AbortController();

    // 1 - Buscar a lista inicial de tarefas via REST API
    const loadTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          signal: abortController.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error(err);
        }
      }
    };

    loadTasks();
    // 2 - Iniciar o cliente Socket.IO
    const socket: Socket = io(API_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // 3 - Ouvintes de eventos da conexão

    socket.on("connect", () => {
      setStatus("connected");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.io.on("reconnect_attempt", () => {
      setStatus("reconnecting");
    });

    socket.io.on("reconnect_failed", () => {
      setStatus("disconnected");
    });

    // 4 - Ouvintes de eventos das TAREFAS
    socket.on("taskCreated", (newTask: Task) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on("taskUpdated", (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
    });

    socket.on("taskDeleted", (deletedTaskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== deletedTaskId));
    });

    // 5. Limpar conexões ao desmontar
    return () => {
      abortController.abort();
      socket.disconnect();
    };
  }, []);

  const createTask = async (
    title: string,
    description?: string,
    status = "todo",
  ) => {
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status }),
    });
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deleteTask = async (id: string) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <TaskContext.Provider
      value={{ tasks, status, createTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Hook customizado para consumir o contexto com segurança
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks deve ser usado dentro de um TaskProvider");
  }
  return context;
};
