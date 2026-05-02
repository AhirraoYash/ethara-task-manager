import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import { apiRateLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/tasks";
import projectRoutes from "./routes/projects";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  await connectDB();

  app.use(cors());
  app.use(express.json());
  app.use("/api", apiRateLimiter);

  // API routes FIRST
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/projects", projectRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
