import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, Sparkles, Search, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_slug: "gold",
    weight: "",
    purity: "22K Hallmarked Gold",
    description: "",
    image: "",
    thumbnails: [] as string[],
    is_featured: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()]);
      setProducts(Array.isArray(pData) ? pData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      category_slug: categories.length > 0 ? categories[0].slug : "gold",
      weight: "",
      purity: "22K Hallmarked Gold",
      description: "",
      image: "/assets/product-1.jpg",
      thumbnails: ["/assets/product-1.jpg"],
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const openEdit = (prod: any) => {
    setEditing(prod);
    setForm({
      name: prod.name || "",
      slug: prod.slug || "",
      category_slug: prod.category_slug || prod.category || "gold",
      weight: prod.weight || "",
      purity: prod.purity || "22K Hallmarked Gold",
      description: prod.description || "",
      image: prod.image || "",
      thumbnails: Array.isArray(prod.thumbnails) && prod.thumbnails.length > 0 ? prod.thumbnails : [prod.image],
      is_featured: prod.is_featured === 1 || prod.is_featured === true,
    });
    setIsModalOpen(true);
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const resultStr = reader.result as string;
          setForm((prev) => {
            const newThumbs = prev.thumbnails.length === 0 ? [resultStr] : [resultStr, ...prev.thumbnails.slice(1)];
            return { ...prev, image: resultStr, thumbnails: newThumbs };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setForm((prev) => ({
            ...prev,
            thumbnails: [...prev.thumbnails, reader.result as string],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addGalleryUrl = (url: string) => {
    if (url.trim()) {
      setForm((prev) => ({ ...prev, thumbnails: [...prev.thumbnails, url.trim()] }));
    }
  };

  const removeGalleryItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      thumbnails: prev.thumbnails.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing ? editing.id : undefined,
          ...form,
          slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeatured = async (prod: any) => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prod,
          is_featured: !prod.is_featured,
        }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category_slug === selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.weight?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-hero-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Inventory & Gallery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Jewellery Products</h1>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm">
            Upload new products, configure image galleries, input weight & purity, and toggle Featured Products for the Home screen.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-sm transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> ADD NEW PRODUCT
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or weight..."
            className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 focus:border-red-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-red-600 outline-none w-full sm:w-auto font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Image</th>
                <th className="py-3.5 px-5">Product Details</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Weight & Purity</th>
                <th className="py-3.5 px-5 text-center">Featured on Home</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 font-medium">Loading showroom products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 font-medium">No products match your search. Click "Add New Product" above.</td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="relative inline-block">
                        <img
                          src={prod.image || "/assets/product-1.jpg"}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                        {Array.isArray(prod.thumbnails) && prod.thumbnails.length > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                            +{prod.thumbnails.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-extrabold text-sm text-gray-900">{prod.name}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">{prod.description}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-md bg-red-50 border border-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider">
                        {prod.category_slug || prod.category || "gold"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-extrabold text-gray-900 text-sm">{prod.weight || "N/A"}</div>
                      <div className="text-[11px] text-gray-500">{prod.purity}</div>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => toggleFeatured(prod)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          prod.is_featured === 1 || prod.is_featured === true
                            ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {prod.is_featured === 1 || prod.is_featured === true ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-red-600" /> FEATURED ON HOME
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 text-gray-400" /> STANDARD LISTING
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(prod)}
                          className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                          title="Delete Product"
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
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-hero-fade my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editing ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Royal Heritage Necklace"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Showroom Category *</label>
                  <select
                    value={form.category_slug}
                    onChange={(e) => setForm({ ...form, category_slug: e.target.value })}
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">URL Slug (optional)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. royal-heritage-necklace"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:border-red-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Weight (approx.) *</label>
                  <input
                    type="text"
                    required
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="e.g. 48.5 Grams"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:border-red-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Purity / Metal *</label>
                  <input
                    type="text"
                    required
                    value={form.purity}
                    onChange={(e) => setForm({ ...form, purity: e.target.value })}
                    placeholder="e.g. 22K Hallmarked Gold"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:border-red-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Main Product Image *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={form.image || "/assets/product-1.jpg"}
                    alt="Main Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 shadow-sm"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Main Image URL or pick file ->"
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-red-600 outline-none"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                      <ImageIcon className="w-3.5 h-3.5" /> UPLOAD MAIN IMAGE FILE
                      <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Images Gallery */}
              <div className="bg-gray-50/60 border border-gray-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase">
                    Product Gallery Images ({form.thumbnails.length})
                  </label>
                  <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-600 text-[11px] font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-all shadow-sm">
                    <PlusCircle className="w-3.5 h-3.5" /> ADD GALLERY FILE
                    <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {form.thumbnails.map((t, idx) => (
                    <div key={idx} className="relative group/thumb w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
                      <img src={t} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx)}
                        className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {form.thumbnails.length === 0 && (
                    <div className="text-xs text-gray-400 italic py-1">No additional gallery images yet. Upload above or enter URL below.</div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    id="new_gallery_url"
                    placeholder="Add gallery image URL..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:border-red-600 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget as HTMLInputElement;
                        addGalleryUrl(input.value);
                        input.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("new_gallery_url") as HTMLInputElement;
                      if (input && input.value) {
                        addGalleryUrl(input.value);
                        input.value = "";
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:border-red-600 hover:text-red-600 transition-all"
                  >
                    ADD URL
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter detailed description of craftsmanship, design notes, and heritage..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 hover:border-red-600 transition-all">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-xs">Show on Home Page Featured Products</div>
                    <div className="text-[11px] text-gray-500">
                      If checked, this item will be displayed prominently in the "Featured Collection" section on the Home screen.
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
                  {editing ? "UPDATE PRODUCT" : "SAVE PRODUCT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
