import { Request, Response } from 'express';
import { z } from 'zod';
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
      const AddUserSchema = z.object({
        name: z.string().min(1, "Name is required").max(100),
        email: z.string().email("Invalid email").optional(),
        mobile: z.string().min(10, "Mobile number too short").max(15),
        role: z.enum(['Admin', 'Member']).optional(),
      });

      const parsed = AddUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      }

      const { name, email, mobile, role } = parsed.data;

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
      const ChangePasswordSchema = z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
      });

      const parsed = ChangePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      }

      const userId = req.user?.id;
      const { currentPassword, newPassword } = parsed.data;

      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }

      user.password = newPassword;
      user.passwordChangedAt = new Date();
      await user.save();

      res.json({ message: 'Password updated successfully.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };
}

export const userController = new UserController();
