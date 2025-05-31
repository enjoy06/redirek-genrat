import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await addDoc(collection(db, "users"), {
      username,
      password: hashed,
      role: "member",
      createdAt: serverTimestamp(),
    });

    return res.status(201).json({ message: "User berhasil dibuat" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan saat membuat user" });
  }
}
