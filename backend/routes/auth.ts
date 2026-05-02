import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { authRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/login", authRateLimiter, async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

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

    const secret = process.env.JWT_SECRET || 'default_secret';
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
