"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  Car,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  FolderOpen,
  HandCoins,
  HardDrive,
  Home,
  IndianRupee,
  Landmark,
  Megaphone,
  MessageSquare,
  Package,
  Phone,
  PiggyBank,
  Receipt,
  RefreshCw,
  Settings,
  Shield,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Vote,
  Wallet,
  Wrench,
} from "lucide-react";
import { useLiveData } from "@/lib/use-live-data";
import { useUser } from "@/lib/user-context";
import { formatCurrency } from "@/lib/utils";

interface DashboardData {
  totalCollected: number;
  pendingAmount: number;
  totalExpenses: number;
  totalMembers: number;
  paidCount: number;
  partialCount: number;
  pendingCount: number;
  totalFlats: number;
  period: string;
  fundBalance: number;
  openComplaints: number;
  visitorsToday: number;
  activePolls: number;
}

interface MyBillsData {
  stats: { totalPending: number; totalPaid: number };
}

type Role = string;
type ModuleItem = {
  label: string;
  href: string;
  icon: typeof Shield;
  roles: Role[];
  note: string;
};
type Category = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Shield;
  color: string;
  shadow: string;
  modules: ModuleItem[];
};

const admin = ["chairman", "secretary", "treasurer"];
const resident = ["member", "tenant"];
const everyone = [...admin, ...resident];

const categories: Category[] = [
  {
    id: "operations",
    title: "Operations",
    subtitle: "Daily Services",
    description: "Gate, staff, parcels, and daily movement.",
    icon: Shield,
    color: "from-violet-600 via-indigo-600 to-blue-700",
    shadow: "shadow-violet-500/20",
    modules: [
      { label: "Security Gate", href: "/visitors", icon: Shield, roles: [...admin, "guard", "watchman"], note: "Visitors and gate records" },
      { label: "My Visitors", href: "/my-visitors", icon: UserCheck, roles: resident, note: "Guests and approvals" },
      { label: "Staff & Daily Help", href: "/staff", icon: Briefcase, roles: everyone, note: "Daily help and attendance" },
      { label: "Parcel Desk", href: "/packages", icon: Package, roles: [...everyone, "guard", "watchman"], note: "Deliveries and pickups" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Payments & Funds",
    description: "Bills, expenses, funds, payroll, and reports.",
    icon: IndianRupee,
    color: "from-emerald-700 via-teal-700 to-cyan-700",
    shadow: "shadow-emerald-500/20",
    modules: [
      { label: "Billing & Ledger", href: "/maintenance", icon: Receipt, roles: admin, note: "Raise and collect dues" },
      { label: "My Bills", href: "/my-bills", icon: CreditCard, roles: resident, note: "Dues, rent, staff payments" },
      { label: "Expenses", href: "/expenses", icon: Wallet, roles: ["chairman", "treasurer"], note: "Society spending" },
      { label: "Fund Accounts", href: "/funds", icon: PiggyBank, roles: ["chairman", "treasurer"], note: "Reserve and corpus" },
      { label: "Budget Planning", href: "/budgets", icon: TrendingUp, roles: ["chairman", "treasurer"], note: "Plan vs actuals" },
      { label: "Staff Payroll", href: "/salaries", icon: HandCoins, roles: ["chairman", "treasurer"], note: "Society staff salary" },
      { label: "Reports", href: "/reports", icon: FileText, roles: admin, note: "Financial summaries" },
    ],
  },
  {
    id: "community",
    title: "Community",
    subtitle: "People & Shared Life",
    description: "Announcements, helpdesk, amenities, parking, and safety.",
    icon: Megaphone,
    color: "from-blue-700 via-indigo-600 to-violet-700",
    shadow: "shadow-blue-500/20",
    modules: [
      { label: "Announcements", href: "/notices", icon: Megaphone, roles: everyone, note: "Society updates" },
      { label: "Helpdesk", href: "/complaints", icon: AlertTriangle, roles: everyone, note: "Complaints and requests" },
      { label: "Resident Directory", href: "/directory", icon: BookOpen, roles: everyone, note: "Find residents" },
      { label: "Discussion Forum", href: "/forum", icon: MessageSquare, roles: everyone, note: "Neighbourhood discussions" },
      { label: "Events & Calendar", href: "/events", icon: CalendarCheck, roles: everyone, note: "Society events" },
      { label: "Amenity Booking", href: "/amenities", icon: Building2, roles: everyone, note: "Book shared spaces" },
      { label: "Buy & Sell", href: "/marketplace", icon: ShoppingBag, roles: everyone, note: "Resident marketplace" },
      { label: "Parking", href: "/parking", icon: Car, roles: everyone, note: "Slots and vehicles" },
      { label: "SOS & Safety", href: "/emergency", icon: Phone, roles: everyone, note: "Emergency help" },
    ],
  },
  {
    id: "governance",
    title: "Governance",
    subtitle: "Decisions & Records",
    description: "Meetings, voting, and documents.",
    icon: Vote,
    color: "from-fuchsia-700 via-purple-700 to-indigo-700",
    shadow: "shadow-fuchsia-500/20",
    modules: [
      { label: "Meetings", href: "/meetings", icon: FileText, roles: everyone, note: "Agenda and minutes" },
      { label: "Polls & Voting", href: "/polls", icon: Vote, roles: everyone, note: "Resident decisions" },
      { label: "Document Vault", href: "/documents", icon: FolderOpen, roles: everyone, note: "Society records" },
    ],
  },
  {
    id: "management",
    title: "Management",
    subtitle: "Setup & Control",
    description: "Residents, tenants, vendors, assets, audit, and settings.",
    icon: Settings,
    color: "from-rose-700 via-red-700 to-orange-700",
    shadow: "shadow-rose-500/20",
    modules: [
      { label: "Residents", href: "/members", icon: Users, roles: admin, note: "Owners and members" },
      { label: "Tenants", href: "/tenants", icon: UserPlus, roles: admin, note: "Tenant lifecycle" },
      { label: "Move In / Out", href: "/move-events", icon: ClipboardList, roles: admin, note: "Occupancy changes" },
      { label: "Vendor Hub", href: "/vendors", icon: Wrench, roles: admin, note: "Vendors and AMCs" },
      { label: "Asset Register", href: "/assets", icon: HardDrive, roles: admin, note: "Society assets" },
      { label: "Audit Trail", href: "/activity-log", icon: FileText, roles: admin, note: "Action history" },
      { label: "Settings", href: "/settings", icon: Settings, roles: ["chairman", "secretary"], note: "Society setup" },
    ],
  },
];

const roleLabels: Record<string, string> = {
  chairman: "Chairman",
  secretary: "Secretary",
  treasurer: "Treasurer",
  member: "Flat Member",
  tenant: "Tenant",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function CategoryCard({ category, expanded, count, onClick }: { category: Category; expanded: boolean; count: number; onClick: () => void }) {
  const Icon = category.icon;
  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={`relative flex h-[176px] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-4 text-left text-white transition-all duration-300 ${
        expanded
          ? `shadow-lg ${category.shadow} ring-2 ring-white/70`
          : "shadow-sm opacity-95 hover:opacity-100"
      }`}
    >
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">{category.subtitle}</p>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight">{category.title}</h2>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div>
          <p className="line-clamp-2 max-w-md text-sm leading-5 text-white/85">{category.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">{count} modules</span>
            <span className="flex items-center gap-1 text-xs font-black">
              {expanded ? "Hide" : "Open"} <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </span>
          </div>
        </div>
      </div>
      <Icon className="absolute -bottom-10 -right-8 h-40 w-40 text-white/10" />
    </motion.button>
  );
}

function ModuleCard({ module }: { module: ModuleItem }) {
  const Icon = module.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
      <Link href={module.href} className="group flex min-h-[104px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/7 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Icon className="h-4 w-4" />
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-slate-950">{module.label}</h3>
          <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-500">{module.note}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function CategoryWorkspace({ category, isAdmin }: { category: Category; isAdmin: boolean }) {
  const quickActions = {
    operations: [
      { label: isAdmin ? "Gate Activity" : "Approve Visitors", href: isAdmin ? "/visitors" : "/my-visitors", icon: Shield },
      { label: "Parcel Desk", href: "/packages", icon: Package },
      { label: "Emergency Contacts", href: "/emergency", icon: Phone },
    ],
    finance: [
      { label: isAdmin ? "Raise Invoice" : "Pay Dues", href: isAdmin ? "/maintenance" : "/my-bills", icon: Receipt },
      { label: "Record Expense", href: "/expenses", icon: Wallet },
      { label: "View Collections", href: "/reports", icon: TrendingUp },
    ],
    community: [
      { label: "Create Notice", href: "/notices", icon: Megaphone },
      { label: "Open Complaints", href: "/complaints", icon: AlertTriangle },
      { label: "Upcoming Events", href: "/events", icon: CalendarCheck },
    ],
    governance: [
      { label: "New Poll", href: "/polls", icon: Vote },
      { label: "Meeting Records", href: "/meetings", icon: FileText },
      { label: "Documents", href: "/documents", icon: FolderOpen },
    ],
    management: [
      { label: "Residents", href: "/members", icon: Users },
      { label: "Tenants", href: "/tenants", icon: UserPlus },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  }[category.id] || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-b-2xl"
    >
      <div className="relative rounded-[1.75rem] border border-white/80 bg-white/95 p-5 shadow-md shadow-slate-900/5 backdrop-blur sm:p-6">
        <div className={`absolute left-8 top-0 h-1.5 w-24 rounded-b-full bg-gradient-to-r ${category.color}`} />
        <div className="absolute -top-3 left-10 h-3 w-10 rounded-t-xl bg-white/95" />

        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Workspace</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{category.title}</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">{category.description}</p>
          </div>
          <span className="hidden rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 sm:inline">
            No crowded menus
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {category.modules.map((module) => <ModuleCard key={module.href} module={module} />)}
        </div>

        {quickActions.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Quick Actions</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex min-h-[72px] flex-col justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-950 shadow-[0_1px_4px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)]"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3">
          <BellRing className="h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-xs font-black text-slate-950">Recent activity</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">Latest updates from this area appear in notifications and module pages.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, loaded } = useUser();
  const [expanded, setExpanded] = useState("operations");
  const isAdmin = admin.includes(user?.role || "");

  const { data, loading, isStale } = useLiveData<DashboardData>({ url: "/api/dashboard", interval: 60_000, enabled: true });
  const { data: myBills } = useLiveData<MyBillsData>({
    url: "/api/my-bills",
    interval: 60_000,
    enabled: loaded && !isAdmin && !!user?.flatNumber,
  });

  const visibleCategories = useMemo(() => {
    const role = user?.role || "member";
    return categories
      .map((category) => ({ ...category, modules: category.modules.filter((module) => module.roles.includes(role)) }))
      .filter((category) => category.modules.length > 0);
  }, [user?.role]);

  const dueAmount = isAdmin ? data?.pendingAmount || 0 : myBills?.stats.totalPending || 0;
  const paidAmount = isAdmin ? data?.totalCollected || 0 : myBills?.stats.totalPaid || 0;

  return (
    <div className="-m-4 min-h-full bg-[#fbf7f5] p-4 lg:-m-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                  {roleLabels[user?.role || ""] || user?.role || "User"}
                </span>
                {isStale && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary sm:text-5xl">Manage Society</h1>
              <p className="mt-2 text-sm text-text-secondary">
                {greeting()}, {user?.name || "User"} · {user?.societyName || "Your society"} {user?.flatNumber ? `· Flat ${user.flatNumber}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[360px] lg:grid-cols-2">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{isAdmin ? "Pending" : "My Dues"}</p>
                <p className="mt-1 text-xl font-black text-primary">{formatCurrency(dueAmount)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{isAdmin ? "Collected" : "Paid"}</p>
                <p className="mt-1 text-xl font-black text-emerald-700">{formatCurrency(paidAmount)}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Visitors</p>
                <p className="mt-1 text-xl font-black text-amber-700">{loading ? "--" : data?.visitorsToday || 0}</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Helpdesk</p>
                <p className="mt-1 text-xl font-black text-blue-700">{loading ? "--" : data?.openComplaints || 0}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {visibleCategories.map((category) => (
            <motion.div key={category.id} layout className={expanded === category.id ? "space-y-3 md:col-span-2" : "space-y-3"}>
              <CategoryCard
                category={category}
                expanded={expanded === category.id}
                count={category.modules.length}
                onClick={() => setExpanded(category.id)}
              />
              <AnimatePresence initial={false}>
                {expanded === category.id && (
                  <CategoryWorkspace category={category} isAdmin={isAdmin} />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href={isAdmin ? "/maintenance" : "/my-bills"} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <Receipt className="mb-4 h-6 w-6 text-primary" />
            <h3 className="font-black text-text-primary">{isAdmin ? "Raise invoices" : "Pay bills"}</h3>
            <p className="mt-1 text-xs text-text-secondary">Fast access to the most common finance action.</p>
          </Link>
          <Link href={isAdmin ? "/visitors" : "/my-visitors"} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <Shield className="mb-4 h-6 w-6 text-emerald-600" />
            <h3 className="font-black text-text-primary">{isAdmin ? "Gate activity" : "Approve visitors"}</h3>
            <p className="mt-1 text-xs text-text-secondary">Visitor and security flows in one tap.</p>
          </Link>
          <Link href="/notices" className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <BellRing className="mb-4 h-6 w-6 text-amber-600" />
            <h3 className="font-black text-text-primary">Latest updates</h3>
            <p className="mt-1 text-xs text-text-secondary">Announcements and important society communication.</p>
          </Link>
        </section>
      </div>
    </div>
  );
}
