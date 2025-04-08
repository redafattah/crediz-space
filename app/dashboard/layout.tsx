// app/dashboard/layout.tsx
import { ReactNode, useState } from "react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton";
import { Menu, X } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Topbar */}
      <div className="md:hidden flex justify-between items-center bg-white px-4 py-3 border-b shadow-sm">
        <h1 className="text-lg font-semibold">Espace Client</h1>
        <MobileMenu sessionEmail={session.user.email ?? "Utilisateur"} />
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden md:block w-64 bg-gray-100 border-r p-6">
        <SidebarContent />
        <LogoutButton />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// Sidebar content — used on both mobile and desktop
function SidebarContent() {
  return (
    <ul className="space-y-4 text-sm">
      <li>
        <Link href="/dashboard" className="hover:underline">
          Tableau de bord
        </Link>
      </li>
      <li>
        <Link href="/dashboard/profile" className="hover:underline">
          Mon profil
        </Link>
      </li>
      <li>
        <Link href="/dashboard/loans" className="hover:underline">
          Mes prêts
        </Link>
      </li>
      <li>
        <Link href="/dashboard/agency" className="hover:underline">
          Agence digital
        </Link>
      </li>
    </ul>
  );
}
