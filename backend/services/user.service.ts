import { db, DbUser } from '../data/mockDatabase';

class UserService {
  getAllUsers() {
    // Return users without passwords
    return db.users.map(({ password, ...user }) => user);
  }

  addUser(userData: Omit<DbUser, 'id' | 'password'>) {
    // Check if user exists
    const existingUser = db.users.find(
      u => u.email === userData.email || u.mobile === userData.mobile
    );

    if (existingUser) {
      throw new Error("User with this email or mobile already exists");
    }

    const newUser: DbUser = {
      id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...userData,
      role: userData.role === 'Admin' ? 'Admin' : 'Member', // default to Member unless explicitly Admin
      password: userData.mobile, // Rule: Member's Mobile Number as their default login password
    };

    db.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}

export const userService = new UserService();
