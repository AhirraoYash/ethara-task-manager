export interface DbUser {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'Admin' | 'Member';
  password?: string;
}

export interface DbProject {
  id: string;
  title: string;
  description: string;
  createdBy_AdminId: string;
}

export interface DbTask {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo_MemberId: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export const db = {
  users: [
    {
      id: 'admin_1',
      name: 'Admin User',
      mobile: '1234567890',
      email: 'admin@gmail.com',
      role: 'Admin',
      password: 'password', // admin password
    },
  ] as DbUser[],
  projects: [] as DbProject[],
  tasks: [] as DbTask[],
};
