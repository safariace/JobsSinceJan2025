import React, { useState } from 'react';
import { MONTHLY_SERIES } from '../data/blsData';
import { Sliders, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';

export const CounterfactualPivot: React.FC = () => {
  // Sliders for counterfactual simulation (in thousands)
  const [tempHelpShock, setTempHelpShock] = useState<number>(0); // 0 means remove entire -240K drag, 100 means full drag (-240K)
  const [manufacturingDrag, setManufacturingDrag] = useState<number>(100); // 100 means full -185K drag, 0 means 0
  const [techDrag, setTechDrag] = useState<number>(100); // 100 means full -95K drag, 0 means 0

  // Calculate adjusted baseline
  // Default is -222K.
  // Full temp help drag is -240K. If shock is 0, we add back 240K => +18K.
  const tempHelpAddedBack = Math.round(240 * (1 - tempHelpShock / 100));
  const mfgAddedBack = Math.round(185 * (1 - manufacturingDrag / 100));
  const techAddedBack = Math.round(95 * (1 - techDrag / 100));

  const totalAdjustment = tempHelpAddedBack + mfgAddedBack + techAddedBack;
  const simulatedRestOfEconomy = -222 + totalAdjustment;
  const simulatedTotalJobs = 998 + simulatedRestOfEconomy;

  // Chart setup
  const width = 800;
  const height = 360;
  const padding = { top: 30, right: 160, bottom: 40, left: 55 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const yMin = -600;
  const yMax = 1100;
  const getY = (val: number) => padding.top + innerH - ((val - yMin) / (yMax - yMin)) * innerH;
  const getX = (idx: number) => padding.left + (idx / (MONTHLY_SERIES.length - 1)) * innerW;

  // Dynamic series based on adjustment
  const simulatedPoints = MONTHLY_SERIES.map((pt, i) => {
    // Distribute adjustment proportionally over time
    const ratio = i / (MONTHLY_SERIES.length - 1);
    const adjAtMonth = totalAdjustment * ratio;
    return {
      x: getX(pt.monthIndex),
      y: getY(pt.restOfEconomyCumulative + adjAtMonth),
      val: Math.round(pt.restOfEconomyCumulative + adjAtMonth),
    };
  });

  const simulatedPath = simulatedPoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const officialRestPath = MONTHLY_SERIES.map((pt, i) => {
    const x = getX(pt.monthIndex);
    const y = getY(pt.restOfEconomyCumulative);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  const healthPath = MONTHLY_SERIES.map((pt, i) => {
    const x = getX(pt.monthIndex);
    const y = getY(pt.healthcareCumulative);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Counterfactual Simulator</span>
              <span>·</span>
              <span>Flexible Labor Shock</span>
              <span>·</span>
              <span>CES6056132001</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              The Temporary Help Staffing Pivot
            </h2>
            <p className="text-sm text-neutral-600 mt-0.5">
              Simulate how the headline narrative transforms when removing cyclical flexible labor reductions
            </p>
          </div>

          <button
            onClick={() => {
              setTempHelpShock(0);
              setManufacturingDrag(100);
              setTechDrag(100);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to ex-Temp Staffing Baseline</span>
          </button>
        </div>

        {/* Simulator Sliders */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 p-4 bg-neutral-50/60 rounded-lg border border-neutral-100">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-800">
                Temporary Staffing Drag
              </span>
              <span className="font-mono text-neutral-600">
                {tempHelpShock === 100
                  ? '-240K (Official)'
                  : tempHelpShock === 0
                  ? '0K (Excluded)'
                  : `-${Math.round(240 * (tempHelpShock / 100))}K`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={tempHelpShock}
              onChange={(e) => setTempHelpShock(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              CES6056132001: Agency staffing dropped -240K as firms shed flexible buffer labor.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-800">
                Manufacturing Headwinds
              </span>
              <span className="font-mono text-neutral-600">
                {manufacturingDrag === 100
                  ? '-185K (Official)'
                  : manufacturingDrag === 0
                  ? '0K (Neutralized)'
                  : `-${Math.round(185 * (manufacturingDrag / 100))}K`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={manufacturingDrag}
              onChange={(e) => setManufacturingDrag(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              CES3000000001: Capital goods & durable factory payrolls dampened by high rates.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-neutral-800">
                Tech / Media Restructuring
              </span>
              <span className="font-mono text-neutral-600">
                {techDrag === 100
                  ? '-95K (Official)'
                  : techDrag === 0
                  ? '0K (Neutralized)'
                  : `-${Math.round(95 * (techDrag / 100))}K`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={techDrag}
              onChange={(e) => setTechDrag(parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              CES5000000001: Silicon Valley headcount discipline and Hollywood strike ripples.
            </p>
          </div>
        </div>

        {/* Live Simulation Chart */}
        <div className="mt-5 bg-white rounded border border-neutral-100 p-2 overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[700px] h-auto font-sans select-none"
          >
            {/* Grid ticks */}
            {[-600, -400, -200, 0, 200, 400, 600, 800, 1000].map((tick) => {
              const y = getY(tick);
              const isZero = tick === 0;
              return (
                <g key={tick}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke={isZero ? '#171717' : '#F0F0F0'}
                    strokeWidth={isZero ? 1.5 : 1}
                    strokeDasharray={isZero ? undefined : '2 3'}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-neutral-500"
                  >
                    {tick > 0 ? `+${tick}K` : `${tick}K`}
                  </text>
                </g>
              );
            })}

            {/* Official Healthcare Line */}
            <path
              d={healthPath}
              fill="none"
              stroke="#2563EB"
              strokeWidth={2}
              opacity={0.6}
            />
            <text
              x={width - padding.right + 10}
              y={getY(998) + 4}
              className="text-[11px] font-bold fill-blue-700"
            >
              Health Care (+998K)
            </text>

            {/* Official Rest of Economy (Faint Red) */}
            <path
              d={officialRestPath}
              fill="none"
              stroke="#DC2626"
              strokeWidth={2}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <text
              x={width - padding.right + 10}
              y={getY(-222) + 4}
              className="text-[11px] font-medium fill-red-500"
            >
              Official Rest (-222K)
            </text>

            {/* Simulated Line */}
            <path
              d={simulatedPath}
              fill="none"
              stroke={simulatedRestOfEconomy >= 0 ? '#10B981' : '#F59E0B'}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <circle
              cx={width - padding.right}
              cy={getY(simulatedRestOfEconomy)}
              r={5}
              fill={simulatedRestOfEconomy >= 0 ? '#10B981' : '#F59E0B'}
            />

            <g transform={`translate(${width - padding.right + 10}, ${getY(simulatedRestOfEconomy) + 4})`}>
              <text
                className={`text-[12px] font-bold ${
                  simulatedRestOfEconomy >= 0 ? 'fill-emerald-700' : 'fill-amber-700'
                }`}
              >
                Simulated Rest
              </text>
              <text
                y={15}
                className={`text-[12px] font-bold font-mono ${
                  simulatedRestOfEconomy >= 0 ? 'fill-emerald-800' : 'fill-amber-800'
                }`}
              >
                {simulatedRestOfEconomy > 0 ? `+${simulatedRestOfEconomy}K` : `${simulatedRestOfEconomy}K`}
              </text>
            </g>
          </svg>
        </div>

        {/* Impact Summary Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200">
            <div className="text-xs text-neutral-500">Simulated Rest of Economy</div>
            <div
              className={`text-2xl font-bold font-mono mt-1 ${
                simulatedRestOfEconomy >= 0 ? 'text-emerald-700' : 'text-amber-600'
              }`}
            >
              {simulatedRestOfEconomy > 0 ? `+${simulatedRestOfEconomy}K` : `${simulatedRestOfEconomy}K`}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Net delta: {totalAdjustment >= 0 ? `+${totalAdjustment}K` : `${totalAdjustment}K`} vs official
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200">
            <div className="text-xs text-neutral-500">Simulated Total Nonfarm</div>
            <div className="text-2xl font-bold font-mono text-neutral-900 mt-1">
              +{simulatedTotalJobs.toLocaleString()}K
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Combined nationwide employment gain
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200">
            <div className="text-xs text-neutral-500">Why Temp Help Matters</div>
            <div className="text-xs text-neutral-700 mt-1 leading-relaxed">
              Staffing agencies function as an <em>economic shock absorber</em>. Drops in temp workers insulate permanent payrolls during inventory adjustments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
