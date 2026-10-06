import React, { useState, useMemo } from 'react';
import { MONTHLY_SERIES, MonthData } from '../data/blsData';
import { Info, HelpCircle } from 'lucide-react';

interface HeadlineChartProps {
  onPivotToSectors?: () => void;
  onPivotToGeography?: () => void;
}

type MetricMode = 'cumulative' | 'mom' | 'level';

export const HeadlineChart: React.FC<HeadlineChartProps> = ({
  onPivotToSectors,
  onPivotToGeography,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('cumulative');
  const [showCounterfactual, setShowCounterfactual] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(MONTHLY_SERIES.length - 1);
  const [hoveredPoint, setHoveredPoint] = useState<MonthData | null>(null);

  // Active data up to current slider index
  const activeSeries = useMemo(() => {
    return MONTHLY_SERIES.slice(0, sliderIndex + 1);
  }, [sliderIndex]);

  const currentMonthData = MONTHLY_SERIES[sliderIndex];
  const displayPoint = hoveredPoint || currentMonthData;

  // Chart Dimensions
  const width = 860;
  const height = 440;
  const margin = { top: 40, right: 180, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Domain configuration depending on metric mode
  const { yMin, yMax, yTicks, formatY, yZero } = useMemo(() => {
    if (metricMode === 'cumulative') {
      const min = -600;
      const max = 1100;
      const ticks = [-600, -400, -200, 0, 200, 400, 600, 800, 1000];
      return {
        yMin: min,
        yMax: max,
        yTicks: ticks,
        formatY: (val: number) => (val > 0 ? `+${val}K` : `${val}K`),
        yZero: 0,
      };
    } else if (metricMode === 'mom') {
      const min = -100;
      const max = 140;
      const ticks = [-80, -40, 0, 40, 80, 120];
      return {
        yMin: min,
        yMax: max,
        yTicks: ticks,
        formatY: (val: number) => (val > 0 ? `+${val}K` : `${val}K`),
        yZero: 0,
      };
    } else {
      // Total level in millions
      const min = 18;
      const max = 165;
      const ticks = [20, 50, 80, 110, 140, 160];
      return {
        yMin: min,
        yMax: max,
        yTicks: ticks,
        formatY: (val: number) => `${val}M`,
        yZero: null,
      };
    }
  }, [metricMode]);

  // Scalers
  const getX = (index: number) => {
    if (MONTHLY_SERIES.length <= 1) return margin.left;
    return margin.left + (index / (MONTHLY_SERIES.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    return margin.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight;
  };

  // Line paths generators
  const generatePath = (
    accessor: (d: MonthData) => number,
    data: MonthData[] = activeSeries
  ) => {
    if (data.length === 0) return '';
    return data
      .map((d, i) => {
        const x = getX(d.monthIndex);
        const y = getY(accessor(d));
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const healthPath = generatePath((d) =>
    metricMode === 'cumulative'
      ? d.healthcareCumulative
      : metricMode === 'mom'
      ? d.healthcareMoM
      : d.healthcareLevel
  );

  const restPath = generatePath((d) =>
    metricMode === 'cumulative'
      ? d.restOfEconomyCumulative
      : metricMode === 'mom'
      ? d.restOfEconomyMoM
      : d.restOfEconomyLevel
  );

  const counterfactualPath = generatePath((d) =>
    metricMode === 'cumulative'
      ? d.restExcludingTempHelpCumulative
      : d.restOfEconomyCumulative
  );

  const totalPath = generatePath((d) =>
    metricMode === 'cumulative'
      ? d.totalNonfarmCumulative
      : metricMode === 'mom'
      ? d.totalNonfarmMoM
      : d.totalNonfarmLevel
  );

  // Key monthly tick points on x-axis
  const xTickIndices = [0, 3, 6, 9, 12, 15, 18, 20];

  return (
    <div className="space-y-6">
      {/* Top Banner introducing the recreation */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Original Visualization</span>
              <span>·</span>
              <span>Steve Rattner / Morning Joe (MSNBC)</span>
              <span>·</span>
              <span>BLS CES Survey</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Nearly All New Jobs Have Been in Health Care
            </h1>
            <p className="text-sm text-neutral-600 mt-0.5">
              Cumulative change in nonfarm payroll jobs since January 2025
            </p>
          </div>

          {/* Metric Selector Controls */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-md self-start md:self-auto">
            <button
              onClick={() => setMetricMode('cumulative')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                metricMode === 'cumulative'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Cumulative Change
            </button>
            <button
              onClick={() => setMetricMode('mom')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                metricMode === 'mom'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Monthly Net (MoM)
            </button>
            <button
              onClick={() => setMetricMode('level')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                metricMode === 'level'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Total Level (M)
            </button>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="relative mt-4 bg-neutral-50/50 rounded-lg border border-neutral-100 p-2 sm:p-4 overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[700px] h-auto font-sans select-none"
          >
            {/* Background Grid Lines */}
            {yTicks.map((tick) => {
              const y = getY(tick);
              const isZero = tick === 0;
              return (
                <g key={tick}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={width - margin.right}
                    y2={y}
                    stroke={isZero ? '#171717' : '#E5E5E5'}
                    strokeWidth={isZero ? 1.5 : 1}
                    strokeDasharray={isZero ? undefined : '2 3'}
                  />
                  <text
                    x={margin.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] fill-neutral-500 font-mono"
                  >
                    {formatY(tick)}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Vertical Guide Ticks */}
            {xTickIndices.map((idx) => {
              const x = getX(idx);
              const item = MONTHLY_SERIES[idx];
              return (
                <g key={idx}>
                  <line
                    x1={x}
                    y1={margin.top}
                    x2={x}
                    y2={height - margin.bottom}
                    stroke="#F0F0F0"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={height - margin.bottom + 20}
                    textAnchor="middle"
                    className="text-[11px] fill-neutral-600 font-medium"
                  >
                    {item.shortMonth}
                  </text>
                </g>
              );
            })}

            {/* Zero Baseline Callout */}
            {yZero !== null && (
              <text
                x={margin.left + 8}
                y={getY(0) - 6}
                className="text-[10px] fill-neutral-400 font-mono uppercase tracking-wider"
              >
                Jan 2025 Baseline = 0
              </text>
            )}

            {/* Counterfactual Line (If Enabled) */}
            {showCounterfactual && metricMode === 'cumulative' && (
              <g>
                <path
                  d={counterfactualPath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  strokeDasharray="4 3"
                />
                {activeSeries.length > 0 && (
                  <circle
                    cx={getX(activeSeries[activeSeries.length - 1].monthIndex)}
                    cy={getY(
                      activeSeries[activeSeries.length - 1]
                        .restExcludingTempHelpCumulative
                    )}
                    r={4.5}
                    fill="#10B981"
                  />
                )}
                <text
                  x={getX(activeSeries[activeSeries.length - 1].monthIndex) + 12}
                  y={getY(
                    activeSeries[activeSeries.length - 1]
                      .restExcludingTempHelpCumulative
                  ) + 4}
                  className="text-[11px] font-semibold fill-emerald-600"
                >
                  Rest ex-Temp Staffing ({activeSeries[activeSeries.length - 1].restExcludingTempHelpCumulative > 0 ? '+' : ''}{activeSeries[activeSeries.length - 1].restExcludingTempHelpCumulative}K)
                </text>
              </g>
            )}

            {/* Total Nonfarm Line (Faint Context) */}
            {metricMode === 'cumulative' && (
              <g>
                <path
                  d={totalPath}
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
                <text
                  x={getX(activeSeries[activeSeries.length - 1].monthIndex) + 12}
                  y={getY(
                    activeSeries[activeSeries.length - 1].totalNonfarmCumulative
                  ) + 4}
                  className="text-[11px] fill-neutral-500 font-mono"
                >
                  Net Total Nonfarm (+{activeSeries[activeSeries.length - 1].totalNonfarmCumulative}K)
                </text>
              </g>
            )}

            {/* Line 1: Health Care and Social Assistance (Blue) */}
            <path
              d={healthPath}
              fill="none"
              stroke="#2563EB"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {activeSeries.length > 0 && (
              <circle
                cx={getX(activeSeries[activeSeries.length - 1].monthIndex)}
                cy={getY(
                  metricMode === 'cumulative'
                    ? activeSeries[activeSeries.length - 1].healthcareCumulative
                    : metricMode === 'mom'
                    ? activeSeries[activeSeries.length - 1].healthcareMoM
                    : activeSeries[activeSeries.length - 1].healthcareLevel
                )}
                r={5}
                fill="#2563EB"
              />
            )}

            {/* Line 2: Rest of the Economy (Red) */}
            <path
              d={restPath}
              fill="none"
              stroke="#DC2626"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {activeSeries.length > 0 && (
              <circle
                cx={getX(activeSeries[activeSeries.length - 1].monthIndex)}
                cy={getY(
                  metricMode === 'cumulative'
                    ? activeSeries[activeSeries.length - 1].restOfEconomyCumulative
                    : metricMode === 'mom'
                    ? activeSeries[activeSeries.length - 1].restOfEconomyMoM
                    : activeSeries[activeSeries.length - 1].restOfEconomyLevel
                )}
                r={5}
                fill="#DC2626"
              />
            )}

            {/* Right-hand Series Labels (Rattner Style) */}
            {activeSeries.length > 0 && (
              <g>
                {/* Health Care Label */}
                <g
                  transform={`translate(${
                    getX(activeSeries[activeSeries.length - 1].monthIndex) + 12
                  }, ${
                    getY(
                      metricMode === 'cumulative'
                        ? activeSeries[activeSeries.length - 1].healthcareCumulative
                        : metricMode === 'mom'
                        ? activeSeries[activeSeries.length - 1].healthcareMoM
                        : activeSeries[activeSeries.length - 1].healthcareLevel
                    ) - 6
                  })`}
                >
                  <text className="text-[12px] font-bold fill-blue-700">
                    Health care and
                  </text>
                  <text y={15} className="text-[12px] font-bold fill-blue-700">
                    social assistance
                  </text>
                  <text
                    y={32}
                    className="text-[13px] font-bold font-mono fill-blue-800"
                  >
                    {metricMode === 'cumulative'
                      ? `+${activeSeries[activeSeries.length - 1].healthcareCumulative.toLocaleString()}K`
                      : metricMode === 'mom'
                      ? `+${activeSeries[activeSeries.length - 1].healthcareMoM}K/mo`
                      : `${activeSeries[activeSeries.length - 1].healthcareLevel}M`}
                  </text>
                </g>

                {/* Rest of Economy Label */}
                <g
                  transform={`translate(${
                    getX(activeSeries[activeSeries.length - 1].monthIndex) + 12
                  }, ${
                    getY(
                      metricMode === 'cumulative'
                        ? activeSeries[activeSeries.length - 1].restOfEconomyCumulative
                        : metricMode === 'mom'
                        ? activeSeries[activeSeries.length - 1].restOfEconomyMoM
                        : activeSeries[activeSeries.length - 1].restOfEconomyLevel
                    ) - 6
                  })`}
                >
                  <text className="text-[12px] font-bold fill-red-700">
                    Rest of the
                  </text>
                  <text y={15} className="text-[12px] font-bold fill-red-700">
                    economy
                  </text>
                  <text
                    y={32}
                    className="text-[13px] font-bold font-mono fill-red-800"
                  >
                    {metricMode === 'cumulative'
                      ? `${activeSeries[activeSeries.length - 1].restOfEconomyCumulative.toLocaleString()}K`
                      : metricMode === 'mom'
                      ? `${activeSeries[activeSeries.length - 1].restOfEconomyMoM}K/mo`
                      : `${activeSeries[activeSeries.length - 1].restOfEconomyLevel}M`}
                  </text>
                </g>
              </g>
            )}

            {/* Hover Crosshair */}
            {hoveredPoint && (
              <g>
                <line
                  x1={getX(hoveredPoint.monthIndex)}
                  y1={margin.top}
                  x2={getX(hoveredPoint.monthIndex)}
                  y2={height - margin.bottom}
                  stroke="#525252"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
              </g>
            )}

            {/* Mouse Listener Rectangles for smooth hover */}
            {MONTHLY_SERIES.map((pt) => {
              const x = getX(pt.monthIndex);
              const stepWidth = innerWidth / (MONTHLY_SERIES.length - 1);
              return (
                <rect
                  key={pt.monthIndex}
                  x={x - stepWidth / 2}
                  y={margin.top}
                  width={stepWidth}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setSliderIndex(pt.monthIndex)}
                />
              );
            })}

            {/* Steve Rattner Signature Badge */}
            <g transform={`translate(${width - margin.right + 70}, ${height - 24})`}>
              <rect
                x={-60}
                y={-14}
                width={85}
                height={20}
                fill="#1E293B"
                rx={3}
              />
              <text
                x={-18}
                y={0}
                textAnchor="middle"
                className="text-[9px] font-bold fill-white uppercase tracking-wider"
              >
                Steve Rattner
              </text>
            </g>
          </svg>
        </div>

        {/* Timeline Scrubber & Live Snapshot */}
        <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2 flex items-center gap-3">
            <span className="text-xs text-neutral-500 whitespace-nowrap">
              Timeline Scrubber:
            </span>
            <input
              type="range"
              min={0}
              max={MONTHLY_SERIES.length - 1}
              value={sliderIndex}
              onChange={(e) => setSliderIndex(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-semibold text-neutral-800 whitespace-nowrap">
              {MONTHLY_SERIES[sliderIndex].month}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={showCounterfactual}
                onChange={(e) => setShowCounterfactual(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium text-emerald-700">
                Overlay Temp Help Counterfactual (+18K)
              </span>
            </label>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-3 text-[11px] text-neutral-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>
            Source: Bureau of Labor Statistics (BLS CES Series{' '}
            <code className="text-neutral-700">CES6562000001</code> &{' '}
            <code className="text-neutral-700">PAYEMS</code>). Seasonally adjusted.
          </span>
          <span className="text-neutral-400">
            Observation through September 2026
          </span>
        </div>
      </div>

      {/* Snapshot Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-xs text-neutral-500 mb-1">
            Health Care & Social Assistance
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
            +{displayPoint.healthcareCumulative.toLocaleString()}K
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Total level: {displayPoint.healthcareLevel}M workers (14% of workforce)
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-xs text-neutral-500 mb-1">
            Rest of Economy (Residual)
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 tabular-nums">
            {displayPoint.restOfEconomyCumulative.toLocaleString()}K
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Aggregates 136.5M workers across 13 major industries
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="text-xs text-neutral-500 mb-1">
            Net Total Nonfarm Payrolls
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            +{displayPoint.totalNonfarmCumulative.toLocaleString()}K
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            BLS Series PAYEMS · All Employees Total Nonfarm
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="text-xs text-emerald-700 mb-1">
            Ex-Temp Staffing Counterfactual
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
            {displayPoint.restExcludingTempHelpCumulative > 0 ? '+' : ''}
            {displayPoint.restExcludingTempHelpCumulative.toLocaleString()}K
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            Removes -240K Temporary Staffing Agency drag
          </div>
        </div>
      </div>

      {/* "What This Chart Hides" Key Findings Section */}
      <div className="bg-neutral-900 text-white rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-400 font-medium">Critical Analysis</div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Three Crucial Realities Hidden by the 2-Line Chart
            </h2>
          </div>
          <span className="text-xs text-neutral-400">BLS Economic Deconstruction</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 border-l-2 border-blue-500 pl-4">
            <h3 className="text-sm font-semibold text-white">
              1. The Base Scale Fallacy (14% vs 86%)
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              The chart implies two equal halves of the economy. In reality, Health Care accounts for <strong>21.8 million jobs</strong> (14%), while "Rest of Economy" consolidates <strong>136.7 million workers</strong> (86%) across 13 distinct sectors. A modest percentage shift across 86% creates large absolute lines that mask individual sector dynamics.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
            <h3 className="text-sm font-semibold text-white">
              2. Masked Positive Growth Engines (+670K)
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              The non-health economy was NOT a uniform sinkhole. <strong>Government added +345K</strong> (public education & municipal recovery) and <strong>Construction added +145K</strong> (infrastructure & semiconductor mega-fabs). Together with Leisure (+95K), non-health sectors added <strong>+670,000 jobs</strong> that are entirely buried by the negative residual.
            </p>
            {onPivotToSectors && (
              <button
                onClick={onPivotToSectors}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium pt-1 block"
              >
                Inspect Sector Waterfall →
              </button>
            )}
          </div>

          <div className="space-y-2 border-l-2 border-amber-500 pl-4">
            <h3 className="text-sm font-semibold text-white">
              3. The Geography Divide (Sunbelt vs Rust Belt)
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              The national line is split regionally: <strong>Texas (+119K non-health)</strong> and <strong>Florida (+96K non-health)</strong> boomed across all sectors. Meanwhile, California (-153K non-health) and New York (-113K non-health) suffered steep corporate and tech cuts that were masked by their massive healthcare sectors.
            </p>
            {onPivotToGeography && (
              <button
                onClick={onPivotToGeography}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium pt-1 block"
              >
                Explore 50-State Map →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
