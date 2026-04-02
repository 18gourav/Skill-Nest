import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getDashboard } from "../api/authApi";
import Reveal from "../components/Reveal";

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const oauthStatus = searchParams.get("oauth");

    if (oauthStatus === "success") {
      toast.success("Logged in with Google");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setDashboard(response?.data || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch dashboard");
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <p className="text-rose-600">{error}</p>;
  }

  if (!dashboard) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8 text-left">
      <Reveal>
        <div className="space-y-3 text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">User dashboard</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Welcome, {dashboard.fullName}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            This page shows your account details and the courses you have enrolled in.
          </p>
        </div>
      </Reveal>

      <div className="space-y-4">
        <Reveal>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-sm text-slate-500">Username</p>
            <p className="text-lg font-bold">{dashboard.username}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-sm text-slate-500">Email</p>
            <p className="text-lg font-bold">{dashboard.emailId}</p>
          </div>
        </Reveal>
        <Reveal delay={180}>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm">
            <p className="text-sm text-slate-500">Role</p>
            <p className="text-lg font-bold uppercase">{dashboard.role}</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <h2 className="text-2xl font-black tracking-tight text-slate-950">Enrolled Courses</h2>
      </Reveal>

      <div className="space-y-4">
        {(dashboard.enrolledCourses || []).map((course) => (
          <Reveal key={course._id}>
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-sm">
              <h3 className="text-lg font-bold text-slate-950">{course.title}</h3>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Mentor: {course.mentor || "Skill Nest Mentor"}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{course.description}</p>
              <p className="mt-4 font-semibold text-cyan-700">INR {course.price}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {(dashboard.enrolledCourses || []).length === 0 && (
        <p className="text-slate-500">You are not enrolled in any course yet.</p>
      )}
    </section>
  );
}
