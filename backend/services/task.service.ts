import { db, DbTask } from "../data/mockDatabase";

class TaskService {
  getTasksByAssignedTo(assignedTo: string) {
    return db.tasks.filter(t => t.assignedTo_MemberId === assignedTo);
  }

  getAllTasks() {
    return db.tasks;
  }

  addTask(data: Omit<DbTask, "id" | "status">) {
    const newTask: DbTask = {
      id: `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      description: data.description || "",
      projectId: data.projectId,
      assignedTo_MemberId: data.assignedTo_MemberId,
      status: 'Pending',
    };

    db.tasks.push(newTask);
    return newTask;
  }

  updateTaskStatus(id: string, status: DbTask['status']) {
    const taskIndex = db.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    db.tasks[taskIndex].status = status;
    return db.tasks[taskIndex];
  }
}

export const taskService = new TaskService();
