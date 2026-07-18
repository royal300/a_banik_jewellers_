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
    <div className="min-h-screen bg-[oklch(0.18_0.04_25)] text-ivory flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, oklch(0.78 0.13 85) 0%, transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.42 0.19 27) 0%, transparent 50%)",
        }}
      />

      <div className="max-w-md w-full relative z-10 bg-[oklch(0.22_0.04_25)] border-2 border-gold/40 rounded-3xl p-8 sm:p-10 shadow-gold">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-gold grid place-items-center mx-auto mb-4 shadow-gold">
            <Gem className="w-8 h-8 text-deep-red" />
          </div>
          <div className="font-extrabold tracking-wider text-2xl text-ivory">A BANIK JEWELLERS</div>
          <div className="text-xs tracking-[0.3em] text-gold font-bold mt-1 uppercase">Admin Control Panel</div>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/40 border border-red-500/60 rounded-xl p-4 flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Username</label>
            <div className="relative">
              <User className="w-5 h-5 text-gold/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin ID"
                className="w-full bg-black/40 border border-gold/30 rounded-xl pl-12 pr-4 py-3.5 text-ivory placeholder-ivory/30 focus:border-gold outline-none transition-elegant"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gold/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-black/40 border border-gold/30 rounded-xl pl-12 pr-4 py-3.5 text-ivory placeholder-ivory/30 focus:border-gold outline-none transition-elegant"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl gradient-gold text-deep-red font-extrabold text-sm tracking-wider shadow-gold hover:scale-[1.02] active:scale-[0.98] transition-elegant flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            <span>{loading ? "VERIFYING..." : "ENTER DASHBOARD"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gold/20 text-center text-xs text-ivory/50">
          Secure Admin Portal &copy; 2026 A BANIK JEWELLERS
        </div>
      </div>
    </div>
  );
}
