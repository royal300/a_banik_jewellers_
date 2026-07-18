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
    <div className="space-y-8 animate-hero-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Catalogue Control
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Showroom Categories</h1>
          <p className="text-ivory/70 mt-1 text-sm sm:text-base">
            Create categories and mark whether they appear on the Home screen in "Shop By Category".
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-4 rounded-full gradient-gold text-deep-red font-extrabold text-sm tracking-wider shadow-gold hover:scale-105 transition-elegant flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" /> ADD NEW CATEGORY
        </button>
      </div>

      {/* Categories Table/List */}
      <div className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl overflow-hidden shadow-gold">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold/20 bg-black/30 text-gold text-xs uppercase tracking-widest">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Category Name & Slug</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6 text-center">Show in Home Page</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/15 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ivory/60">Loading showroom categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ivory/60">No categories found. Click "Add New Category" above.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gold/5 transition-colors">
                    <td className="py-4 px-6">
                      <img
                        src={cat.image || "/assets/cat-gold.jpg"}
                        alt={cat.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-gold/40 shadow-sm"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-base text-ivory">{cat.name}</div>
                      <div className="text-xs text-gold font-mono tracking-wider">/jewelleries/{cat.slug}</div>
                    </td>
                    <td className="py-4 px-6 max-w-md text-ivory/75 truncate">{cat.description}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleShowHome(cat)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-elegant ${
                          cat.show_in_home !== 0 && cat.show_in_home !== false
                            ? "bg-gold text-deep-red border-gold shadow-gold"
                            : "bg-black/40 text-ivory/50 border-gold/20 hover:border-gold/50"
                        }`}
                      >
                        {cat.show_in_home !== 0 && cat.show_in_home !== false ? (
                          <>
                            <Check className="w-4 h-4" /> SHOWN ON HOME
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" /> HIDDEN ON HOME
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2.5 rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-deep-red transition-elegant"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-elegant"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-gold animate-hero-fade my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-6">
              <h3 className="text-2xl font-extrabold text-ivory">
                {editing ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-ivory/60 hover:text-ivory"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bridal Necklaces"
                  className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                />
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">URL Slug (optional)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. bridal-necklaces (auto-generated if empty)"
                  className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                />
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Category Image *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={form.image || "/assets/cat-gold.jpg"}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border border-gold/40 shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Image URL or pick file ->"
                      className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-ivory focus:border-gold outline-none"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gold/50 bg-gold/10 text-gold text-xs font-bold cursor-pointer hover:bg-gold hover:text-deep-red transition-elegant">
                      <ImageIcon className="w-4 h-4" /> UPLOAD IMAGE FILE
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter short description for this category..."
                  className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer bg-black/40 border border-gold/30 rounded-xl p-4 hover:border-gold transition-elegant">
                  <input
                    type="checkbox"
                    checked={form.show_in_home}
                    onChange={(e) => setForm({ ...form, show_in_home: e.target.checked })}
                    className="w-5 h-5 accent-gold rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-ivory text-sm">Show on Home Page</div>
                    <div className="text-xs text-ivory/60">
                      If checked, this category will be showcased in the "Shop By Category" section on the Home screen.
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-full border border-gold/40 text-ivory text-sm font-bold hover:bg-gold/10"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full gradient-gold text-deep-red text-sm font-extrabold shadow-gold hover:scale-105 transition-elegant"
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
