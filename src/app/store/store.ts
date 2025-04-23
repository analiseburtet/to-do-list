import { create } from "zustand";
import { persist } from "zustand/middleware";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type FilterStatus = "todas" | "completo" | "incompleto";

type TaskStore = {
  tasks: Task[];
  filteredTasks: Task[];
  filterStatus: FilterStatus;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (updatedTask: Task) => void;
  setFilteredTasks: (tasks: Task[]) => void;
  setFilterStatus: (status: FilterStatus) => void;
};

const useStore = create<TaskStore>()(
  persist(
    (set, get) => {
      const applyFilter = (status: FilterStatus, tasks: Task[]) => {
        switch (status) {
          case "completo":
            return tasks.filter((task) => task.completed);
          case "incompleto":
            return tasks.filter((task) => !task.completed);
          case "todas":
          default:
            return tasks;
        }
      };

      return {
        tasks: [],
        filteredTasks: [],
        filterStatus: "todas",

        addTask: (task) => {
          const newTasks = [...get().tasks, task];
          const { filterStatus } = get();

          set({
            tasks: newTasks,
            filteredTasks: applyFilter(filterStatus, newTasks),
          });
        },

        deleteTask: (taskId) => {
          const newTasks = get().tasks.filter((task) => task.id !== taskId);
          const { filterStatus } = get();

          set({
            tasks: newTasks,
            filteredTasks: applyFilter(filterStatus, newTasks),
          });
        },

        updateTask: (updatedTask) => {
          const newTasks = get().tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
          const { filterStatus } = get();

          set({
            tasks: newTasks,
            filteredTasks: applyFilter(filterStatus, newTasks),
          });
        },

        setFilteredTasks: (tasks) => set({ filteredTasks: tasks }),

        setFilterStatus: (status) => {
          const { tasks } = get();
          set({
            filterStatus: status,
            filteredTasks: applyFilter(status, tasks),
          });
        },
      };
    },
    { name: "task-storage" }
  )
);

export default useStore;
