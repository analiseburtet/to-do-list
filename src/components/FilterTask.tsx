"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useStore from "@/app/store/store";

export const statusOptions = ["todas", "completo", "incompleto"] as const;

const status = [
  { label: "Todas", value: "todas" },
  { label: "Feito", value: "completo" },
  { label: "Não feito", value: "incompleto" },
] as const;

const FormSchema = z.object({
  status: z.enum(statusOptions, {
    required_error: "Por favor, selecione um status.",
  }),
});

export function FilterTask() {
  const { tasks, setFilteredTasks, setFilterStatus } = useStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: "todas",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const statusMap = {
      todas: () => tasks,
      completo: () => tasks.filter((task) => task.completed),
      incompleto: () => tasks.filter((task) => !task.completed),
    };

    const filteredTasks = statusMap[data.status]?.() || tasks;
    setFilterStatus(data.status);
    setFilteredTasks(filteredTasks);
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? status.find((item) => item.value === field.value)
                            ?.label
                        : "Selecione um status"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Busque por status..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Nenhum status encontrado.</CommandEmpty>
                      <CommandGroup>
                        {status.map((item) => (
                          <CommandItem
                            value={item.label}
                            key={item.value}
                            onSelect={() => {
                              form.setValue("status", item.value);
                              onSubmit(form.getValues());
                            }}
                          >
                            {item.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                item.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
