import type { Response } from "express";

export function ok(res: Response, data: unknown, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function created(res: Response, data: unknown, message = "Created") {
  return ok(res, data, message, 201);
}

export function paginated(
  res: Response,
  data: unknown[],
  total: number,
  page: number,
  limit: number,
  message = "Success"
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export function fail(res: Response, message: string, statusCode = 400) {
  return res.status(statusCode).json({ success: false, message });
}
