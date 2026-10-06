import React, { useState, useMemo } from 'react';
import { STATES_DATA, StateEmploymentData } from '../data/blsData';
import { Search, MapPin, TrendingUp, TrendingDown, Layers, ArrowUpDown } from 'lucide-react';

// Grid coordinates for US Hex/Grid Cartogram (standard 11 columns x 8 rows)
interface StateGridPosition {
  code: string;
  row: number;
  col: number;
}

const STATE_GRID_LAYOUT: StateGridPosition[] = [
  // Row 0
  { code: 'AK', row: 0, col: 0 },
  { code: 'ME', row: 0, col: 10 },
  // Row 1
  { code: 'VT', row: 1, col: 9 },
  { code: 'NH', row: 1, col: 10 },
  // Row 2
  { code: 'WA', row: 2, col: 0 },
  { code: 'ID', row: 2, col: 1 },
  { code: 'MT', row: 2, col: 2 },
  { code: 'ND', row: 2, col: 3 },
  { code: 'MN', row: 2, col: 4 },
  { code: 'IL', row: 2, col: 5 },
  { code: 'WI', row: 2, col: 6 },
  { code: 'MI', row: 2, col: 7 },
  { code: 'NY', row: 2, col: 8 },
  { code: 'MA', row: 2, col: 9 },
  { code: 'RI', row: 2, col: 10 },
  // Row 3
  { code: 'OR', row: 3, col: 0 },
  { code: 'NV', row: 3, col: 1 },
  { code: 'WY', row: 3, col: 2 },
  { code: 'SD', row: 3, col: 3 },
  { code: 'IA', row: 3, col: 4 },
  { code: 'IN', row: 3, col: 5 },
  { code: 'OH', row: 3, col: 6 },
  { code: 'PA', row: 3, col: 7 },
  { code: 'NJ', row: 3, col: 8 },
  { code: 'CT', row: 3, col: 9 },
  // Row 4
  { code: 'CA', row: 4, col: 0 },
  { code: 'UT', row: 4, col: 1 },
  { code: 'CO', row: 4, col: 2 },
  { code: 'NE', row: 4, col: 3 },
  { code: 'MO', row: 4, col: 4 },
  { code: 'KY', row: 4, col: 5 },
  { code: 'WV', row: 4, col: 6 },
  { code: 'VA', row: 4, col: 7 },
  { code: 'MD', row: 4, col: 8 },
  { code: 'DE', row: 4, col: 9 },
  // Row 5
  { code: 'AZ', row: 5, col: 1 },
  { code: 'NM', row: 5, col: 2 },
  { code: 'KS', row: 5, col: 3 },
  { code: 'AR', row: 5, col: 4 },
  { code: 'TN', row: 5, col: 5 },
  { code: 'NC', row: 5, col: 6 },
  { code: 'SC', row: 5, col: 7 },
  { code: 'DC', row: 5, col: 8 },
  // Row 6
  { code: 'OK', row: 6, col: 3 },
  { code: 'LA', row: 6, col: 4 },
  { code: 'MS', row: 6, col: 5 },
  { code: 'AL', row: 6, col: 6 },
  { code: 'GA', row: 6, col: 7 },
  // Row 7
  { code: 'HI', row: 7, col: 0 },
  { code: 'TX', row: 7, col: 3 },
  { code: 'FL', row: 7, col: 8 },
];

type GeoMetric = 'restOfEconomyChange' | 'totalChange' | 'healthcareChange' | 'healthcareSharePercent';
type SortField = 'stateName' | 'totalBaselineEmployment' | 'totalChange' | 'healthcareChange' | 'restOfEconomyChange' | 'healthcareSharePercent';

export const GeographicExplorer: React.FC = () => {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('CA');
  const [activeMetric, setActiveMetric] = useState<GeoMetric>('restOfEconomyChange');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'broad_growth' | 'health_masked' | 'industrial_drag'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('restOfEconomyChange');
  const [sortAsc, setSortAsc] = useState(false);

  // Selected State
  const selectedState = useMemo(() => {
    return STATES_DATA.find((s) => s.stateCode === selectedStateCode) || STATES_DATA[0];
  }, [selectedStateCode]);

  // Filtered & Sorted states for table
  const displayedStates = useMemo(() => {
    return STATES_DATA.filter((s) => {
      const matchesSearch =
        s.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.stateCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || s.growthCategory === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [searchQuery, categoryFilter, sortField, sortAsc]);

  // Color mapper for Cartogram tiles based on activeMetric
  const getTileColor = (state: StateEmploymentData) => {
    if (activeMetric === 'restOfEconomyChange') {
      const val = state.restOfEconomyChange;
      if (val >= 50) return '#059669'; // deep emerald
      if (val >= 20) return '#10B981'; // emerald
      if (val >= 0) return '#6EE7B7'; // light green
      if (val >= -15) return '#FCA5A5'; // light red
      if (val >= -40) return '#EF4444'; // red
      return '#B91C1C'; // deep red (-153K CA, -113K NY)
    } else if (activeMetric === 'totalChange') {
      const val = state.totalChange;
      if (val >= 80) return '#1D4ED8';
      if (val >= 30) return '#3B82F6';
      if (val >= 0) return '#93C5FD';
      return '#EF4444';
    } else if (activeMetric === 'healthcareChange') {
      const val = state.healthcareChange;
      if (val >= 60) return '#1E40AF';
      if (val >= 25) return '#3B82F6';
      if (val >= 10) return '#60A5FA';
      return '#BFDBFE';
    } else {
      // Healthcare share percent
      const val = state.healthcareSharePercent;
      if (val > 150) return '#7C3AED'; // purple (masked)
      if (val >= 70) return '#8B5CF6';
      if (val >= 40) return '#A78BFA';
      return '#C4B5FD';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Geographic Pivot</span>
              <span>·</span>
              <span>50 States + DC Current Employment Statistics</span>
              <span>·</span>
              <span>Regional Division</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              The 50-State Labor Divide
            </h2>
            <p className="text-sm text-neutral-600 mt-0.5">
              How the -222K non-health deficit and +998K healthcare surge manifest across state economies
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-neutral-100 p-1 rounded-md">
            <button
              onClick={() => setActiveMetric('restOfEconomyChange')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeMetric === 'restOfEconomyChange'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Rest of Economy (K)
            </button>
            <button
              onClick={() => setActiveMetric('totalChange')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeMetric === 'totalChange'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Total Nonfarm (K)
            </button>
            <button
              onClick={() => setActiveMetric('healthcareChange')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeMetric === 'healthcareChange'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Health Care (K)
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 mr-1">Filter Archetype:</span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              categoryFilter === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All 51 Jurisdictions
          </button>
          <button
            onClick={() => setCategoryFilter('broad_growth')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              categoryFilter === 'broad_growth'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Broad Growth (23 States: TX, FL, NC, GA...)
          </button>
          <button
            onClick={() => setCategoryFilter('health_masked')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              categoryFilter === 'health_masked'
                ? 'bg-purple-700 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Health-Masked Contraction (7 States: CA, NY, PA...)
          </button>
          <button
            onClick={() => setCategoryFilter('industrial_drag')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              categoryFilter === 'industrial_drag'
                ? 'bg-red-700 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Industrial / Rust Belt Drag (21 States: OH, MI, IN...)
          </button>
        </div>

        {/* Map & State Inspector 2-Column Section */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive US Hex/Grid Cartogram */}
          <div className="lg:col-span-7 bg-neutral-50/50 rounded-lg p-3 sm:p-4 border border-neutral-200">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
              <span>Click any state tile to inspect complete economic breakdown:</span>
              <span className="font-mono">Selected: {selectedState.stateName}</span>
            </div>

            <div className="grid grid-cols-11 gap-1.5 sm:gap-2 max-w-full">
              {Array.from({ length: 8 }).map((_, rIdx) => (
                <React.Fragment key={rIdx}>
                  {Array.from({ length: 11 }).map((_, cIdx) => {
                    const pos = STATE_GRID_LAYOUT.find((p) => p.row === rIdx && p.col === cIdx);
                    if (!pos) {
                      return <div key={`${rIdx}-${cIdx}`} className="aspect-square opacity-0 pointer-events-none" />;
                    }

                    const state = STATES_DATA.find((s) => s.stateCode === pos.code);
                    if (!state) return <div key={`${rIdx}-${cIdx}`} />;

                    const isSelected = selectedState.stateCode === state.stateCode;
                    const tileBg = getTileColor(state);
                    const metricVal =
                      activeMetric === 'restOfEconomyChange'
                        ? state.restOfEconomyChange
                        : activeMetric === 'totalChange'
                        ? state.totalChange
                        : state.healthcareChange;

                    return (
                      <button
                        key={state.stateCode}
                        onClick={() => setSelectedStateCode(state.stateCode)}
                        style={{ backgroundColor: tileBg }}
                        className={`aspect-square rounded-md p-1 flex flex-col items-center justify-center text-white transition-all transform ${
                          isSelected
                            ? 'ring-2 ring-neutral-900 ring-offset-2 scale-105 shadow-md z-10'
                            : 'hover:scale-105 hover:shadow-sm'
                        }`}
                        title={`${state.stateName}: ${activeMetric} = ${metricVal}K`}
                      >
                        <span className="text-[10px] sm:text-xs font-bold leading-tight drop-shadow-sm">
                          {state.stateCode}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-mono leading-tight opacity-90 drop-shadow-sm">
                          {metricVal > 0 ? `+${metricVal}` : metricVal}
                        </span>
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Map Legend */}
            <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-600"></span>
                <span>Steep Non-Health Contraction (&lt;-40K)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-300"></span>
                <span>Mild Non-Health Loss (-1K to -15K)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-300"></span>
                <span>Mild Growth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600"></span>
                <span>Booming (&gt;+50K TX/FL)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed State Inspector Card */}
          <div className="lg:col-span-5 bg-white rounded-lg p-5 border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  State Profile
                </span>
                <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2 mt-0.5">
                  <span>{selectedState.stateName}</span>
                  <span className="text-xs font-mono px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">
                    {selectedState.stateCode}
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    selectedState.growthCategory === 'broad_growth'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedState.growthCategory === 'health_masked'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedState.growthCategory === 'broad_growth'
                    ? 'Broad Expansion'
                    : selectedState.growthCategory === 'health_masked'
                    ? 'Health Masked'
                    : 'Industrial Drag'}
                </span>
              </div>
            </div>

            {/* Key State Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-neutral-50 border border-neutral-100">
                <div className="text-[11px] text-neutral-500">Rest of Economy Change</div>
                <div
                  className={`text-lg font-bold font-mono ${
                    selectedState.restOfEconomyChange >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedState.restOfEconomyChange > 0
                    ? `+${selectedState.restOfEconomyChange}K`
                    : `${selectedState.restOfEconomyChange}K`}
                </div>
              </div>

              <div className="p-3 rounded bg-neutral-50 border border-neutral-100">
                <div className="text-[11px] text-neutral-500">Health Care Change</div>
                <div className="text-lg font-bold font-mono text-blue-600">
                  +{selectedState.healthcareChange}K
                </div>
              </div>

              <div className="p-3 rounded bg-neutral-50 border border-neutral-100">
                <div className="text-[11px] text-neutral-500">Net Total Payroll Change</div>
                <div
                  className={`text-lg font-bold font-mono ${
                    selectedState.totalChange >= 0 ? 'text-neutral-900' : 'text-red-700'
                  }`}
                >
                  {selectedState.totalChange > 0
                    ? `+${selectedState.totalChange}K`
                    : `${selectedState.totalChange}K`}
                </div>
              </div>

              <div className="p-3 rounded bg-neutral-50 border border-neutral-100">
                <div className="text-[11px] text-neutral-500">Baseline Total Workforce</div>
                <div className="text-lg font-bold font-mono text-neutral-700">
                  {(selectedState.totalBaselineEmployment / 1000).toFixed(1)}M
                </div>
              </div>
            </div>

            {/* Drivers */}
            <div className="space-y-2 pt-2">
              <div className="text-xs">
                <span className="text-neutral-500 block">Leading Growth Engine:</span>
                <span className="font-semibold text-emerald-700">
                  {selectedState.dominantLeadingSector}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-neutral-500 block">Principal Contracting Drag:</span>
                <span className="font-semibold text-red-700">
                  {selectedState.dominantLaggingSector}
                </span>
              </div>
            </div>

            {/* Narrative summary */}
            <div className="p-3 bg-neutral-50 rounded text-xs text-neutral-700 leading-relaxed border border-neutral-100">
              {selectedState.narrativeSummary}
            </div>
          </div>
        </div>
      </div>

      {/* 50-State Sortable Rankings Table */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Complete State-by-State Data Table
            </h3>
            <p className="text-xs text-neutral-500">
              Click column headers to sort by any dimension
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search state name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-700 border-b border-neutral-200">
              <tr>
                <th
                  onClick={() => handleSort('stateName')}
                  className="py-2.5 px-3 font-semibold cursor-pointer hover:bg-neutral-100"
                >
                  <div className="flex items-center gap-1">
                    <span>State</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalBaselineEmployment')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:bg-neutral-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Baseline (K)</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('restOfEconomyChange')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:bg-neutral-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Rest of Economy</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('healthcareChange')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:bg-neutral-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Health Care</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalChange')}
                  className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:bg-neutral-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Net Nonfarm</span>
                    <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 font-semibold">Archetype Classification</th>
                <th className="py-2.5 px-3 font-semibold">Key Headwind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayedStates.map((st) => (
                <tr
                  key={st.stateCode}
                  onClick={() => setSelectedStateCode(st.stateCode)}
                  className={`cursor-pointer transition-colors ${
                    selectedState.stateCode === st.stateCode
                      ? 'bg-blue-50/70 font-medium'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <td className="py-2 px-3 text-neutral-900 font-medium">
                    {st.stateName}{' '}
                    <span className="font-mono text-neutral-400">({st.stateCode})</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-neutral-600">
                    {st.totalBaselineEmployment.toLocaleString()}
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono font-bold ${
                      st.restOfEconomyChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {st.restOfEconomyChange > 0
                      ? `+${st.restOfEconomyChange}K`
                      : `${st.restOfEconomyChange}K`}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-600">
                    +{st.healthcareChange}K
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono font-bold ${
                      st.totalChange >= 0 ? 'text-neutral-900' : 'text-red-700'
                    }`}
                  >
                    {st.totalChange > 0 ? `+${st.totalChange}K` : `${st.totalChange}K`}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        st.growthCategory === 'broad_growth'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.growthCategory === 'health_masked'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {st.growthCategory === 'broad_growth'
                        ? 'Broad Growth'
                        : st.growthCategory === 'health_masked'
                        ? 'Health Masked'
                        : 'Industrial Drag'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-neutral-600 truncate max-w-[200px]">
                    {st.dominantLaggingSector}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
