import { useEffect, useState } from "react";
import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  const location = useRouterState({ select: (s) => s.location });
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    const token = localStorage.getItem("abj_admin");
    if (!token || token !== "abj_admin_token_active") {
      navigate({ to: "/admin/login" });
    } else {
      setAuthorized(true);
    }
  }, [navigate, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("abj_admin");
    navigate({ to: "/admin/login" });
  };

  if (isLoginPage) {
    return <Outlet />;
  }

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
    <div
      className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex flex-col lg:flex-row font-sans selection:bg-red-600 selection:text-white"
      style={{ zoom: "0.78" }}
    >
      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 grid place-items-center shadow-sm">
            <Gem className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-sm text-gray-900">A BANIK ADMIN</div>
            <div className="text-[9px] tracking-widest text-red-600 font-bold uppercase">Management Portal</div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between p-5 z-40 transition-transform duration-300 shadow-sm ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="hidden lg:flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 grid place-items-center shadow-md shadow-red-600/20 shrink-0">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-base text-gray-900">A BANIK</div>
              <div className="text-[10px] tracking-[0.2em] text-red-600 font-bold uppercase">ADMIN PANEL</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                activeProps={{ className: "bg-red-600 text-white font-bold shadow-md shadow-red-600/20" }}
                inactiveProps={{ className: "text-gray-600 hover:bg-red-50 hover:text-red-700 font-medium" }}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm transition-all"
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-2.5 pt-5 border-t border-gray-100">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50/50 transition-all text-xs font-bold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>VIEW LIVE SITE</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-600 hover:text-white transition-all text-xs font-bold shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
