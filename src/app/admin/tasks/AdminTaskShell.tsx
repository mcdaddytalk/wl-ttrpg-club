'use client';

import { Button } from '@/components/ui/button';
import AdminTaskList from "./_components/AdminTask/AdminTaskList";
import { useTaskUIStore } from "@/store/useTaskUIStore";
import AdminTaskDetails from "./_components/AdminTask/AdminTaskDetails";
import AdminTaskForm from "./_components/AdminTask/AdminTaskForm";
import { AdminTaskFilterBar } from "./_components/AdminTask/AdminTaskFilterBar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminTaskTagFilterSidebar } from './_components/AdminTask/AdminTaskTagFilterBar';
import { AdminTaskFilterChips } from './_components/AdminTask/AdminFilterChips';


export default function AdminTaskPageShell() {
  const { openForm, setSelectedTaskId } = useTaskUIStore();

  const handleNewTask = () => {
    setSelectedTaskId(null);
    openForm();
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <CardTitle className="text-2xl font-bold">Admin Tasks</CardTitle>
        <Button onClick={handleNewTask}>+ New Task</Button>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <AdminTaskTagFilterSidebar />
          <div className="flex-1 space-y-4">
            <AdminTaskFilterBar />
            <AdminTaskFilterChips />
            <AdminTaskList />
            <AdminTaskForm />
            <AdminTaskDetails />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
