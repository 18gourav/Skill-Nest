import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
