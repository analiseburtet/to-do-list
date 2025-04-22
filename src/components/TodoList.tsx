"use client";
import { Button } from "@/components/ui/button";
import TodoListItem from "./TodoListItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddTaskForm } from "./AddTaskForm";
import useStore from "../app/store/store";
import { useState } from "react";
import { FilterTask } from "./FilterTask";

const TodoList = () => {
  const [open, setOpen] = useState(false);
  const { filteredTasks } = useStore();

  return (
    <div className="md:w-[50%] w-[70%]">
      <h1 className="flex justify-between py-5">
        To-do List
        <FilterTask />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>Adicionar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Digite uma tarefa:</DialogTitle>
              <DialogDescription>
                Após digitar a tarefa, clique em "Adicionar" para salvá-la.
              </DialogDescription>
            </DialogHeader>
            <AddTaskForm closeDialog={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </h1>
      {filteredTasks.map((task) => (
        <TodoListItem
          key={task.id}
          id={task.id}
          title={task.title}
          completed={task.completed}
        />
      ))}
    </div>
  );
};

export default TodoList;
