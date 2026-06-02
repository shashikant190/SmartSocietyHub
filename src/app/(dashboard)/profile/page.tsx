"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Car,
  CreditCard,
  Headphones,
  Home,
  Languages,
  LogOut,
  Settings,
  Shield,
  UserRound,
} from "lucide-react";
import { useUser } from "@/lib/user-context";
import { useI18n } from "@/lib/i18n";

const roleLabels: Record<string, string> = {
  chairman: "Chairman",
  secretary: "Secretary",
  treasurer: "Treasurer",
  member: "Flat Member",
  tenant: "Tenant",
  guard: "Security Guard",
  watchman: "Watchman",
  vendor_staff: "Vendor",
  facility_manager: "Facility Manager",
};

function getInitials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return letters.slice(0, 2) || "U";
}

export default function ProfilePage() {
  const { user, loaded } = useUser();
  const { t } = useI18n();
  const router = useRouter();
  const initials = getInitials(user.name || "User");
  const isAdmin = ["chairman", "secretary", "treasurer"].includes(user.role);
  const isGuard = ["guard", "watchman"].includes(user.role);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore logout network errors and still move the user out locally
    }
    router.push("/login");
    router.refresh();
  };

  const options = [
    { href: "/parking", label: "My Vehicles", note: "Parking and vehicle details", icon: Car },
    { href: isAdmin ? "/maintenance" : "/my-bills", label: "Payment Methods", note: isAdmin ? "Billing and collections" : "Bills, receipts, and payments", icon: CreditCard },
    { href: "/notices", label: "Notifications", note: "Alerts and updates", icon: Bell },
    { href: "/settings", label: "Settings", note: isAdmin ? "Society and account settings" : "Account preferences", icon: Settings },
    { href: "/settings", label: "Language", note: "English, Hindi, Marathi", icon: Languages },
    { href: "/emergency", label: "Help & Support", note: "Emergency and support contacts", icon: Headphones },
  ].filter((item) => !(isGuard && item.label === "Payment Methods"));

  if (!loaded) {
    return (
      <div className="-m-3 min-h-full bg-[#fff7ed] p-3 pb-28 dark:bg-[#0f172a] sm:-m-4 sm:p-4 lg:-m-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-5">
          <section className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-orange-500 to-orange-700 p-5 text-white shadow-lg shadow-orange-500/20 sm:p-7">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 animate-pulse rounded-[1.6rem] bg-white/20" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-3 w-20 animate-pulse rounded-full bg-white/25" />
                <div className="h-8 w-48 max-w-full animate-pulse rounded-full bg-white/25" />
                <div className="h-4 w-28 animate-pulse rounded-full bg-white/20" />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[0, 1].map((item) => (
              <div key={item} className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#111827]">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 animate-pulse rounded-2xl bg-orange-50 dark:bg-orange-500/10" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                    <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-3 min-h-full bg-[#fff7ed] p-3 pb-28 dark:bg-[#0f172a] sm:-m-4 sm:p-4 lg:-m-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <section className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-orange-500 to-orange-700 p-5 text-white shadow-lg shadow-orange-500/20 sm:p-7">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] border border-white/25 bg-white/18 text-3xl font-black shadow-inner backdrop-blur">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/75">{t("Profile")}</p>
              <h1 className="mt-1 truncate text-2xl font-black tracking-tight sm:text-3xl">{user.name || t("User")}</h1>
              <p className="mt-1 truncate text-sm font-semibold text-white/80">{t(roleLabels[user.role] || user.role || "User")}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary dark:bg-orange-500/10">
                <Home className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t("Society")}</p>
                <p className="truncate text-sm font-black text-text-primary">{user.societyName || t("Your society")}</p>
                {user.flatNumber && <p className="mt-0.5 text-xs font-semibold text-text-secondary">{t("Flat")} {user.flatNumber}</p>}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-primary dark:bg-orange-500/10">
                <Shield className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t("Account")}</p>
                <p className="truncate text-sm font-black text-text-primary">{user.email || t("Email not added")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-orange-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-[#111827]">
          <div className="space-y-1">
            {options.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex min-h-16 items-center gap-3 rounded-3xl px-3 py-3 transition-colors hover:bg-orange-50 dark:hover:bg-slate-800"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-primary dark:bg-orange-500/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-text-primary">{t(item.label)}</p>
                    <p className="mt-0.5 truncate text-xs font-semibold text-text-secondary">{t(item.note)}</p>
                  </div>
                  <UserRound className="h-4 w-4 shrink-0 text-text-secondary" />
                </Link>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-3xl bg-danger px-5 text-sm font-black text-white shadow-lg shadow-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          {t("Sign Out")}
        </button>
      </div>
    </div>
  );
}
