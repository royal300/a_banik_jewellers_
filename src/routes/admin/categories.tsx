import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    show_in_home: true,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image: "/assets/cat-gold.jpg", show_in_home: true });
    setIsModalOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || "",
      show_in_home: cat.show_in_home !== 0 && cat.show_in_home !== false,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setForm((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing ? editing.id : undefined,
          ...form,
          slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleShowHome = async (cat: any) => {
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cat,
          show_in_home: cat.show_in_home ? 0 : 1,
        }),
      });
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-hero-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Catalogue Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Showroom Categories</h1>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm">
            Create categories and mark whether they appear on the Home screen in "Shop By Category".
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> ADD NEW CATEGORY
        </button>
      </div>

      {/* Categories Table/List */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Image</th>
                <th className="py-3.5 px-5">Category Name & Slug</th>
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5 text-center">Show in Home Page</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">Loading showroom categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">No categories found. Click "Add New Category" above.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <img
                        src={cat.image || "/assets/cat-gold.jpg"}
                        alt={cat.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-extrabold text-sm text-gray-900">{cat.name}</div>
                      <div className="text-[11px] text-red-600 font-mono tracking-wider">/jewelleries/{cat.slug}</div>
                    </td>
                    <td className="py-3.5 px-5 max-w-md text-gray-600 truncate text-xs">{cat.description}</td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => toggleShowHome(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          cat.show_in_home !== 0 && cat.show_in_home !== false
                            ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {cat.show_in_home !== 0 && cat.show_in_home !== false ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-red-600" /> SHOWN ON HOME
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-gray-400" /> HIDDEN ON HOME
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl animate-hero-fade my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editing ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bridal Necklaces"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">URL Slug (optional)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. bridal-necklaces (auto-generated if empty)"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Category Image *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={form.image || "/assets/cat-gold.jpg"}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 shadow-sm"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Image URL or pick file ->"
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-red-600 outline-none"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                      <ImageIcon className="w-3.5 h-3.5" /> UPLOAD IMAGE FILE
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter short description for this category..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 hover:border-red-600 transition-all">
                  <input
                    type="checkbox"
                    checked={form.show_in_home}
                    onChange={(e) => setForm({ ...form, show_in_home: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-xs">Show on Home Page</div>
                    <div className="text-[11px] text-gray-500">
                      If checked, this category will be showcased in the "Shop By Category" section on the Home screen.
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  {editing ? "UPDATE CATEGORY" : "SAVE CATEGORY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
