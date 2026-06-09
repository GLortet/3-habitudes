export function Stat({ label, value, help }: { label: string; value: React.ReactNode; help?: string }) {
  return <div className="rounded-3xl bg-mist p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slateblue">{label}</p><div className="mt-1 text-2xl font-black text-ink">{value}</div>{help && <p className="mt-1 text-xs text-slateblue">{help}</p>}</div>;
}
