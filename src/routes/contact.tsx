import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Clock, Send, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "@/components/site/Section";
import banner from "@/assets/promo-2.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — A Banik Jewellers, Madhyamgram" },
      { name: "description", content: "Visit or contact A Banik Jewellers at Gyayan Bhaban Market, Sodepur Rd, Madhyamgram, Kolkata 700129. Call +91 9748836800." },
      { property: "og:title", content: "Contact A Banik Jewellers" },
      { property: "og:description", content: "Visit our Madhyamgram showroom or reach us on WhatsApp." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="relative h-[36vh] sm:h-[45vh] overflow-hidden">
        <img src={banner} alt="Contact us" className="absolute inset-0 w-full h-full object-cover" width={1920} height={900} />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/85 via-deep-red/55 to-black/40" />
        <div className="relative h-full flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full text-white reveal">
            <div className="text-gold text-xs font-bold tracking-[0.35em] uppercase mb-3">Get in Touch</div>
            <h1 className="text-4xl sm:text-5xl font-bold">Contact Us</h1>
            <p className="mt-3 max-w-xl text-white/85">We'd love to help you find the perfect piece.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: "Visit Us", body: siteConfig.address.full, href: siteConfig.mapEmbed.replace("output=embed", "") },
            { icon: Phone, title: "Call Us", body: siteConfig.phone, href: `tel:${siteConfig.phoneClean}` },
            { icon: MessageCircle, title: "WhatsApp", body: siteConfig.phone, href: `https://wa.me/${siteConfig.whatsapp}` },
          ].map((c, i) => (
            <a key={c.title} href={c.href} target="_blank" rel="noreferrer"
              style={{ animationDelay: `${i * 80}ms` }}
              className="reveal group rounded-3xl bg-card border border-gold/25 p-8 hover:-translate-y-1 hover:shadow-elegant transition-elegant">
              <div className="w-14 h-14 rounded-full gradient-gold grid place-items-center mb-4 shadow-gold">
                <c.icon className="w-6 h-6 text-deep-red" />
              </div>
              <h3 className="font-bold text-deep-red text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground transition-elegant">{c.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="reveal rounded-3xl overflow-hidden border border-gold/25 shadow-elegant min-h-[420px]">
            <iframe
              src={siteConfig.mapEmbed}
              title="A Banik Jewellers on Map"
              className="w-full h-full min-h-[420px]"
              loading="lazy"
            />
          </div>

          <div className="reveal rounded-3xl bg-card border border-gold/25 shadow-sm p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-deep-red">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll get back to you shortly.</p>

            {sent ? (
              <div className="mt-8 rounded-2xl bg-gold/15 border border-gold/40 p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-deep-red mx-auto" />
                <div className="mt-3 font-bold text-deep-red">Thank you!</div>
                <p className="text-sm text-muted-foreground mt-1">Your message has been received. Our team will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" required />
                  <Field label="Phone" name="phone" type="tel" required />
                </div>
                <Field label="Email" name="email" type="email" />
                <Field label="Subject" name="subject" />
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Message</label>
                  <textarea required rows={4}
                    className="mt-2 w-full rounded-xl border border-gold/30 bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-elegant" />
                </div>
                <button type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 py-4 rounded-full gradient-red text-white font-bold text-sm tracking-wider shadow-gold hover:scale-[1.02] transition-elegant">
                  <Send className="w-4 h-4" /> SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeading eyebrow="Store Hours" title="Business Hours" />
          <div className="rounded-3xl bg-card border border-gold/25 overflow-hidden divide-y divide-gold/15">
            {siteConfig.hours.map((h) => (
              <div key={h.day} className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="font-semibold">{h.day}</span>
                </div>
                <span className="text-deep-red font-bold">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{label}</label>
      <input name={name} type={type} required={required}
        className="mt-2 w-full rounded-xl border border-gold/30 bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-elegant" />
    </div>
  );
}
