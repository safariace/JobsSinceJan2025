/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeadlineChart } from './components/HeadlineChart';
import { SectorWaterfall } from './components/SectorWaterfall';
import { CounterfactualPivot } from './components/CounterfactualPivot';
import { HealthcareBreakdown } from './components/HealthcareBreakdown';
import { GeographicExplorer } from './components/GeographicExplorer';
import { EconomicsAnalysis } from './components/EconomicsAnalysis';
import { DataCatalog } from './components/DataCatalog';
import { MONTHLY_SERIES, SECTOR_BREAKDOWN, STATES_DATA } from './data/blsData';
import { Info, Sparkles, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('headline');
  const [dismissNotice, setDismissNotice] = useState(false);

  // Global CSV Export Handler
  const handleExportCsv = () => {
    // Generate tidy CSV
    const rows: string[] = [];
    rows.push('# BLS Current Employment Statistics (CES) Analysis: Jan 2025 - Sep 2026');
    rows.push('# Generated from BLS Series CES6562000001 & PAYEMS');
    rows.push('');

    // Section 1: Monthly Time Series
    rows.push('--- MONTHLY TIME SERIES ---');
    rows.push('Month,Healthcare_Cumulative_K,RestOfEconomy_Cumulative_K,NetTotalNonfarm_Cumulative_K,ExTempStaffing_Cumulative_K,Healthcare_MoM_K,RestOfEconomy_MoM_K,NetTotal_MoM_K,Healthcare_Level_M,RestOfEconomy_Level_M,Total_Level_M');
    MONTHLY_SERIES.forEach((m) => {
      rows.push(
        [
          m.month,
          m.healthcareCumulative,
          m.restOfEconomyCumulative,
          m.totalNonfarmCumulative,
          m.restExcludingTempHelpCumulative,
          m.healthcareMoM,
          m.restOfEconomyMoM,
          m.totalNonfarmMoM,
          m.healthcareLevel,
          m.restOfEconomyLevel,
          m.totalNonfarmLevel,
        ].join(',')
      );
    });

    rows.push('');
    rows.push('--- 50 STATES AND DC EMPLOYMENT ---');
    rows.push('StateCode,StateName,Baseline_K,RestOfEconomyChange_K,HealthcareChange_K,TotalChange_K,HealthcareShare_Percent,Category,LaggingSector,LeadingSector');
    STATES_DATA.forEach((s) => {
      rows.push(
        [
          s.stateCode,
          `"${s.stateName}"`,
          s.totalBaselineEmployment,
          s.restOfEconomyChange,
          s.healthcareChange,
          s.totalChange,
          s.healthcareSharePercent,
          s.growthCategory,
          `"${s.dominantLaggingSector}"`,
          `"${s.dominantLeadingSector}"`,
        ].join(',')
      );
    });

    rows.push('');
    rows.push('--- SECTOR DECOMPOSITION ---');
    rows.push('SectorID,SectorName,BLSCode,CumulativeChange_K,Category,EconomicFactor');
    SECTOR_BREAKDOWN.forEach((sec) => {
      rows.push(
        [
          sec.id,
          `"${sec.name}"`,
          sec.blsCode,
          sec.cumulativeChange,
          sec.category,
          `"${sec.economicFactor}"`,
        ].join(',')
      );
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bls_labor_market_analysis_2025_2026.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col font-sans">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Context Guidance Notice */}
        {!dismissNotice && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-start justify-between gap-3 text-xs text-blue-900">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-950">
                  You are inside the live interactive application!
                </span>{' '}
                Use the navigation tabs above to switch between the original Steve Rattner chart recreation, the sector waterfall breakdown, the temporary staffing counterfactual, the 50-state geographic map, and the full BLS data catalog.
              </div>
            </div>
            <button
              onClick={() => setDismissNotice(true)}
              className="text-blue-500 hover:text-blue-800 p-0.5 rounded"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'headline' && (
          <HeadlineChart
            onPivotToSectors={() => setActiveTab('waterfall')}
            onPivotToGeography={() => setActiveTab('geography')}
          />
        )}

        {activeTab === 'waterfall' && (
          <SectorWaterfall
            onPivotToGeography={() => setActiveTab('geography')}
          />
        )}

        {activeTab === 'counterfactual' && <CounterfactualPivot />}

        {activeTab === 'healthcare' && <HealthcareBreakdown />}

        {activeTab === 'geography' && <GeographicExplorer />}

        {activeTab === 'economics' && <EconomicsAnalysis />}

        {activeTab === 'catalog' && (
          <DataCatalog onExportCsv={handleExportCsv} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">
              BLS Labor Market Explorer
            </span>
            <span>·</span>
            <span>Data source: U.S. Bureau of Labor Statistics</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('headline')}
              className="hover:text-neutral-800 transition-colors"
            >
              Headline Chart
            </button>
            <button
              onClick={() => setActiveTab('waterfall')}
              className="hover:text-neutral-800 transition-colors"
            >
              Sector Waterfall
            </button>
            <button
              onClick={() => setActiveTab('geography')}
              className="hover:text-neutral-800 transition-colors"
            >
              50 States
            </button>
            <button
              onClick={handleExportCsv}
              className="hover:text-neutral-800 transition-colors"
            >
              Download CSV
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
