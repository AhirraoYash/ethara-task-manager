export interface User {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'Admin' | 'Member';
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}
