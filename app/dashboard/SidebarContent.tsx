"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils" // if you’re using classnames merging utility

export default function SidebarContent() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Tableau de bord" },
    { href: "/dashboard/profile", label: "Mon profil" },
    { href: "/dashboard/loans", label: "Mes prêts" },
    { href: "/dashboard/agency", label: "Agence digital" },
  ]

  return (
    <ul className="space-y-4 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={cn(
              "hover:underline",
              pathname === link.href ? "text-blue-600 font-medium" : "text-gray-800"
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
