import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");

    if (!oauthStatus) {
      return;
    }

    if (oauthStatus === "success") {
      toast.success("Google login successful");
      navigate("/dashboard", { replace: true });
    } else if (oauthStatus === "error") {
      toast.error("Google login failed");
    } else if (oauthStatus === "missing") {
      toast.error("Google login is not configured");
    }

    setSearchParams({}, { replace: true });
  }, [navigate, searchParams, setSearchParams]);

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"}/users/google`;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h1 className="mb-1 text-3xl font-black">Welcome Back</h1>
      <p className="mb-6 text-slate-600">Login to continue.</p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={googleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-500 hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-1.9 3.1l3 2.3c1.8-1.6 2.8-4.1 2.8-7 0-.7-.1-1.5-.2-2.2H12z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.5-2.5l-3-2.3c-.8.6-2 1-3.5 1-2.7 0-5-1.8-5.8-4.3l-3.1 2.4C4.7 19.7 8.1 22 12 22z" />
            <path fill="#4A90E2" d="M6.2 13.9c-.2-.6-.3-1.3-.3-1.9s.1-1.3.3-1.9L3.1 7.7C2.4 9 2 10.5 2 12s.4 3 1.1 4.3l3.1-2.4z" />
            <path fill="#FBBC05" d="M12 5.8c1.5 0 2.9.5 3.9 1.5l2.9-2.9C16.9 2.6 14.7 2 12 2 8.1 2 4.7 4.3 3.1 7.7l3.1 2.4c.8-2.5 3.1-4.3 5.8-4.3z" />
          </svg>
          Login with Google
        </button>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-cyan-500"
          type="email"
          placeholder="Email"
          value={formData.emailId}
          onChange={(e) => setFormData((prev) => ({ ...prev, emailId: e.target.value }))}
          required
        />
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-cyan-500"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          required
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Don’t have an account? <Link className="font-semibold text-cyan-700" to="/register">Register here</Link>
      </p>
    </section>
  );
}
