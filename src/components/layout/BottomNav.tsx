"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Building2,
  Grid3X3,
  Home,
  Shield,
  UserRound,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";


interface BottomNavProps {
  userRole?: string;
}

export default function BottomNav({ userRole = "member" }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  const isWatchman = userRole === "watchman" || userRole === "guard";
  const isAdmin = ["chairman", "secretary", "treasurer"].includes(userRole);
  const navItems = [
    { id: "home", href: "/dashboard", icon: Home, label: "Home" },
    { id: "society", href: isWatchman ? "/gate" : "/directory", icon: Building2, label: "Society" },
    { id: "services", href: isWatchman ? "/visitors" : isAdmin ? "/visitors" : "/staff", icon: Grid3X3, label: "Services" },
    { id: "activity", href: isWatchman ? "/packages" : "/notices", icon: Activity, label: "Activity" },
    { id: "profile", href: "/profile", icon: isWatchman ? Shield : UserRound, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 rounded-[1.85rem] border border-orange-100/80 bg-white/95 px-2 pb-safe pt-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-[#111827]/95 lg:hidden">
      <div className="mx-auto flex h-[68px] max-w-md items-center justify-around gap-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isCenter = item.id === "services";
          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={`flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl transition-all ${
                isActive && !isCenter ? "text-primary" : "text-text-secondary hover:text-primary"
              }`}
            >
              <span className={`flex items-center justify-center transition-all ${
                isCenter
                  ? "mb-0.5 h-11 w-11 rounded-full bg-linear-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-500/35"
                  : isActive
                    ? "h-8 w-8 rounded-2xl bg-orange-50 text-primary dark:bg-orange-500/15"
                    : "h-8 w-8"
              }`}>
                <item.icon className={`h-5 w-5 transition-all ${isActive || isCenter ? "stroke-[2.5px]" : "stroke-[1.8px]"}`} />
              </span>
              <span className={`max-w-full truncate px-1 text-[10px] leading-none transition-all ${isActive ? "font-black text-primary" : "font-semibold"}`}>
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
