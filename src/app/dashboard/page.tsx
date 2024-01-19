"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  return (
    <main>
      <Button onClick={() => signOut()} className="flex flex-row gap-2">
        <LogOut width={18} /> SignOut
      </Button>
      <p>dashboard</p>
    </main>
  );
}
