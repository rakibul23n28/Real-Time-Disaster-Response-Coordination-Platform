import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  // Multer file size / type errors
  if (err.message.includes("File too large")) {
    res.status(400).json({ success: false, message: "File too large. Maximum size is 5 MB." });
    return;
  }
  if (err.message.includes("Only JPEG")) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  const message = env.nodeEnv === "development" ? err.message : "Internal server error";
  res.status(500).json({ success: false, message });
}
