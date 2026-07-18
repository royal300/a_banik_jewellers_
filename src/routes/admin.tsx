import { useEffect, useState } from "react";
import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Grid,
  ShoppingBag,
  Image as ImageIcon,
  TrendingUp,
  LogOut,
  ExternalLink,
  Gem,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("abj_admin");
    if (!token || token !== "abj_admin_token_active") {
      navigate({ to: "/admin/login" });
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("abj_admin");
    navigate({ to: "/admin/login" });
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[oklch(0.18_0.04_25)] text-ivory flex items-center justify-center">
        <div className="text-gold tracking-widest font-bold text-lg animate-pulse">VERIFYING ADMIN ACCESS...</div>
      </div>
    );
  }

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/categories", label: "Categories", icon: Grid },
    { to: "/admin/products", label: "Products & Gallery", icon: ShoppingBag },
    { to: "/admin/media-manager", label: "Media Manager", icon: ImageIcon },
    { to: "/admin/rates", label: "Live Metal Rates", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.18_0.04_25)] text-ivory flex flex-col lg:flex-row font-sans">
      {/* Mobile top bar */}
      <div className="lg:hidden bg-[oklch(0.22_0.04_25)] border-b border-gold/30 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-gold grid place-items-center">
            <Gem className="w-5 h-5 text-deep-red" />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-base">A BANIK ADMIN</div>
            <div className="text-[10px] tracking-widest text-gold uppercase">Management Portal</div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="p-2 rounded-lg border border-gold/40 text-gold"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[oklch(0.22_0.04_25)] border-r border-gold/30 flex flex-col justify-between p-6 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="hidden lg:flex items-center gap-3 mb-8 pb-6 border-b border-gold/20">
            <div className="w-12 h-12 rounded-full gradient-gold grid place-items-center shadow-gold shrink-0">
              <Gem className="w-6 h-6 text-deep-red" />
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-lg text-ivory">A BANIK</div>
              <div className="text-xs tracking-[0.25em] text-gold font-bold">ADMIN PANEL</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                activeProps={{ className: "bg-gold text-deep-red font-extrabold shadow-gold" }}
                inactiveProps={{ className: "text-ivory/80 hover:bg-gold/15 hover:text-gold" }}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-elegant"
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-gold/20">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gold/50 text-gold hover:bg-gold hover:text-deep-red transition-elegant text-sm font-bold"
          >
            <ExternalLink className="w-4 h-4" />
            <span>VIEW LIVE SITE</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-900/60 border border-red-500/50 text-red-200 hover:bg-red-800 transition-elegant text-sm font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
