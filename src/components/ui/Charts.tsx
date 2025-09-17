"use client";

import React from "react";

export interface PieSlice {
  label: string;
  value: number;
  color: string;
}

export function PieChart({ data, size = 160, strokeWidth = 24 }: { data: PieSlice[]; size?: number; strokeWidth?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Pie chart">
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((d, i) => {
          const portion = d.value / total;
          const dash = portion * circumference;
          const gap = circumference - dash;
          const circle = (
            <circle
              key={i}
              r={radius}
              fill="transparent"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              transform="rotate(-90)"
            />
          );
          offset += dash;
          return circle;
        })}
      </g>
    </svg>
  );
}

export function BarChart({
  items,
}: {
  items: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-3">
          <div className="w-28 text-sm text-slate-700">{i.label}</div>
          <div className="flex-1">
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${(i.value / max) * 100}%`, backgroundColor: i.color }}
              />
            </div>
          </div>
          <div className="w-10 text-right text-sm text-slate-600">{i.value}</div>
        </div>
      ))}
    </div>
  );
}

export function LineChart({
  labels,
  values,
  width = 520,
  height = 160,
  color = "#3b82f6",
}: {
  labels: string[];
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const pad = 32;
  const maxVal = Math.max(1, ...values);
  const stepX = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
  const scaleY = (height - pad * 2) / maxVal;

  const points = values
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = height - pad - v * scaleY;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} role="img" aria-label="Line chart">
      {/* Grid lines */}
      {Array.from({ length: 4 }, (_, idx) => {
        const y = pad + ((height - pad * 2) / 4) * (idx + 1);
        return <line key={idx} x1={pad} y1={y} x2={width - pad} y2={y} stroke="#eef2f7" />;
      })}
      {/* Axes */}
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#e5e7eb" />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#e5e7eb" />

      {/* Polyline */}
      <polyline fill="none" stroke={color} strokeWidth={2.5} points={points} />

      {/* Points */}
      {values.map((v, i) => {
        const x = pad + i * stepX;
        const y = height - pad - v * scaleY;
        return <circle key={i} cx={x} cy={y} r={3} fill={color} />;
      })}

      {/* X labels (every few points to reduce clutter) */}
      {labels.map((lbl, i) => {
        if (i % Math.ceil(labels.length / 6 || 1) !== 0) return null;
        const x = pad + i * stepX;
        const y = height - pad + 14;
        return (
          <text key={lbl + i} x={x} y={y} fontSize={10} textAnchor="middle" fill="#64748b">
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}

export function MultiLineChart({
  labels,
  series,
  width = 720,
  height = 220,
  areaIndex = 0,
  singleSelect = true,
}: {
  labels: string[];
  series: { name: string; values: number[]; color: string }[];
  width?: number;
  height?: number;
  areaIndex?: number;
  singleSelect?: boolean;
}) {
  const pad = 36;
  const allValues = series.flatMap((s) => s.values);
  const maxVal = Math.max(1, ...allValues);
  const stepX = labels.length > 1 ? (width - pad * 2) / (labels.length - 1) : 0;
  const scaleY = (height - pad * 2) / maxVal;

  const pointsFor = (values: number[]) =>
    values.map((v, i) => ({ x: pad + i * stepX, y: height - pad - v * scaleY }));

  // Catmull-Rom to Bezier smoothing
  const toSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    const d: string[] = [`M ${pts[0].x},${pts[0].y}`];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`);
    }
    return d.join(" ");
  };

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(singleSelect ? 0 : null);

  const handleMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const idx = Math.round((x - pad) / stepX);
    if (idx >= 0 && idx < labels.length) setHoverIdx(idx);
  };

  const handleLeave = () => setHoverIdx(null);

  // Precompute point arrays
  const allPts = series.map((s) => pointsFor(s.values));
  const visibleIdxs = selectedIdx === null ? series.map((_, i) => i) : [selectedIdx];

  return (
    <svg ref={svgRef} width={width} height={height} role="img" aria-label="Multi series line chart" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {/* Grid */}
      {Array.from({ length: 4 }, (_, idx) => {
        const y = pad + ((height - pad * 2) / 4) * (idx + 1);
        return <line key={idx} x1={pad} y1={y} x2={width - pad} y2={y} stroke="#eef2f7" />;
      })}
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#e5e7eb" />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#e5e7eb" />

      {/* Area under main series */}
      {series[selectedIdx ?? areaIndex] && (
        <path
          d={`${toSmoothPath(allPts[selectedIdx ?? areaIndex])} L ${pad + (labels.length - 1) * stepX},${height - pad} L ${pad},${height - pad} Z`}
          fill={`${series[selectedIdx ?? areaIndex].color}`}
          fillOpacity={0.12}
          stroke="none"
        />
      )}

      {/* Lines */}
      {series.map((s, idx) => (
        <g key={idx}>
          <path d={toSmoothPath(allPts[idx])} fill="none" stroke={s.color} strokeOpacity={visibleIdxs.includes(idx) ? 1 : 0.15} strokeWidth={visibleIdxs.includes(idx) ? 2.5 : 1.5} />
          {hoverIdx !== null && visibleIdxs.includes(idx) && allPts[idx][hoverIdx] && (
            <circle cx={allPts[idx][hoverIdx].x} cy={allPts[idx][hoverIdx].y} r={4} fill={s.color} />
          )}
        </g>
      ))}

      {/* Hover indicator */}
      {hoverIdx !== null && (
        <g>
          <line x1={pad + hoverIdx * stepX} y1={pad} x2={pad + hoverIdx * stepX} y2={height - pad} stroke="#94a3b8" strokeDasharray="4 3" />
          {visibleIdxs.map((idx) => {
            const s = series[idx];
            const p = allPts[idx][hoverIdx];
            if (!p) return null;
            return <circle key={`h-${idx}`} cx={p.x} cy={p.y} r={4} fill={s.color} />;
          })}
          {/* Tooltip */}
          <g>
            <rect x={pad} y={8} rx={6} ry={6} width={200} height={56} fill="#ffffff" stroke="#e2e8f0" />
            <text x={pad + 8} y={24} fontSize={12} fill="#0f172a">{labels[hoverIdx]}</text>
            {visibleIdxs.slice(0, 3).map((idx, i) => (
              <text key={`t-${i}`} x={pad + 8} y={40 + i * 12} fontSize={11} fill={series[idx].color}>
                {series[idx].name}: {series[idx].values[hoverIdx] ?? 0}
              </text>
            ))}
          </g>
        </g>
      )}

      {/* X labels */}
      {labels.map((lbl, i) => {
        if (i % Math.ceil(labels.length / 8 || 1) !== 0) return null;
        const x = pad + i * stepX;
        const y = height - pad + 14;
        return (
          <text key={lbl + i} x={x} y={y} fontSize={10} textAnchor="middle" fill="#64748b">
            {lbl}
          </text>
        );
      })}

      {/* Legend */}
      {series.map((s, i) => (
        <g key={`legend-${i}`} onClick={() => setSelectedIdx(singleSelect ? i : (selectedIdx === i ? null : i))}>
          <rect x={pad + i * 100} y={8} width={10} height={10} fill={s.color} rx={2} opacity={visibleIdxs.includes(i) ? 1 : 0.25} />
          <text x={pad + i * 100 + 16} y={18} fontSize={11} fill={visibleIdxs.includes(i) ? '#475569' : '#cbd5e1'} style={{ cursor: 'pointer' }}>{s.name}</text>
        </g>
      ))}
    </svg>
  );
}


