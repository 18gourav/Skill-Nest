import { useEffect, useState } from "react";
import { createCourse, deleteCourse, listCourses, updateCourse } from "../api/courseApi";

const emptyForm = { title: "", description: "", mentor: "", price: "" };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await listCourses();
      setCourses(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch courses");
    }
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const response = await listCourses();
        if (mounted) {
          setCourses(response?.data || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || "Failed to fetch courses");
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = { ...formData, price: Number(formData.price), mentor: formData.mentor || "Skill Nest Mentor" };

      if (editingId) {
        await updateCourse(editingId, payload);
      } else {
        await createCourse(payload);
      }

      setFormData(emptyForm);
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (course) => {
    setEditingId(course._id);
    setFormData({
      title: course.title,
      description: course.description,
      mentor: course.mentor || "Skill Nest Mentor",
      price: course.price,
    });
  };

  const onDelete = async (id) => {
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section>
      <h1 className="mb-2 text-4xl font-black tracking-tight">Admin Courses</h1>
      <p className="mb-8 text-slate-600">Add, edit, and remove courses from here.</p>

      <form onSubmit={onSubmit} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 xl:grid-cols-4">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
          placeholder="Mentor"
          value={formData.mentor}
          onChange={(e) => setFormData((prev) => ({ ...prev, mentor: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500"
          type="number"
          min="0"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
          required
        />
        <button className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 sm:col-span-2 xl:col-span-4">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      {error && <p className="mb-4 text-rose-600">{error}</p>}

      <div className="space-y-4">
        {courses.map((course) => (
          <article key={course._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">{course.title}</h2>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Mentor: {course.mentor || "Skill Nest Mentor"}
                </p>
                <p className="max-w-3xl text-slate-600">{course.description}</p>
                <p className="font-semibold text-cyan-700">INR {course.price}</p>
              </div>

              <div className="flex gap-2 md:shrink-0">
                <button
                  onClick={() => onEdit(course)}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(course._id)}
                  className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
