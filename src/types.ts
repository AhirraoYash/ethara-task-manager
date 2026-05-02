export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'Admin' | 'Member';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdBy_AdminId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo_MemberId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}
