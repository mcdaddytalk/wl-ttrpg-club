import { useQueryStates } from "nuqs";
import { TaskFilterSchema } from "@/lib/validation/tasks";

export const useTaskFilters = () => {
    const [filters, setFilters] = useQueryStates(TaskFilterSchema.shape, {
        history: 'push',
    });

    return { filters, setFilters };
}