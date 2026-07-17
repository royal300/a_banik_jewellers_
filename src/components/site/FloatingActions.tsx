import { useEffect, useState } from "react";
import { MessageCircle, Phone, ArrowUp } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed z-40 right-4 sm:right-6 bottom-4 sm:bottom-6 flex flex-col gap-3">
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="w-12 h-12 rounded-full glass grid place-items-center text-deep-red hover:scale-110 transition-elegant animate-hero-fade shadow-elegant"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <a
        href={`tel:${siteConfig.phoneClean}`}
        aria-label="Call"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-red text-white grid place-items-center shadow-elegant hover:scale-110 transition-elegant"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href={`https://wa.me/${siteConfig.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-elegant hover:scale-110 transition-elegant relative"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle className="w-6 h-6 relative" />
      </a>
    </div>
  );
}
