"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, 
  Receipt, 
  AlertTriangle, 
  UserCheck, 
  Settings,
  Bell,
  Shield,
  Package,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";


interface BottomNavProps {
  userRole?: string;
}

export default function BottomNav({ userRole = "member" }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  const isWatchman = userRole === "watchman" || userRole === "guard";

  // Watchman-specific bottom nav — only visitors + packages
  const watchmanItems = [
    { href: "/visitors", icon: Shield, label: "Visitors" },
    { href: "/packages", icon: Package, label: "Parcels" },
  ];

  // Member bottom nav
  const memberItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/my-bills", icon: Receipt, label: "Bills" },
    { href: "/complaints", icon: AlertTriangle, label: "Tickets" },
    { href: "/my-visitors", icon: UserCheck, label: "Visitors" },
  ];

  // Admin bottom nav
  const adminItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { href: "/maintenance", icon: Receipt, label: "Bills" },
    { href: "/complaints", icon: AlertTriangle, label: "Tickets" },
    { href: "/visitors", icon: UserCheck, label: "Visitors" },
    { href: "/reminders", icon: Bell, label: "Alerts", roles: ["chairman", "secretary", "treasurer"] },
    { href: "/settings", icon: Settings, label: "Settings", roles: ["chairman"] },
  ];

  let navItems;
  if (isWatchman) {
    navItems = watchmanItems;
  } else if (["chairman", "secretary", "treasurer"].includes(userRole)) {
    navItems = adminItems
      .filter(item => !item.roles || item.roles.includes(userRole))
      .slice(0, 5);
  } else {
    navItems = memberItems;
  }

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 rounded-[1.75rem] border border-white/70 bg-white/95 px-2 pb-safe pt-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-transform duration-300 dark:border-slate-700 dark:bg-[#0f172a]/95 lg:hidden">
      <div className="mx-auto flex h-[60px] max-w-md items-center justify-around gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl transition-all ${
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              <item.icon className={`h-5 w-5 transition-all ${isActive ? "stroke-[2.5px]" : "stroke-[1.7px]"}`} />
              <span className={`max-w-full truncate px-1 text-[10px] leading-none transition-all ${isActive ? "font-black" : "font-semibold"}`}>
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
