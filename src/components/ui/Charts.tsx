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
  maxBar = 220,
}: {
  items: { label: string; value: number; color: string }[];
  maxBar?: number;
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
  const pad = 24;
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
      {/* Axes */}
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#e5e7eb" />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#e5e7eb" />

      {/* Polyline */}
      <polyline fill="none" stroke={color} strokeWidth={2} points={points} />

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


