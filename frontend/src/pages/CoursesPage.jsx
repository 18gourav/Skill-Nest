import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { enrollInCourse, listCourses } from "../api/courseApi";
import Reveal from "../components/Reveal";
import { useAuth } from "../context/useAuth";

export default function CoursesPage() {
  const { user, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await listCourses();
      setCourses(response?.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onEnroll = async (courseId) => {
    if (isAdmin) {
      alert("Admin accounts cannot enroll in courses");
      return;
    }

    try {
      await enrollInCourse(courseId);
      alert("Enrolled successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Enroll failed");
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-8 text-left">
      <Reveal>
        <div className="space-y-3 text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
            Courses
          </p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            See all courses.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Browse the course list, open any course, and enroll when you want.
          </p>
        </div>
      </Reveal>

      {loading && <p className="text-slate-600">Loading courses...</p>}
      {error && <p className="mb-4 text-rose-600">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <p className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-6 text-center text-slate-600">
          No courses found yet. Add one from the admin page first.
        </p>
      )}

      <div className="space-y-5">
        {courses.map((course) => (
          <Reveal key={course._id} className="h-full">
            <article className="flex flex-col gap-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <span className="inline-flex w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Course
                </span>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">{course.title}</h2>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Mentor: {course.mentor || "Skill Nest Mentor"}
                </p>
                <p className="max-w-2xl text-sm leading-7 text-slate-600">{course.description}</p>
              </div>

              <div className="flex flex-col gap-3 md:min-w-52 md:text-right">
                <p className="text-lg font-extrabold text-slate-950">INR {course.price}</p>
                <Link
                  to={`/courses/${course._id}`}
                  className="rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
                >
                  View details
                </Link>

                {user && !isAdmin ? (
                  <button
                    onClick={() => onEnroll(course._id)}
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Enroll
                  </button>
                ) : isAdmin ? (
                  <p className="text-sm text-slate-500">Admin accounts cannot buy courses.</p>
                ) : (
                  <p className="text-sm text-slate-500">Login to enroll in this course.</p>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
