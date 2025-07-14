'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.email}</h1>
    </div>
  );
}
