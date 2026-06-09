export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return <div className="mb-6 max-w-3xl"><p className="mb-2 text-sm font-bold uppercase tracking-wide text-sage-700">{eyebrow}</p><h1 className="text-3xl font-black tracking-tight text-ink sm:text-5xl">{title}</h1>{subtitle && <p className="mt-4 text-lg leading-8 text-slateblue">{subtitle}</p>}</div>;
}
