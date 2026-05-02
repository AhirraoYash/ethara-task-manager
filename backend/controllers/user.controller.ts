import { Request, Response } from 'express';
import { userService } from '../services/user.service';

class UserController {
  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ users });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };

  addUser = async (req: Request, res: Response) => {
    try {
      const { name, email, mobile, role } = req.body;

      if (!name || !email || !mobile) {
        return res.status(400).json({ error: "Name, Email, and Mobile are required" });
      }

      const user = await userService.addUser({ name, email, mobile, role });
      res.status(201).json({ user });
    } catch (error: any) {
      if (error.message.includes('already exists') || error.code === 11000) {
        return res.status(400).json({ error: "User with this email or mobile already exists" });
      }
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };
  changePassword = async (req: any, res: any) => {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };
}

export const userController = new UserController();
