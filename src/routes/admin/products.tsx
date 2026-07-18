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
    <div className="space-y-8 animate-hero-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Inventory & Gallery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Jewellery Products</h1>
          <p className="text-ivory/70 mt-1 text-sm sm:text-base">
            Upload new products, configure image galleries, input weight & purity, and toggle Featured Products for the Home screen.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-4 rounded-full gradient-gold text-deep-red font-extrabold text-sm tracking-wider shadow-gold hover:scale-105 transition-elegant flex items-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5" /> ADD NEW PRODUCT
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[oklch(0.22_0.04_25)] border border-gold/30 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or weight..."
            className="w-full bg-black/40 border border-gold/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-ivory focus:border-gold outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-gold shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black/40 border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-ivory focus:border-gold outline-none w-full sm:w-auto"
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
      <div className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl overflow-hidden shadow-gold">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold/20 bg-black/30 text-gold text-xs uppercase tracking-widest">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Weight & Purity</th>
                <th className="py-4 px-6 text-center">Featured on Home</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/15 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ivory/60">Loading showroom products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ivory/60">No products match your search. Click "Add New Product" above.</td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gold/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="relative">
                        <img
                          src={prod.image || "/assets/product-1.jpg"}
                          alt={prod.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-gold/40 shadow-sm"
                        />
                        {Array.isArray(prod.thumbnails) && prod.thumbnails.length > 1 && (
                          <span className="absolute -bottom-1 -right-1 bg-gold text-deep-red text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                            +{prod.thumbnails.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-base text-ivory">{prod.name}</div>
                      <div className="text-xs text-ivory/60 max-w-xs truncate">{prod.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider">
                        {prod.category_slug || prod.category || "gold"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-gold">{prod.weight || "N/A"}</div>
                      <div className="text-xs text-ivory/70">{prod.purity}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleFeatured(prod)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-elegant ${
                          prod.is_featured === 1 || prod.is_featured === true
                            ? "bg-gold text-deep-red border-gold shadow-gold"
                            : "bg-black/40 text-ivory/50 border-gold/20 hover:border-gold/50"
                        }`}
                      >
                        {prod.is_featured === 1 || prod.is_featured === true ? (
                          <>
                            <Check className="w-4 h-4" /> FEATURED ON HOME
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" /> STANDARD LISTING
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(prod)}
                          className="p-2.5 rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-deep-red transition-elegant"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-2.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-elegant"
                          title="Delete Product"
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
          <div className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-gold animate-hero-fade my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-6">
              <h3 className="text-2xl font-extrabold text-ivory">
                {editing ? "Edit Jewellery Product" : "Add New Jewellery Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-ivory/60 hover:text-ivory"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Royal Gold Choker"
                    className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Category *</label>
                  <select
                    value={form.category_slug}
                    onChange={(e) => setForm({ ...form, category_slug: e.target.value })}
                    className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.slug})
                      </option>
                    ))}
                    {categories.length === 0 && <option value="gold">Gold Jewellery</option>}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Weight (with unit) *</label>
                  <input
                    type="text"
                    required
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="e.g. 14.28 g or 25.50 grams"
                    className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Purity Specification *</label>
                  <input
                    type="text"
                    required
                    value={form.purity}
                    onChange={(e) => setForm({ ...form, purity: e.target.value })}
                    placeholder="e.g. 22K Hallmarked Gold"
                    className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Main Product Image *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={form.image || "/assets/product-1.jpg"}
                    alt="Main Preview"
                    className="w-20 h-20 rounded-2xl object-cover border border-gold/40 shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Main Image URL or pick file ->"
                      className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-ivory focus:border-gold outline-none"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gold/50 bg-gold/10 text-gold text-xs font-bold cursor-pointer hover:bg-gold hover:text-deep-red transition-elegant">
                      <ImageIcon className="w-4 h-4" /> UPLOAD MAIN IMAGE FILE
                      <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Product Images Gallery */}
              <div className="bg-black/30 border border-gold/25 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-widest text-gold uppercase">
                    Product Gallery Images ({form.thumbnails.length})
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/20 border border-gold text-gold text-xs font-bold cursor-pointer hover:bg-gold hover:text-deep-red transition-elegant">
                    <PlusCircle className="w-3.5 h-3.5" /> ADD GALLERY FILE
                    <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  {form.thumbnails.map((t, idx) => (
                    <div key={idx} className="relative group/thumb w-16 h-16 rounded-xl overflow-hidden border border-gold/40 bg-black">
                      <img src={t} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx)}
                        className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {form.thumbnails.length === 0 && (
                    <div className="text-xs text-ivory/50 italic py-2">No additional gallery images yet. Upload above or enter URL below.</div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    id="new_gallery_url"
                    placeholder="Add gallery image URL..."
                    className="flex-1 bg-black/40 border border-gold/30 rounded-xl px-4 py-2 text-xs text-ivory focus:border-gold outline-none"
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
                    className="px-4 py-2 rounded-xl border border-gold/50 text-gold text-xs font-bold hover:bg-gold hover:text-deep-red transition-elegant"
                  >
                    ADD URL
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter detailed description of craftsmanship, design notes, and heritage..."
                  className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer bg-black/40 border border-gold/30 rounded-xl p-4 hover:border-gold transition-elegant">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-5 h-5 accent-gold rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-ivory text-sm">Show on Home Page Featured Products</div>
                    <div className="text-xs text-ivory/60">
                      If checked, this item will be displayed prominently in the "Featured Collection" section on the Home screen.
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
