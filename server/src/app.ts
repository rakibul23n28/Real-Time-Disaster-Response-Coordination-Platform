import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env.js";
import { testConnection } from "./config/database.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

// Routes
import authRoutes         from "./routes/auth.routes.js";
import reportRoutes       from "./routes/report.routes.js";
import taskRoutes         from "./routes/task.routes.js";
import issueRoutes        from "./routes/issue.routes.js";
import resourceRoutes     from "./routes/resource.routes.js";
import inventoryRoutes    from "./routes/inventory.routes.js";
import allocationRoutes   from "./routes/allocation.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRoutes    from "./routes/dashboard.routes.js";
import mapRoutes          from "./routes/map.routes.js";
import publicRoutes       from "./routes/public.routes.js";

const app = express();

// CORS
app.use(cors({ origin: env.frontendUrl, credentials: true }));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check
app.get("/api/v1/health", async (_req, res) => {
  try {
    await testConnection();
    res.json({ success: true, message: "Server is running", db: "connected" });
  } catch {
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});

// API routes
app.use("/api/v1/auth",          authRoutes);
app.use("/api/v1/reports",       reportRoutes);
app.use("/api/v1/tasks",         taskRoutes);
app.use("/api/v1/issues",        issueRoutes);
app.use("/api/v1/resources",     resourceRoutes);
app.use("/api/v1/inventory",     inventoryRoutes);
app.use("/api/v1/allocations",   allocationRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard",     dashboardRoutes);
app.use("/api/v1/map",           mapRoutes);
app.use("/api/v1/public",        publicRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
