"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import UserTable from "@/components/admin/UserTable";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isKetua, setIsKetua] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth.admin/");
      if (res.ok) {
        const data = await res.json();
        if (data.user.role === "ketua") {
          setIsKetua(true);
        } else {
          router.push("/login/admin");
        }
      } else {
        router.push("/login/admin");
      }
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!isKetua) return null;

  return (
    <>
      <AdminNavbar />
      <UserTable />
    </>
  );
}
