import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import useStore from "../app/store/store";

type TodoListItemProps = {
  id: string;
  title: string;
  completed: boolean;
};

const TodoListItem = ({ id, title, completed }: TodoListItemProps) => {
  const { deleteTask, updateTask } = useStore();

  const handleDelete = () => deleteTask(id);

  const handleCheckboxChange = () =>
    updateTask({ id, title, completed: !completed });

  return (
    <Card className="mb-4">
      <CardContent className="flex flex-row justify-between">
        <div>
          <Checkbox checked={completed} onClick={handleCheckboxChange} />
          <span className="pl-3.5">{title}</span>
        </div>
        <Button onClick={handleDelete}>Deletar</Button>
      </CardContent>
    </Card>
  );
};

export default TodoListItem;
