export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-sage-100 bg-white/90 p-5 shadow-soft ${className}`}>{children}</section>;
}
