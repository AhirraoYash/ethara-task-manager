import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.model";
import { authRateLimiter } from "../middleware/rateLimiter";

const router = Router();

const LoginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().min(1, "Password is required")
});

router.post("/login", authRateLimiter, async (req, res, next) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid credentials format", details: parsed.error.flatten() });
    }

    const { identifier, password } = parsed.data;
    const normalizedIdentifier = String(identifier).trim().toLowerCase();

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [{ email: normalizedIdentifier }, { mobile: normalizedIdentifier }]
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('FATAL: JWT_SECRET is not set.');
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '24h' }
    );

    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({ user: userObj, token });
  } catch (error) {
    next(error);
  }
});

export default router;
