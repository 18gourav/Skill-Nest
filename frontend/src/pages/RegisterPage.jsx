import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    emailId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h1 className="mb-1 text-3xl font-black">Create Account</h1>
      <p className="mb-6 text-slate-600">Create an account to start enrolling.</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-cyan-500"
          placeholder="Full name"
          value={formData.fullName}
          onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
          required
        />
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-cyan-500"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
          required
        />
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
          minLength={6}
          required
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link className="font-semibold text-cyan-700" to="/login">Login here</Link>
      </p>
    </section>
  );
}
