import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1 max-w-2xl">
        {eyebrow && (
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#8175ee]">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white font-['Sora'] tracking-tight">
          {title}
        </h1>
        <p className="text-sm md:text-base text-white/60 leading-relaxed mt-0.5">
          {description}
        </p>
      </div>

      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </header>
  );
}
