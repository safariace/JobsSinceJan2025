import React, { useState } from 'react';
import { SECTOR_BREAKDOWN, SectorDecompositionItem } from '../data/blsData';
import { ChevronDown, ChevronUp, Sliders, CheckCircle2 } from 'lucide-react';

interface SectorWaterfallProps {
  onPivotToGeography?: () => void;
}

export const SectorWaterfall: React.FC<SectorWaterfallProps> = ({ onPivotToGeography }) => {
  const [expandedSectorId, setExpandedSectorId] = useState<string | null>('prof_business');
  const [excludeTempHelp, setExcludeTempHelp] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');

  // Positive non-health items
  const positiveItems = SECTOR_BREAKDOWN.filter((s) => s.category === 'positive');
  // Negative non-health items
  const negativeItems = SECTOR_BREAKDOWN.filter((s) => s.category === 'negative');

  // Calculate adjusted values based on counterfactual
  const adjustedProfServices = excludeTempHelp
    ? -365 - (-240) // -125K
    : -365;

  const totalPositive = positiveItems.reduce((acc, curr) => acc + curr.cumulativeChange, 0);
  const totalNegative = negativeItems.reduce((acc, curr) => {
    if (curr.id === 'prof_business') {
      return acc + adjustedProfServices;
    }
    return acc + curr.cumulativeChange;
  }, 0);

  const netRestOfEconomy = totalPositive + totalNegative;

  // Build the waterfall steps
  interface WaterfallBar {
    id: string;
    label: string;
    blsCode: string;
    change: number;
    start: number;
    end: number;
    isTotal?: boolean;
    color: string;
    isSubsectorExpanded?: boolean;
    item?: SectorDecompositionItem;
  }

  const waterfallBars: WaterfallBar[] = [];
  let currentVal = 0;

  // 1. Positive Steps
  positiveItems.forEach((item) => {
    const start = currentVal;
    const end = start + item.cumulativeChange;
    currentVal = end;
    waterfallBars.push({
      id: item.id,
      label: item.name,
      blsCode: item.blsCode,
      change: item.cumulativeChange,
      start,
      end,
      color: '#10B981', // green
      item,
    });
  });

  // Intermediate Subtotal Positive (+670K)
  waterfallBars.push({
    id: 'subtotal_pos',
    label: 'Total Positive Engines',
    blsCode: 'Subtotal',
    change: totalPositive,
    start: 0,
    end: totalPositive,
    isTotal: true,
    color: '#059669',
  });

  // 2. Negative Steps
  negativeItems.forEach((item) => {
    const change = item.id === 'prof_business' ? adjustedProfServices : item.cumulativeChange;
    const start = currentVal;
    const end = start + change;
    currentVal = end;
    waterfallBars.push({
      id: item.id,
      label: item.id === 'prof_business' && excludeTempHelp ? `${item.name} (ex-Temp)` : item.name,
      blsCode: item.blsCode,
      change,
      start,
      end,
      color: '#EF4444', // red
      item,
    });
  });

  // Final Net Bar
  waterfallBars.push({
    id: 'final_net',
    label: excludeTempHelp ? 'Net Rest of Economy (ex-Temp)' : 'Net Rest of Economy',
    blsCode: 'PAYEMS - Health',
    change: netRestOfEconomy,
    start: 0,
    end: netRestOfEconomy,
    isTotal: true,
    color: netRestOfEconomy >= 0 ? '#10B981' : '#DC2626',
  });

  // Visual scaling
  const chartHeight = 360;
  const chartWidth = 920;
  const paddingLeft = 140;
  const paddingRight = 40;
  const innerWidth = chartWidth - paddingLeft - paddingRight;

  const minVal = -300;
  const maxVal = 750;
  const getX = (val: number) => {
    return paddingLeft + ((val - minVal) / (maxVal - minVal)) * innerWidth;
  };

  const filteredBars = waterfallBars.filter((bar) => {
    if (bar.isTotal) return true;
    if (filterType === 'all') return true;
    if (filterType === 'positive') return bar.change > 0;
    if (filterType === 'negative') return bar.change < 0;
    return true;
  });

  const barHeight = Math.min(20, Math.floor(chartHeight / filteredBars.length) - 6);

  return (
    <div className="space-y-6">
      {/* Title & Explanatory Lead */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Deconstruction Engine</span>
              <span>·</span>
              <span>Waterfall Analysis</span>
              <span>·</span>
              <span>Jan 2025 to Sep 2026</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Decomposing the -222,000 "Rest of Economy" Deficit
            </h2>
            <p className="text-sm text-neutral-600 mt-0.5">
              How +670K in robust growth sectors was outweighed by -892K in rate-sensitive and temporary staffing cuts
            </p>
          </div>

          {/* Interactive Counterfactual Toggle */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 flex items-center gap-3">
            <Sliders className="w-4 h-4 text-neutral-500" />
            <div className="text-xs">
              <div className="font-semibold text-neutral-800">Counterfactual Sandbox</div>
              <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={excludeTempHelp}
                  onChange={(e) => setExcludeTempHelp(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-emerald-700">
                  Exclude Temporary Help Services (-240K)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Counterfactual Callout Status Banner */}
        {excludeTempHelp ? (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Counterfactual Active:</strong> By isolating the -240,000 temporary staffing agency drop, the entire non-healthcare economy flips from <strong>-222,000</strong> to <strong>+18,000 jobs (Net Positive)</strong>!
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 shrink-0 ml-2">
              Net = +18K
            </span>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-md text-xs text-neutral-600 flex items-center justify-between">
            <span>
              <strong>Standard BLS Aggregation:</strong> Net Rest of the Economy = +670K (Positive drivers) - 892K (Negative drivers) = <strong>-222,000 jobs</strong>.
            </span>
            <span className="font-mono font-bold text-red-600 shrink-0 ml-2">
              Net = -222K
            </span>
          </div>
        )}

        {/* Horizontal Waterfall SVG */}
        <div className="mt-4 overflow-x-auto bg-white rounded border border-neutral-100 p-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${filteredBars.length * 28 + 60}`}
            className="w-full min-w-[760px] h-auto font-sans select-none"
          >
            {/* Zero vertical line */}
            <line
              x1={getX(0)}
              y1={20}
              x2={getX(0)}
              y2={filteredBars.length * 28 + 20}
              stroke="#171717"
              strokeWidth={1.5}
            />
            <text
              x={getX(0)}
              y={14}
              textAnchor="middle"
              className="text-[10px] font-mono fill-neutral-600 font-bold"
            >
              0 (Baseline)
            </text>

            {/* Vertical grid lines */}
            {[-200, 200, 400, 600].map((val) => (
              <g key={val}>
                <line
                  x1={getX(val)}
                  y1={20}
                  x2={getX(val)}
                  y2={filteredBars.length * 28 + 20}
                  stroke="#F3F4F6"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <text
                  x={getX(val)}
                  y={14}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-neutral-400"
                >
                  {val > 0 ? `+${val}K` : `${val}K`}
                </text>
              </g>
            ))}

            {/* Render Bars */}
            {filteredBars.map((bar, index) => {
              const y = 30 + index * 28;
              const leftVal = Math.min(bar.start, bar.end);
              const rightVal = Math.max(bar.start, bar.end);
              const barX = getX(leftVal);
              const barW = Math.max(2, getX(rightVal) - barX);

              const isSelected = expandedSectorId === bar.id;

              return (
                <g
                  key={bar.id}
                  className="cursor-pointer group"
                  onClick={() => {
                    if (bar.item) {
                      setExpandedSectorId(isSelected ? null : bar.id);
                    }
                  }}
                >
                  {/* Row Highlight */}
                  <rect
                    x={0}
                    y={y - 4}
                    width={chartWidth}
                    height={26}
                    fill={isSelected ? '#F8FAFC' : 'transparent'}
                    className="group-hover:fill-neutral-50 transition-colors"
                  />

                  {/* Label */}
                  <text
                    x={paddingLeft - 10}
                    y={y + 12}
                    textAnchor="end"
                    className={`text-[11px] ${
                      bar.isTotal
                        ? 'font-bold fill-neutral-900'
                        : isSelected
                        ? 'font-semibold fill-blue-700'
                        : 'fill-neutral-700'
                    }`}
                  >
                    {bar.label}
                  </text>

                  {/* Bar */}
                  <rect
                    x={barX}
                    y={y}
                    width={barW}
                    height={16}
                    fill={bar.color}
                    rx={2}
                    className="transition-all duration-300"
                  />

                  {/* Value Annotation */}
                  <text
                    x={bar.change >= 0 ? barX + barW + 6 : barX - 6}
                    y={y + 12}
                    textAnchor={bar.change >= 0 ? 'start' : 'end'}
                    className={`text-[10px] font-mono font-bold ${
                      bar.change >= 0 ? 'fill-emerald-700' : 'fill-red-700'
                    }`}
                  >
                    {bar.change > 0 ? `+${bar.change}K` : `${bar.change}K`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
          <span>Click any sector bar above or select from the list below to inspect subsector components.</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            <span>Positive additions</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block ml-2"></span>
            <span>Negative drag</span>
          </div>
        </div>
      </div>

      {/* Sector Deep Dive Inspector */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            Sector Component Breakdown & Economic Drivers
          </h3>
          <span className="text-xs text-neutral-500">BLS CES Series Codes</span>
        </div>

        <div className="space-y-3">
          {SECTOR_BREAKDOWN.filter((s) => s.category !== 'healthcare').map((sector) => {
            const isExpanded = expandedSectorId === sector.id;
            const isProfServices = sector.id === 'prof_business';
            const displayChange = isProfServices && excludeTempHelp
              ? adjustedProfServices
              : sector.cumulativeChange;

            return (
              <div
                key={sector.id}
                className={`border rounded-lg transition-all ${
                  isExpanded
                    ? 'border-neutral-400 bg-neutral-50/40 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div
                  onClick={() => setExpandedSectorId(isExpanded ? null : sector.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        displayChange >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                        <span>{sector.name}</span>
                        <span className="text-xs font-mono text-neutral-400 font-normal">
                          [{sector.blsCode}]
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {sector.economicFactor}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-bold font-mono ${
                          displayChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {displayChange > 0 ? `+${displayChange}K` : `${displayChange}K`}
                      </span>
                      {isProfServices && excludeTempHelp && (
                        <div className="text-[10px] text-emerald-600 font-medium">
                          ex-Temp Help
                        </div>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>

                {/* Subsector Component Table */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-neutral-200 bg-white rounded-b-lg">
                    <p className="text-xs text-neutral-600 mb-3">{sector.description}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-neutral-50 text-neutral-500 border-y border-neutral-200">
                          <tr>
                            <th className="py-1.5 px-3 font-medium">Sub-Industry Component</th>
                            <th className="py-1.5 px-3 font-medium">BLS Series</th>
                            <th className="py-1.5 px-3 font-medium text-right">Job Change</th>
                            <th className="py-1.5 px-3 font-medium text-right">Share / Impact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {sector.subsectors.map((sub, idx) => (
                            <tr
                              key={idx}
                              className={
                                sub.name.includes('Temporary Help')
                                  ? 'bg-amber-50/60 font-medium'
                                  : 'hover:bg-neutral-50'
                              }
                            >
                              <td className="py-2 px-3 text-neutral-800">
                                {sub.name}
                                {sub.name.includes('Temporary Help') && (
                                  <span className="ml-2 text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                                    Leading Indicator
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 font-mono text-neutral-500">{sub.code}</td>
                              <td
                                className={`py-2 px-3 text-right font-mono font-bold ${
                                  sub.change > 0 ? 'text-emerald-600' : 'text-red-600'
                                }`}
                              >
                                {sub.change > 0 ? `+${sub.change}K` : `${sub.change}K`}
                              </td>
                              <td className="py-2 px-3 text-right text-neutral-600 font-mono">
                                {sub.share}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
