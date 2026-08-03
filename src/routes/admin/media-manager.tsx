import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit2, Trash2, Image as ImageIcon, Sparkles, Check, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/media-manager")({
  component: AdminMediaManager,
});

function AdminMediaManager() {
  const [activeTab, setActiveTab] = useState<"promo" | "hero" | "about">("promo");
  const [banners, setBanners] = useState<any[]>([]);
  const [aboutMedia, setAboutMedia] = useState({
    heroImage: "/assets/about-hero.jpg",
    storyImage: "/assets/promo-1.jpg",
    craftImage: "/assets/customer-1.jpg",
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    banner_type: "promo",
  });

  const loadMedia = async () => {
    setLoading(true);
    try {
      const [promoRes, heroRes, aboutRes] = await Promise.all([
        fetch("/api/media?type=promo"),
        fetch("/api/media?type=hero"),
        fetch("/api/media?type=about"),
      ]);
      const [promoData, heroData, aboutData] = await Promise.all([
        promoRes.json(),
        heroRes.json(),
        aboutRes.json(),
      ]);
      const combined = [
        ...(Array.isArray(promoData) ? promoData : []),
        ...(Array.isArray(heroData) ? heroData : []),
      ];
      setBanners(combined);
      if (aboutData && typeof aboutData === "object") {
        setAboutMedia({
          heroImage: aboutData.heroImage || "/assets/about-hero.jpg",
          storyImage: aboutData.storyImage || "/assets/promo-1.jpg",
          craftImage: aboutData.craftImage || "/assets/customer-1.jpg",
        });
      }
    } catch (err) {
      console.error("Load media error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const openAddBanner = (type: "promo" | "hero") => {
    setEditingBanner(null);
    setBannerForm({
      title: "",
      subtitle: "",
      image: type === "promo" ? "/assets/promo-1.jpg" : "/assets/hero-bg.jpg",
      link: "/jewelleries",
      banner_type: type,
    });
    setIsModalOpen(true);
  };

  const openEditBanner = (b: any) => {
    setEditingBanner(b);
    setBannerForm({
      title: b.title || "",
      subtitle: b.subtitle || "",
      image: b.image || "",
      link: b.link || "/jewelleries",
      banner_type: b.banner_type || "promo",
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: string, isAbout = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          if (isAbout) {
            setAboutMedia((prev) => ({ ...prev, [targetField]: reader.result as string }));
          } else {
            setBannerForm((prev) => ({ ...prev, image: reader.result as string }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBanner ? editingBanner.id : undefined,
          ...bannerForm,
        }),
      });
      setIsModalOpen(false);
      loadMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBannerDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner image?")) return;
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_banner", id }),
      });
      loadMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const saveAboutMedia = async () => {
    try {
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_about", aboutData: aboutMedia }),
      });
      alert("✅ About Us Page Media saved successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const currentBanners = banners.filter((b) => b.banner_type === activeTab);

  return (
    <div className="space-y-6 animate-hero-fade">
      <div>
        <div className="text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Visual Assets & Showrooms
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Media Manager</h1>
        <p className="text-gray-600 mt-1 text-xs sm:text-sm">
          Manage Hero section slider images, Promo banners on the Home page, and all About Us imagery.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("promo")}
          className={`py-2.5 px-4 sm:px-5 font-bold text-xs tracking-wider uppercase transition-all border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === "promo"
              ? "border-red-600 text-red-600 bg-red-50/60 rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Promo Banners (Home Page)
        </button>
        <button
          onClick={() => setActiveTab("hero")}
          className={`py-2.5 px-4 sm:px-5 font-bold text-xs tracking-wider uppercase transition-all border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === "hero"
              ? "border-red-600 text-red-600 bg-red-50/60 rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Hero Section Slider
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`py-2.5 px-4 sm:px-5 font-bold text-xs tracking-wider uppercase transition-all border-b-2 -mb-[2px] whitespace-nowrap ${
            activeTab === "about"
              ? "border-red-600 text-red-600 bg-red-50/60 rounded-t-xl"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          About Us Page Media
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "promo" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-gray-900">Active Promo Banners ({currentBanners.length})</h2>
            <button
              onClick={() => openAddBanner("promo")}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> ADD PROMO BANNER
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {currentBanners.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-40 bg-gray-900">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <div className="text-[11px] text-red-400 font-bold uppercase tracking-wider">{b.subtitle}</div>
                    <div className="text-base font-extrabold text-white">{b.title}</div>
                  </div>
                </div>
                <div className="p-3.5 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
                  <span className="text-xs text-gray-600 font-mono truncate max-w-[200px]">Link: {b.link || "N/A"}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditBanner(b)}
                      className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleBannerDelete(b.id)}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentBanners.length === 0 && (
              <div className="col-span-2 py-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm font-medium">
                No promo banners configured yet. Click "Add Promo Banner" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "hero" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-gray-900">Hero Section Slides ({currentBanners.length})</h2>
            <button
              onClick={() => openAddBanner("hero")}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> ADD HERO SLIDE
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {currentBanners.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-48 bg-gray-900">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-end">
                    <div className="text-[11px] text-red-400 font-bold uppercase tracking-[0.2em]">{b.subtitle}</div>
                    <div className="text-xl font-extrabold text-white leading-tight mt-0.5">{b.title}</div>
                  </div>
                </div>
                <div className="p-3.5 flex items-center justify-between border-t border-gray-100 bg-gray-50/50">
                  <span className="text-xs text-gray-600 font-mono truncate max-w-[200px]">CTA: {b.link || "Explore"}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditBanner(b)}
                      className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleBannerDelete(b.id)}
                      className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentBanners.length === 0 && (
              <div className="col-span-2 py-12 text-center bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm font-medium">
                No hero slides configured yet. Click "Add Hero Slide" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "about" && (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">About Us Page Media Assets</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize all primary images shown on the showroom heritage and craftsmanship pages.
              </p>
            </div>
            <button
              onClick={saveAboutMedia}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <Check className="w-4 h-4" /> SAVE ABOUT MEDIA
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="space-y-2.5 bg-gray-50/60 border border-gray-200 rounded-xl p-3.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block">About Hero Banner Image</label>
              <img
                src={aboutMedia.heroImage}
                alt="About Hero"
                className="w-full h-36 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
              <input
                type="text"
                value={aboutMedia.heroImage}
                onChange={(e) => setAboutMedia({ ...aboutMedia, heroImage: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:border-red-600 outline-none"
              />
              <label className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                <Upload className="w-3.5 h-3.5" /> UPLOAD HERO FILE
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "heroImage", true)} className="hidden" />
              </label>
            </div>

            <div className="space-y-2.5 bg-gray-50/60 border border-gray-200 rounded-xl p-3.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block">Heritage Story Section Image</label>
              <img
                src={aboutMedia.storyImage}
                alt="Story Image"
                className="w-full h-36 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
              <input
                type="text"
                value={aboutMedia.storyImage}
                onChange={(e) => setAboutMedia({ ...aboutMedia, storyImage: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:border-red-600 outline-none"
              />
              <label className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                <Upload className="w-3.5 h-3.5" /> UPLOAD STORY FILE
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "storyImage", true)} className="hidden" />
              </label>
            </div>

            <div className="space-y-2.5 bg-gray-50/60 border border-gray-200 rounded-xl p-3.5">
              <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block">Master Craftsmanship Image</label>
              <img
                src={aboutMedia.craftImage}
                alt="Craft Image"
                className="w-full h-36 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
              <input
                type="text"
                value={aboutMedia.craftImage}
                onChange={(e) => setAboutMedia({ ...aboutMedia, craftImage: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 focus:border-red-600 outline-none"
              />
              <label className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                <Upload className="w-3.5 h-3.5" /> UPLOAD CRAFT FILE
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "craftImage", true)} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-hero-fade my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingBanner ? "Edit Banner" : `Add New ${bannerForm.banner_type === "hero" ? "Hero Slide" : "Promo Banner"}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder={bannerForm.banner_type === "hero" ? "e.g. TIMLESS HEIRLOOMS" : "e.g. BRIDAL FESTIVAL"}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Subtitle / Eyebrow</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Handcrafted 22K Hallmarked Gold"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Banner Image *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={bannerForm.image || "/assets/promo-1.jpg"}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 shadow-sm"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                      placeholder="Image URL or pick file ->"
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-red-600 outline-none"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                      <ImageIcon className="w-3.5 h-3.5" /> UPLOAD IMAGE FILE
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold tracking-wider text-gray-700 uppercase block mb-1.5">Target Link / URL</label>
                <input
                  type="text"
                  value={bannerForm.link}
                  onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                  placeholder="e.g. /jewelleries or /contact"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
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
                  {editingBanner ? "UPDATE BANNER" : "SAVE BANNER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
