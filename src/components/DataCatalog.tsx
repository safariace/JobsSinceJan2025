import React, { useState } from 'react';
import { RAW_SERIES_CATALOG, MONTHLY_SERIES, STATES_DATA } from '../data/blsData';
import { Search, Download, FileCode, Check } from 'lucide-react';

interface DataCatalogProps {
  onExportCsv: () => void;
}

export const DataCatalog: React.FC<DataCatalogProps> = ({ onExportCsv }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredCatalog = RAW_SERIES_CATALOG.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supersector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJson = () => {
    const fullDataset = {
      monthlyTimeSeries: MONTHLY_SERIES,
      seriesCatalog: RAW_SERIES_CATALOG,
      stateData: STATES_DATA,
    };
    const blob = new Blob([JSON.stringify(fullDataset, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bls_employment_dataset_2025_2026.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySeries = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Data Catalog & Export</span>
              <span>·</span>
              <span>BLS CES Public Series</span>
              <span>·</span>
              <span>21 Monthly Observations</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              BLS Data Catalog & Downloads
            </h2>
            <p className="text-sm text-neutral-600 mt-0.5">
              Access official BLS Current Employment Statistics identifiers and export raw data
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search series code or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <span className="text-xs text-neutral-500 self-start sm:self-auto">
            Showing {filteredCatalog.length} of {RAW_SERIES_CATALOG.length} series
          </span>
        </div>

        {/* Series Table */}
        <div className="mt-4 overflow-x-auto border border-neutral-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-700 border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">BLS Series ID</th>
                <th className="py-2.5 px-3 font-semibold">Series Title / Industry</th>
                <th className="py-2.5 px-3 font-semibold">Supersector</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Level (M)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Cumulative Change</th>
                <th className="py-2.5 px-3 font-semibold text-center">BLS Portal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCatalog.map((item) => (
                <tr key={item.code} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-2 px-3 font-mono font-medium text-blue-700">
                    <button
                      onClick={() => handleCopySeries(item.code)}
                      className="hover:underline flex items-center gap-1"
                      title="Click to copy series ID"
                    >
                      <span>{item.code}</span>
                    </button>
                  </td>
                  <td className="py-2 px-3 font-medium text-neutral-900">{item.name}</td>
                  <td className="py-2 px-3 text-neutral-600">{item.supersector}</td>
                  <td className="py-2 px-3 text-right font-mono text-neutral-700">
                    {item.levelMillions.toFixed(2)}M
                  </td>
                  <td
                    className={`py-2 px-3 text-right font-mono font-bold ${
                      item.changeThousand >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {item.changeThousand > 0 ? `+${item.changeThousand}K` : `${item.changeThousand}K`}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {item.code.startsWith('CES') ? (
                      <a
                        href={`https://data.bls.gov/timeseries/${item.code}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-blue-600 hover:text-blue-800 text-[11px] underline"
                      >
                        data.bls.gov ↗
                      </a>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">Derived</span>
                    )}
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
