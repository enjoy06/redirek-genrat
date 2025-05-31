import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  const memberToken = req.cookies.session_member;

  if (!memberToken) {
    return res.status(401).json({ message: "Sesi Login tidak ditemukan." });
  }

  try {

    if (memberToken) {
      const decoded = jwt.verify(memberToken, JWT_SECRET) as any;
      if (decoded.role === "member") {
        return res.status(200).json({ user: decoded, role: "member" });
      }
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
