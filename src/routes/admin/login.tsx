import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Gem, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password: password.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("abj_admin", data.token);
        navigate({ to: "/admin" });
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch {
      setError("Failed to connect to server. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#FAF8F8] via-[#F8F9FA] to-[#F0EAEA] text-[#1A1A1A] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-red-600 selection:text-white"
      style={{ zoom: "0.78" }}
    >
      {/* Background subtle red radial glow */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(220, 38, 38, 0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-md w-full relative z-10 bg-white border border-red-100/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-red-950/5">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 grid place-items-center mx-auto mb-4 shadow-md shadow-red-600/20">
            <Gem className="w-7 h-7 text-white" />
          </div>
          <div className="font-extrabold tracking-wider text-2xl text-gray-900">A BANIK JEWELLERS</div>
          <div className="text-[11px] tracking-[0.25em] text-red-600 font-bold mt-1 uppercase">Admin Control Panel</div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID"
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm tracking-wider shadow-md shadow-red-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            <span>{loading ? "VERIFYING..." : "ENTER DASHBOARD"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          Secure Admin Portal &copy; 2026 A BANIK JEWELLERS
        </div>
      </div>
    </div>
  );
}
