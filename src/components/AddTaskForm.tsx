"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useStore from "../app/store/store";

const formSchema = z.object({
  task: z.string().min(5, {
    message: "tarefa precisa ter pelo menos 5 caracteres",
  }),
});

export function AddTaskForm({ closeDialog }: { closeDialog: () => void }) {
  const { addTask } = useStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    closeDialog();
    fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    })
      .then((res) => res.json() as Promise<string>)
      .then((emoji) => {
        const task = {
          id: crypto.randomUUID(),
          title: `${emoji} - ${values.task}`,
          completed: false,
        };
        addTask(task);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col"
      >
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarefa:</FormLabel>
              <FormControl>
                <Input placeholder="Digite aqui..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Adicionar</Button>
      </form>
    </Form>
  );
}
