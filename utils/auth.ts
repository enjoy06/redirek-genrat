// lib/auth.ts
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export const verifyLogin = async (username: string, password: string) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), where("role", "==", "ketua"));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("User not found or not ketua");
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();

  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return {
    id: userDoc.id,
    username: userData.username,
    role: userData.role,
  };
};