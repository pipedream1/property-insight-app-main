
import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useMaintenanceTasks } from '@/hooks/useMaintenanceTasks';
import { MaintenanceInfoCard } from './MaintenanceInfoCard';
import { MaintenancePageHeader } from './MaintenancePageHeader';
import { TaskActions } from './TaskActions';
import { TasksContent } from './TasksContent';
import { DialogContainer } from './DialogContainer';

const MaintenancePage: React.FC = () => {
  const [showCompleted, setShowCompleted] = useState(false);
  const { tasks, isLoading, error, completeTask, deleteTask, refreshTasks } = useMaintenanceTasks(showCompleted);
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleCompleteTask = async () => {
    if (!taskToComplete) return;
    
    const success = await completeTask(taskToComplete);
    setTaskToComplete(null);
  };
  
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    const success = await deleteTask(taskToDelete);
    setTaskToDelete(null);
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      <MaintenancePageHeader />
      <MaintenanceInfoCard />
      
      <Tabs defaultValue={showCompleted ? "completed" : "active"}>
        <TaskActions 
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          refreshTasks={refreshTasks}
        />
        
        <TasksContent
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          showCompleted={showCompleted}
          onCompleteTask={setTaskToComplete}
          onDeleteTask={setTaskToDelete}
          onImageClick={setSelectedImage}
          refreshTasks={refreshTasks}
          tabValue={showCompleted ? "completed" : "active"}
        />
      </Tabs>
      
      <DialogContainer
        taskToComplete={taskToComplete}
        taskToDelete={taskToDelete}
        selectedImage={selectedImage}
        onCompleteOpenChange={(open) => !open && setTaskToComplete(null)}
        onDeleteOpenChange={(open) => !open && setTaskToDelete(null)}
        onImageOpenChange={(open) => !open && setSelectedImage(null)}
        onCompleteConfirm={handleCompleteTask}
        onDeleteConfirm={handleDeleteTask}
      />
    </main>
  );
};

export default MaintenancePage;
