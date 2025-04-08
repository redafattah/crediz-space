"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

import Link from "next/link";
import SidebarContent from "@/app/dashboard/SidebarContent";

export default function MobileMenu({ sessionEmail }: { sessionEmail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)} className="text-gray-700">
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <div className="absolute top-14 left-0 w-full bg-white border-t shadow-md p-6 z-50 space-y-6">
          <div className="text-xs text-gray-500 mb-4">
            Connecté en tant que <span className="font-medium">{sessionEmail}</span>
          </div>
          <SidebarContent />
          <LogoutButton />
        </div>
      )}
    </>
  );
}
