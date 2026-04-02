import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses } from "../api/courseApi";
import Reveal from "../components/Reveal";

const highlights = [
  {
    title: "Courses",
    description: "Users can browse the courses and open any course to see the full details.",
  },
  {
    title: "Login",
    description: "Students can log in with email or Google and enroll in the course they want.",
  },
  {
    title: "Dashboard",
    description: "After login, users can see the courses they joined from one place.",
  },
];

const benefits = ["Browse courses", "View details", "Join course", "Admin tools"];

export default function LandingPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await listCourses();
        setCourses(response?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-10 pb-10 text-left">
      <section className="space-y-6">
        <Reveal className="space-y-4">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-sm font-medium text-cyan-800">
            Course platform
          </span>
          <div className="space-y-4 text-left">
            <h1 className="max-w-2xl text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
              Skill Nest helps people find and join courses.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Users can browse courses, check the full details, enroll in a course, and see what
              they joined from their dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/courses"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Explore courses
            </Link>
            <a
              href="#featured"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400"
            >
              See featured courses
            </a>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {benefits.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">Course view</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-cyan-100">Featured course</p>
                  <h3 className="mt-1 text-2xl font-semibold">Full Stack Course Bundle</h3>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-sm text-cyan-100">Courses</p>
                    <p className="mt-1 text-2xl font-bold">10+</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-sm text-cyan-100">Actions</p>
                    <p className="mt-1 text-2xl font-bold">Browse, enroll, manage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="featured" className="space-y-5">
        <Reveal>
          <div className="flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Courses</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                A few courses from the site
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex w-fit rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
            >
              View all courses
            </Link>
          </div>
        </Reveal>

        {error && <p className="text-rose-600">{error}</p>}

        <div className="space-y-5">
          {featuredCourses.map((course, index) => (
            <Reveal key={course._id} delay={index * 100} className="h-full">
              <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:flex-row md:items-center md:justify-between md:gap-6">
                <div className="space-y-3 text-left">
                  <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Course
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">{course.title}</h3>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                    Mentor: {course.mentor || "Skill Nest Mentor"}
                  </p>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600">{course.description}</p>
                </div>
                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 md:mt-0 md:min-w-44 md:border-t-0 md:pt-0 md:text-right">
                  <p className="text-lg font-extrabold text-slate-950">INR {course.price}</p>
                  <Link
                    to={`/courses/${course._id}`}
                    className="rounded-full bg-slate-950 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View details
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}

          {!featuredCourses.length && !error && (
            <Reveal>
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600">
                No courses added yet. Use the admin page to add the first course.
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section id="about" className="space-y-4">
        <Reveal>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Why choose us?</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Kept simple</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
              I kept the site plain so users can go from the landing page to course details and
              dashboard without getting confused.
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 120}>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <footer className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-4 text-left text-sm text-slate-500 shadow-sm">
          Skill Nest has course listing, course details, login, enroll, dashboard, and admin course management.
        </footer>
      </Reveal>
    </div>
  );
}
