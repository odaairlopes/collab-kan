"use client";

import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";
import { TaskModal } from "./TaskModal";

const COLUMNS = [
  { id: "todo", title: "Para Fazer" },
  { id: "in_progress", title: "Em Progresso" },
  { id: "done", title: "Concluído" },
];

export const KanbanBoard = () => {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = async (
    title: string,
    description: string,
    status: string,
  ) => {
    await createTask(title, description, status);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quadro Kanban</h1>
        <div className="flex items-center gap-4">
          <ConnectionStatusBadge />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            Nova Tarefa
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <h2 className="font-semibold text-gray-700 mb-4 flex justify-between items-center">
                {col.title}
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </h2>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {task.title}
                    </span>
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTask(task.id, {
                            status: e.target.value as
                              | "todo"
                              | "in_progress"
                              | "done",
                          })
                        }
                        className="bg-transparent font-medium text-gray-600 focus:outline-none cursor-pointer"
                      >
                        <option value="todo">Para Fazer</option>
                        <option value="in_progress">Em Progresso</option>
                        <option value="done">Concluído</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};
