"use client"

import { useState } from "react"

type NewsPost = {
  id: number
  title: string
  summary: string
  content: string
  category: string
  emoji: string
  published_at: Date
}

const categories = ["Latest News", "Announcements", "Cohort Updates"]
const emojis = ["📰", "🎓", "📢", "🌍", "🤝", "⭐", "💻", "🏆", "❤️", "🙌"]

const empty = {
  title: "",
  summary: "",
  content: "",
  category: "Latest News",
  emoji: "📰",
}

export default function NewsClient({ posts }: { posts: NewsPost[] }) {
  const [list, setList] = useState(posts)
  const [selected, setSelected] = useState<NewsPost | null>(null)
  const [mode, setMode] = useState<"view" | "add" | "edit">("view")
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const openAdd = () => {
    setForm(empty)
    setSelected(null)
    setMode("add")
    setError("")
  }

  const openEdit = (post: NewsPost) => {
    setForm({
      title: post.title,
      summary: post.summary,
      content: post.content,
      category: post.category,
      emoji: post.emoji,
    })
    setSelected(post)
    setMode("edit")
    setError("")
  }

  const handleSave = async () => {
    setError("")
    if (!form.title || !form.summary || !form.content) {
      setError("Title, summary and content are required.")
      return
    }
    setLoading(true)
    try {
      if (mode === "add") {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        setList((prev) => [data.post, ...prev])
      } else if (mode === "edit" && selected) {
        const res = await fetch(`/api/news/${selected.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        setList((prev) =>
          prev.map((p) => (p.id === selected.id ? data.post : p))
        )
        setSelected(data.post)
      }
      setMode("view")
      setForm(empty)
    } catch {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      setList((prev) => prev.filter((p) => p.id !== id))
      if (selected?.id === id) { setSelected(null); setMode("view") }
      setDeleteConfirm(null)
    } catch {
      alert("Something went wrong.")
    }
    setLoading(false)
  }

  const categoryColor = (cat: string) => {
    if (cat === "Announcements") return { bg: "#e0f7fa", text: "#00838f" }
    if (cat === "Cohort Updates") return { bg: "#fef3c7", text: "#92400e" }
    return { bg: "#fef2f2", text: "#dc2626" }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-gray-500 text-sm mt-1">
            {list.length} post{list.length !== 1 ? "s" : ""} published.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:-translate-y-0.5 transition-all"
          style={{ backgroundColor: "#dc2626" }}
        >
          + New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Posts List */}
        <div className="flex flex-col gap-3">
          {list.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
              <div className="text-4xl mb-3">📰</div>
              <p>No posts yet. Click "+ New Post" to create one.</p>
            </div>
          ) : (
            list.map((post) => {
              const cc = categoryColor(post.category)
              return (
                <div
                  key={post.id}
                  onClick={() => { setSelected(post); setMode("view") }}
                  className="bg-white rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md p-4"
                  style={{
                    borderColor: selected?.id === post.id ? "#dc2626" : "#e5e7eb",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: cc.bg }}
                    >
                      {post.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: cc.bg, color: cc.text }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Detail / Form Panel */}
        <div className="sticky top-6">

          {/* Add / Edit Form */}
          {(mode === "add" || mode === "edit") && (
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "#f3f4f6" }}
              >
                <h2 className="font-bold text-gray-900">
                  {mode === "add" ? "New Post" : "Edit Post"}
                </h2>
                <button
                  onClick={() => { setMode("view"); setError("") }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                {/* Emoji picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((e) => (
                      <button
                        key={e}
                        onClick={() => setForm({ ...form, emoji: e })}
                        className="w-9 h-9 rounded-lg text-lg transition-all border-2"
                        style={
                          form.emoji === e
                            ? { borderColor: "#dc2626", backgroundColor: "#fef2f2" }
                            : { borderColor: "#e5e7eb" }
                        }
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                        style={
                          form.category === cat
                            ? { backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff" }
                            : { borderColor: "#e5e7eb", color: "#374151" }
                        }
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Post title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Summary * <span className="text-gray-300 normal-case font-normal">(shown on news list)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short summary shown on the news page..."
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Full Content *
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Full article content..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setMode("view"); setError("") }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-200 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    {loading ? "Saving..." : mode === "add" ? "Publish Post" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Panel */}
          {mode === "view" && !selected && (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
              <div className="text-4xl mb-3">📰</div>
              <p className="text-sm">Click a post to view it or click "+ New Post"</p>
            </div>
          )}

          {mode === "view" && selected && (
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "#f3f4f6" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selected.emoji}</span>
                  <div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: categoryColor(selected.category).bg, color: categoryColor(selected.category).text }}
                    >
                      {selected.category}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(selected.published_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(selected)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-all"
                    style={{ borderColor: "#00BCD4", color: "#00BCD4" }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(selected.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 transition-all"
                    style={{ borderColor: "#dc2626", color: "#dc2626" }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {selected.title}
                </h2>
                <div
                  className="text-sm text-gray-600 leading-relaxed mb-4 p-4 rounded-lg"
                  style={{ backgroundColor: "#f9fafb" }}
                >
                  <p className="font-semibold text-gray-700 mb-1 text-xs uppercase tracking-wider">
                    Summary
                  </p>
                  {selected.summary}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-gray-200 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#dc2626" }}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}