import { create } from "zustand";
import { persist } from "zustand/middleware";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type TaskStore = {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (updatedTask: Task) => void;
  filteredTasks: Task[];
  setFilteredTasks: (tasks: Task[]) => void;
  filterStatus: "todas" | "completo" | "incompleto";
  setFilterStatus: (status: "todas" | "completo" | "incompleto") => void;
};

const useStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => {
        const { filterStatus } = get();
        if (filterStatus === "todas" || filterStatus === "incompleto") {
          set((state) => ({
            filteredTasks: [...state.tasks, task],
          }));
          return;
        }
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },
      deleteTask: (taskId) => {
        set((state) => ({
          filteredTasks: state.tasks.filter((task) => task.id !== taskId),
        }));
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },
      updateTask: (updatedTask) => {
        set((state) => ({
          filteredTasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }));
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }));
      },
      filteredTasks: [],
      setFilteredTasks: (tasks) =>
        set(() => ({
          filteredTasks: tasks,
        })),
      filterStatus: "todas",
      setFilterStatus: (status) => {
        set(() => ({
          filterStatus: status,
        }));
      },
    }),
    {
      name: "task-storage",
    }
  )
);

export default useStore;
