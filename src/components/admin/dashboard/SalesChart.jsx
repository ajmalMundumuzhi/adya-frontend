
import { useMemo, useState } from "react";

export default function SalesChart({ data = [], loading = false }) {
  const [period, setPeriod] = useState("7D");

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data;
  }, [data]);

  const maxValue = Math.max(
    ...chartData.map((item) => Number(item.revenue || 0)),
    1
  );

  const points = chartData.map((item, index) => {
    const x =
      chartData.length > 1
        ? 40 + (index / (chartData.length - 1)) * 620
        : 350;

    const y =
      190 - (Number(item.revenue || 0) / maxValue) * 155;

    return { x, y, ...item };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`
    : "";

  return (
    <section className="border border-[#B49A68]/30 bg-white p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#92764B]">
            Revenue analytics
          </p>
          <h2 className="mt-2 font-display text-2xl text-[#493829]">
            Sales overview
          </h2>
        </div>

        <div className="flex gap-1 border border-[#B49A68]/25 p-1">
          {["7D", "30D", "90D", "1Y"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`px-3 py-2 text-xs font-semibold transition ${
                period === item
                  ? "bg-[#493829] text-white"
                  : "text-[#493829]/60 hover:bg-[#D4BC98]/20"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 h-64 animate-pulse bg-[#F0E8DC]" />
      ) : chartData.length === 0 ? (
        <div className="mt-8 flex h-64 flex-col items-center justify-center border border-dashed border-[#B49A68]/35 text-center">
          <p className="font-display text-xl text-[#493829]">
            No sales data yet
          </p>
          <p className="mt-2 text-sm text-[#493829]/55">
            Sales analytics will appear here once connected.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <svg
            viewBox="0 0 700 230"
            role="img"
            aria-label="Sales revenue chart"
            className="w-full overflow-visible"
          >
            {[40, 90, 140, 190].map((y) => (
              <line
                key={y}
                x1="35"
                y1={y}
                x2="665"
                y2={y}
                stroke="#E9DFD0"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
            ))}

            <path d={areaPath} fill="#D4BC98" opacity="0.35" />

            <path
              d={linePath}
              fill="none"
              stroke="#795D3A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, index) => (
              <circle
                key={point.date || index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#795D3A"
              />
            ))}
          </svg>

          <div className="mt-3 flex justify-between gap-2 text-xs text-[#493829]/55">
            {points.map((point, index) => (
              <span key={point.date || index}>
                {point.label || point.date || ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
