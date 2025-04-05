import { TaskDetailsPage } from './TaskDetailsPage';

interface TaskPageParams {
    id: string;
}

const TaskPage = async ({ params }: { params: Promise<TaskPageParams> }) => {
    const { id } = await params;

    return (
        <section className="flex flex-col">
            <TaskDetailsPage id={id} />
        </section>
    )
}

export default TaskPage