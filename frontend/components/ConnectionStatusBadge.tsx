"use client";

import { useTasks } from "@/context/TaskContext";

export const ConnectionStatusBadge = () => {
  const { status } = useTasks();

  const statusConfig = {
    connected: {
      color: "bg-green-500",
      label: "Conectado",
    },
    disconnected: {
      color: "bg-red-500",
      label: "Desconectado",
    },
    reconnecting: {
      color: "bg-yellow-500 animate-pulse",
      label: "Reconectando...",
    },
  };

  const current = statusConfig[status];

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 w-fit">
      <span className={`h-2.5 w-2.5 rounded-full ${current.color}`} />
      <span>{current.label}</span>
    </div>
  );
};
