import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "text-center max-w-2xl mx-auto" : ""} mb-10 sm:mb-14`}>
      {eyebrow && (
        <div className="text-gold text-xs sm:text-sm font-bold tracking-[0.35em] uppercase mb-3">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-red">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-5 flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-gold/50" />
        <div className="w-2 h-2 rounded-full bg-gold rotate-45" />
        <div className="h-px w-12 bg-gold/50" />
      </div>
    </div>
  );
}
