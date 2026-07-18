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
    <div className="space-y-8 animate-hero-fade">
      <div>
        <div className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Visual Assets & Showrooms
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ivory">Media Manager</h1>
        <p className="text-ivory/70 mt-1 text-sm sm:text-base">
          Manage Hero section slider images, Promo banners on the Home page, and all About Us imagery.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold/30 gap-4">
        <button
          onClick={() => setActiveTab("promo")}
          className={`py-3 px-6 font-bold text-sm tracking-wider uppercase transition-elegant border-b-2 -mb-[2px] ${
            activeTab === "promo"
              ? "border-gold text-gold bg-gold/10 rounded-t-xl"
              : "border-transparent text-ivory/60 hover:text-ivory"
          }`}
        >
          Promo Banners (Home Page)
        </button>
        <button
          onClick={() => setActiveTab("hero")}
          className={`py-3 px-6 font-bold text-sm tracking-wider uppercase transition-elegant border-b-2 -mb-[2px] ${
            activeTab === "hero"
              ? "border-gold text-gold bg-gold/10 rounded-t-xl"
              : "border-transparent text-ivory/60 hover:text-ivory"
          }`}
        >
          Hero Section Slider
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`py-3 px-6 font-bold text-sm tracking-wider uppercase transition-elegant border-b-2 -mb-[2px] ${
            activeTab === "about"
              ? "border-gold text-gold bg-gold/10 rounded-t-xl"
              : "border-transparent text-ivory/60 hover:text-ivory"
          }`}
        >
          About Us Page Media
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "promo" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-ivory">Active Promo Banners ({currentBanners.length})</h2>
            <button
              onClick={() => openAddBanner("promo")}
              className="px-6 py-3 rounded-full gradient-gold text-deep-red font-bold text-xs tracking-wider shadow-gold hover:scale-105 transition-elegant flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> ADD PROMO BANNER
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {currentBanners.map((b) => (
              <div
                key={b.id}
                className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl overflow-hidden shadow-gold flex flex-col justify-between"
              >
                <div className="relative h-44 bg-black">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <div className="text-xs text-gold font-bold uppercase tracking-wider">{b.subtitle}</div>
                    <div className="text-lg font-extrabold text-ivory">{b.title}</div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-gold/20 bg-black/30">
                  <span className="text-xs text-ivory/60 font-mono truncate max-w-[200px]">Link: {b.link || "N/A"}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditBanner(b)}
                      className="p-2 rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-deep-red transition-elegant"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleBannerDelete(b.id)}
                      className="p-2 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-elegant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentBanners.length === 0 && (
              <div className="col-span-2 py-16 text-center bg-[oklch(0.22_0.04_25)] border border-gold/20 rounded-3xl text-ivory/60">
                No promo banners configured yet. Click "Add Promo Banner" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-ivory">Hero Section Slides ({currentBanners.length})</h2>
            <button
              onClick={() => openAddBanner("hero")}
              className="px-6 py-3 rounded-full gradient-gold text-deep-red font-bold text-xs tracking-wider shadow-gold hover:scale-105 transition-elegant flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> ADD HERO SLIDE
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {currentBanners.map((b) => (
              <div
                key={b.id}
                className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl overflow-hidden shadow-gold flex flex-col justify-between"
              >
                <div className="relative h-56 bg-black">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                    <div className="text-xs text-gold font-bold uppercase tracking-[0.2em]">{b.subtitle}</div>
                    <div className="text-2xl font-extrabold text-ivory leading-tight mt-1">{b.title}</div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between border-t border-gold/20 bg-black/30">
                  <span className="text-xs text-ivory/60 font-mono truncate max-w-[200px]">CTA: {b.link || "Explore"}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditBanner(b)}
                      className="p-2 rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-deep-red transition-elegant"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleBannerDelete(b.id)}
                      className="p-2 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-elegant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentBanners.length === 0 && (
              <div className="col-span-2 py-16 text-center bg-[oklch(0.22_0.04_25)] border border-gold/20 rounded-3xl text-ivory/60">
                No hero slides configured yet. Click "Add Hero Slide" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "about" && (
        <div className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-gold">
          <div className="flex items-center justify-between pb-4 border-b border-gold/20">
            <div>
              <h2 className="text-2xl font-extrabold text-ivory">About Us Page Media Assets</h2>
              <p className="text-xs text-ivory/60 mt-1">
                Customize all primary images shown on the showroom heritage and craftsmanship pages.
              </p>
            </div>
            <button
              onClick={saveAboutMedia}
              className="px-8 py-3 rounded-full gradient-gold text-deep-red font-extrabold text-sm tracking-wider shadow-gold hover:scale-105 transition-elegant flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> SAVE ABOUT MEDIA
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-3 bg-black/40 border border-gold/25 rounded-2xl p-4">
              <label className="text-xs font-bold tracking-widest text-gold uppercase block">About Hero Banner Image</label>
              <img
                src={aboutMedia.heroImage}
                alt="About Hero"
                className="w-full h-40 rounded-xl object-cover border border-gold/40"
              />
              <input
                type="text"
                value={aboutMedia.heroImage}
                onChange={(e) => setAboutMedia({ ...aboutMedia, heroImage: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-black/60 border border-gold/30 rounded-xl px-3 py-2 text-xs text-ivory focus:border-gold outline-none"
              />
              <label className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gold/50 bg-gold/10 text-gold text-xs font-bold cursor-pointer hover:bg-gold hover:text-deep-red transition-elegant">
                <Upload className="w-4 h-4" /> UPLOAD HERO FILE
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "heroImage", true)} className="hidden" />
              </label>
            </div>

            <div className="space-y-3 bg-black/40 border border-gold/25 rounded-2xl p-4">
              <label className="text-xs font-bold tracking-widest text-gold uppercase block">Heritage Story Section Image</label>
              <img
                src={aboutMedia.storyImage}
                alt="Story Image"
                className="w-full h-40 rounded-xl object-cover border border-gold/40"
              />
              <input
                type="text"
                value={aboutMedia.storyImage}
                onChange={(e) => setAboutMedia({ ...aboutMedia, storyImage: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-black/60 border border-gold/30 rounded-xl px-3 py-2 text-xs text-ivory focus:border-gold outline-none"
              />
              <label className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gold/50 bg-gold/10 text-gold text-xs font-bold cursor-pointer hover:bg-gold hover:text-deep-red transition-elegant">
                <Upload className="w-4 h-4" /> UPLOAD STORY FILE
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "storyImage", true)} className="hidden" />
              </label>
            </div>

            <div className="space-y-3 bg-black/40 border border-gold/25 rounded-2xl p-4">
              <label className="text-xs font-bold tracking-widest text-gold uppercase block">Master Craftsmanship Image</label>
              <img
                src={aboutMedia.craftImage}
                alt="Craft Image"
                className="w-full h-40 rounded-xl object-cover border border-gold/40"
              />
              <input
                type="text"
                value={aboutMedia.craftImage}
                onChange={(e) => setAboutMedia({ ...aboutMedia, craftImage: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-black/60 border border-gold/30 rounded-xl px-3 py-2 text-xs text-ivory focus:border-gold outline-none"
              />
              <label className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gold/50 bg-gold/10 text-gold text-xs font-bold cursor-pointer hover:bg-gold hover:text-deep-red transition-elegant">
                <Upload className="w-4 h-4" /> UPLOAD CRAFT FILE
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "craftImage", true)} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[oklch(0.22_0.04_25)] border-2 border-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-gold animate-hero-fade my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-6">
              <h3 className="text-2xl font-extrabold text-ivory">
                {editingBanner ? "Edit Banner" : `Add New ${bannerForm.banner_type === "hero" ? "Hero Slide" : "Promo Banner"}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-ivory/60 hover:text-ivory"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder={bannerForm.banner_type === "hero" ? "e.g. TIMLESS HEIRLOOMS" : "e.g. BRIDAL FESTIVAL"}
                  className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                />
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Subtitle / Eyebrow</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Handcrafted 22K Hallmarked Gold"
                  className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                />
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Banner Image *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={bannerForm.image || "/assets/promo-1.jpg"}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border border-gold/40 shrink-0"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={bannerForm.image}
                      onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                      placeholder="Image URL or pick file ->"
                      className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-ivory focus:border-gold outline-none"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gold/50 bg-gold/10 text-gold text-xs font-bold cursor-pointer hover:bg-gold hover:text-deep-red transition-elegant">
                      <ImageIcon className="w-4 h-4" /> UPLOAD IMAGE FILE
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Target Link / URL</label>
                <input
                  type="text"
                  value={bannerForm.link}
                  onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                  placeholder="e.g. /jewelleries or /contact"
                  className="w-full bg-black/40 border border-gold/30 rounded-xl px-4 py-3 text-ivory focus:border-gold outline-none transition-elegant"
                />
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
