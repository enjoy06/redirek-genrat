import { db } from "@/utils/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "POST") {
        const docRef = doc(db, "users", req.body.id as string);
        await deleteDoc(docRef);
        return res.status(200).json({ message: "User dihapus" });
    }

  return res.status(405).end();

}