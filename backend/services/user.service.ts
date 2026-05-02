import { User } from '../models/User.model';

class UserService {
  async getAllUsers() {
    return User.find().select('-password');
  }

  async getUserById(id: string) {
    return User.findById(id);
  }

  async addUser(userData: { name: string; email?: string; mobile: string; role?: 'Admin' | 'Member' }) {
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { mobile: userData.mobile }]
    });

    if (existingUser) {
      throw new Error("User with this email or mobile already exists");
    }

    const newUser = await User.create({
      ...userData,
      role: userData.role === 'Admin' ? 'Admin' : 'Member',
      password: userData.mobile,
    });

    const userObj = newUser.toObject();
    delete userObj.password;
    return userObj;
  }
}

export const userService = new UserService();
