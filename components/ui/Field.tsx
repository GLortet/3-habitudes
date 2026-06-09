import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-ink"><span>{label}</span>{children}</label>;
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`min-h-11 rounded-2xl border border-sage-100 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-sage-300 ${props.className ?? ""}`} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={`min-h-11 rounded-2xl border border-sage-100 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-sage-300 ${props.className ?? ""}`} />; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={`min-h-24 rounded-2xl border border-sage-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-sage-300 ${props.className ?? ""}`} />; }
