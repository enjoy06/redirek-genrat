// pages/api/login.admin.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken"; // Kita tetap pakai jsonwebtoken di API (Node.js runtime)
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

const users = [
  { username: "zdev", passwordHash: "ADMIN", role: "ketua" }, // contoh
  // Tambah user lain sesuai DB-mu
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(401).json({ message: "Username tidak ditemukan" });

  const validPassword = await bcrypt.compare(password, users.passwordHash);
  if (!validPassword) return res.status(401).json({ message: "Password salah" });

  // Generate JWT token
  const token = sign({ username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: "5m",
  });

  // Set HTTP-only cookie
  res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; Secure`);

  res.status(200).json({ message: "Login sukses" });
}
