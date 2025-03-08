// src/middleware/authMiddleware.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export function authMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // TODO: Validate JWT token (placeholder)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // Proceed to the handler
    return handler(req, res);
  };
}
