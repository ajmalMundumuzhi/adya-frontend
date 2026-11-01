
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  title,
  value = 0,
  prefix = "",
  icon: Icon,
  change = 0,
  loading = false,
}) {
  const positive = Number(change) >= 0;

  const formattedValue =
    prefix === "A$"
      ? Number(value).toLocaleString("en-AU", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : Number(value).toLocaleString("en-AU");

  return (
    <article className="border border-[#B49A68]/30 bg-white p-5 transition hover:border-[#92764B]/50 sm:p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[#493829]/65">{title}</p>

        <div className="flex h-10 w-10 items-center justify-center bg-[#D4BC98]/30 text-[#493829]">
          {Icon && <Icon size={20} strokeWidth={1.5} />}
        </div>
      </div>

      {loading ? (
        <div className="mt-5 h-8 w-28 animate-pulse bg-[#F0E8DC]" />
      ) : (
        <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#493829] sm:text-3xl">
          {prefix}
          {formattedValue}
        </h3>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 font-medium ${
            positive ? "text-green-700" : "text-red-700"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}
          {Math.abs(Number(change))}%
        </span>

        <span className="text-[#493829]/50">
          compared to previous period
        </span>
      </div>
    </article>
  );
}
