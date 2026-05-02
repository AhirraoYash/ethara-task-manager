import { Request, Response } from 'express';
import { userService } from '../services/user.service';

class UserController {
  getUsers = (req: Request, res: Response) => {
    try {
      const users = userService.getAllUsers();
      res.status(200).json({ users });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };

  addUser = (req: Request, res: Response) => {
    try {
      const { name, email, mobile, role } = req.body;

      if (!name || !email || !mobile) {
        return res.status(400).json({ error: "Name, Email, and Mobile are required" });
      }

      const user = userService.addUser({ name, email, mobile, role });
      res.status(201).json({ user });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  };
}

export const userController = new UserController();
