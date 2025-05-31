import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ketuaToken = req.cookies.token;

  if (!ketuaToken) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {

    if (ketuaToken) {
      const decoded = jwt.verify(ketuaToken, JWT_SECRET) as any;
      if (decoded.role === "ketua") {
        return res.status(200).json({ user: decoded, role: "ketua" });
      }
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
