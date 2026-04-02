import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { enrollInCourse, getCourseById } from "../api/courseApi";
import Reveal from "../components/Reveal";
import { useAuth } from "../context/useAuth";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await getCourseById(courseId);
        setCourse(response?.data || null);
        setError("");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const onEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollInCourse(courseId);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Enroll failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading course details...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4 text-left">
        <p className="text-rose-600">{error}</p>
        <Link to="/courses" className="font-semibold text-cyan-700">Back to courses</Link>
      </div>
    );
  }

  if (!course) {
    return <p className="text-slate-600">Course not found.</p>;
  }

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="space-y-4 text-left">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
            Course detail
          </span>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            {course.title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            {course.description}
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Mentor: {course.mentor || "Skill Nest Mentor"}
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">What this course covers</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>• Core concepts with a practical project approach</li>
              <li>• How this is usually done in real projects</li>
              <li>• Authentication, CRUD and dashboard-based workflows</li>
              <li>• A project you can show in interviews and explain easily</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Price</p>
            <p className="mt-3 text-4xl font-black text-slate-950">INR {course.price}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enroll once and check the course later from your dashboard.
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Mentor: {course.mentor || "Skill Nest Mentor"}
            </p>

            <div className="mt-6 space-y-3">
              {user ? (
                <button
                  onClick={onEnroll}
                  disabled={enrolling}
                  className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {enrolling ? "Enrolling..." : "Enroll now"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Login to enroll
                </Link>
              )}
              <Link
                to="/courses"
                className="block w-full rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
              >
                Back to courses
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
