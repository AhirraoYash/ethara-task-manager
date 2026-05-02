import { Router } from "express";
import { db } from "../data/mockDatabase";

const router = Router();

router.post("/login", (req, res) => {
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    console.log(`[LOGIN FAILED] Missing credentials`);
    return res.status(400).json({ error: "Missing credentials" });
  }

  const normalizedIdentifier = String(identifier).trim().toLowerCase();
  console.log(`[LOGIN ATTEMPT] normalizedIdentifier: "${normalizedIdentifier}", password: "${password}"`);

  // Find user by email (Admin or Member)
  const user = db.users.find((u) => {
    return u.email?.toLowerCase() === normalizedIdentifier && u.password === password;
  });

  if (!user) {
    console.log(`[LOGIN FAILED] Invalid credentials for "${identifier}"`);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // In a real app we'd return a JWT. Here we just return the user object.
  // DO NOT send back password in real app.
  const { password: _, ...userWithoutPassword } = user;
  
  console.log(`[LOGIN SUCCESS] User: ${user.id} (${user.role})`);
  res.json({ user: userWithoutPassword });
});

export default router;
