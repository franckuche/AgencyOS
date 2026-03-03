'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode } from 'react';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import('recharts').then((m) => m.LineChart),
  { ssr: false }
);
const BarChart = dynamic(
  () => import('recharts').then((m) => m.BarChart),
  { ssr: false }
);
const AreaChart = dynamic(
  () => import('recharts').then((m) => m.AreaChart),
  { ssr: false }
);
const PieChart = dynamic(
  () => import('recharts').then((m) => m.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import('recharts').then((m) => m.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import('recharts').then((m) => m.Cell),
  { ssr: false }
);
const Line = dynamic(
  () => import('recharts').then((m) => m.Line),
  { ssr: false }
);
const Bar = dynamic(
  () => import('recharts').then((m) => m.Bar),
  { ssr: false }
);
const Area = dynamic(
  () => import('recharts').then((m) => m.Area),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then((m) => m.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import('recharts').then((m) => m.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then((m) => m.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import('recharts').then((m) => m.Legend),
  { ssr: false }
);

// ─── Types ───────────────────────────────────────────────────

interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}

interface HeatmapData {
  rows: string[];
  cols: string[];
  values: number[][];
  minColor?: string;
  maxColor?: string;
}

interface ChartConfig {
  type: 'line' | 'bar' | 'stacked-bar' | 'area' | 'histogram' | 'heatmap' | 'pie';
  title?: string;
  subtitle?: string;
  xKey?: string;
  xLabel?: string;
  yLabel?: string;
  series?: ChartSeries[];
  data?: Record<string, unknown>[];
  heatmap?: HeatmapData;
}

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
];

// ─── Error boundary ──────────────────────────────────────────

class ChartErrorBoundary extends Component<
  { children: ReactNode; raw: string },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(err: Error) {
    return { error: err.message };
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback message={this.state.error} raw={this.props.raw} />;
    }
    return this.props.children;
  }
}

// ─── Error fallback ──────────────────────────────────────────

function ErrorFallback({ message, raw }: { message: string; raw: string }) {
  return (
    <div className="chart-container chart-error">
      <p style={{ color: '#DC2626', fontWeight: 600, marginBottom: 8 }}>
        Erreur de graphique : {message}
      </p>
      <pre className="chat-pre" style={{ fontSize: '0.8em', maxHeight: 200, overflow: 'auto' }}>
        {raw}
      </pre>
    </div>
  );
}

// ─── Chart header ────────────────────────────────────────────

function ChartHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  if (!title && !subtitle) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      {title && <div className="chart-title">{title}</div>}
      {subtitle && <div className="chart-subtitle">{subtitle}</div>}
    </div>
  );
}

// ─── Heatmap (CSS grid) ─────────────────────────────────────

function HeatmapChart({ config }: { config: ChartConfig }) {
  const hm = config.heatmap;
  if (!hm || !hm.rows.length || !hm.cols.length || !hm.values.length) {
    return <ErrorFallback message="Données heatmap manquantes (rows, cols, values)" raw="" />;
  }

  const flat = hm.values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);

  const minColor = hm.minColor || '#F3F4F6';
  const maxColor = hm.maxColor || '#3B82F6';

  function interpolateColor(value: number): string {
    if (max === min) return maxColor;
    const t = (value - min) / (max - min);
    const parse = (hex: string) => {
      const h = hex.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };
    const [r1, g1, b1] = parse(minColor);
    const [r2, g2, b2] = parse(maxColor);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
  }

  function textColor(bg: string): string {
    const match = bg.match(/\d+/g);
    if (!match) return '#000';
    const [r, g, b] = match.map(Number);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#374151' : '#FFFFFF';
  }

  return (
    <div className="chart-container">
      <ChartHeader title={config.title} subtitle={config.subtitle} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(${hm.cols.length}, 1fr)`,
          gap: 2,
          fontSize: '0.8em',
        }}
      >
        {/* header row */}
        <div />
        {hm.cols.map((col) => (
          <div key={col} style={{ textAlign: 'center', fontWeight: 600, padding: '4px 2px', color: '#6B7280' }}>
            {col}
          </div>
        ))}

        {/* data rows */}
        {hm.rows.map((row, ri) => (
          <>
            <div key={`label-${row}`} style={{ fontWeight: 600, padding: '6px 8px 6px 0', color: '#374151', whiteSpace: 'nowrap' }}>
              {row}
            </div>
            {hm.cols.map((col, ci) => {
              const val = hm.values[ri]?.[ci] ?? 0;
              const bg = interpolateColor(val);
              return (
                <div
                  key={`${row}-${col}`}
                  className="heatmap-cell"
                  style={{
                    background: bg,
                    color: textColor(bg),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    padding: '6px 4px',
                    fontWeight: 500,
                  }}
                  title={`${row} / ${col} : ${val}`}
                >
                  {val}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

// ─── Recharts-based charts ───────────────────────────────────

function RechartsChart({ config }: { config: ChartConfig }) {
  if (!config.data || !config.data.length) {
    return <ErrorFallback message="Données manquantes (data)" raw="" />;
  }
  if (!config.series || !config.series.length) {
    return <ErrorFallback message="Séries manquantes (series)" raw="" />;
  }

  const xKey = config.xKey || Object.keys(config.data[0])[0];
  const series = config.series.map((s, i) => ({
    ...s,
    color: s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  }));

  const commonAxisProps = {
    tick: { fontSize: 12, fill: '#6B7280' },
    axisLine: { stroke: '#E5E7EB' },
    tickLine: false,
  };

  const renderContent = () => {
    switch (config.type) {
      case 'line':
        return (
          <LineChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey={xKey} {...commonAxisProps} label={config.xLabel ? { value: config.xLabel, position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <YAxis {...commonAxisProps} label={config.yLabel ? { value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <Tooltip />
            <Legend />
            {series.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey={xKey} {...commonAxisProps} label={config.xLabel ? { value: config.xLabel, position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <YAxis {...commonAxisProps} label={config.yLabel ? { value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <Tooltip />
            <Legend />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );

      case 'stacked-bar':
        return (
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey={xKey} {...commonAxisProps} label={config.xLabel ? { value: config.xLabel, position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <YAxis {...commonAxisProps} label={config.yLabel ? { value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <Tooltip />
            <Legend />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} stackId="stack" radius={0} />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey={xKey} {...commonAxisProps} label={config.xLabel ? { value: config.xLabel, position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <YAxis {...commonAxisProps} label={config.yLabel ? { value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <Tooltip />
            <Legend />
            {series.map((s) => (
              <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} fill={s.color} fillOpacity={0.15} strokeWidth={2} />
            ))}
          </AreaChart>
        );

      case 'histogram':
        return (
          <BarChart data={config.data} barCategoryGap={0} barGap={0}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey={xKey} {...commonAxisProps} label={config.xLabel ? { value: config.xLabel, position: 'insideBottom', offset: -5, style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <YAxis {...commonAxisProps} label={config.yLabel ? { value: config.yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#9CA3AF' } } : undefined} />
            <Tooltip />
            <Legend />
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={0} />
            ))}
          </BarChart>
        );

      case 'pie': {
        const valueKey = series[0]?.key || 'value';
        const colors = config.data!.map((d, i) =>
          (d as Record<string, unknown>).color as string || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
        );
        return (
          <PieChart>
            <Pie
              data={config.data}
              dataKey={valueKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(1)}%`}
              labelLine={true}
            >
              {config.data!.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      }

      default:
        return <ErrorFallback message={`Type de graphique inconnu : ${config.type}`} raw="" />;
    }
  };

  return (
    <div className="chart-container">
      <ChartHeader title={config.title} subtitle={config.subtitle} />
      <ResponsiveContainer width="100%" height={300}>
        {renderContent()}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────

export default function ChartBlock({ raw }: { raw: string }) {
  let config: ChartConfig;
  try {
    config = JSON.parse(raw);
  } catch {
    return <ErrorFallback message="JSON invalide" raw={raw} />;
  }

  if (!config.type) {
    return <ErrorFallback message="Champ 'type' manquant" raw={raw} />;
  }

  return (
    <ChartErrorBoundary raw={raw}>
      {config.type === 'heatmap' ? (
        <HeatmapChart config={config} />
      ) : (
        <RechartsChart config={config} />
      )}
    </ChartErrorBoundary>
  );
}
