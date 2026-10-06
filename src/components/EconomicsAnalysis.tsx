import React from 'react';
import { BookOpen, FileText, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const EconomicsAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
          <span>Labor Economics Whitepaper</span>
          <span>·</span>
          <span>Methodology & Statistical Critique</span>
          <span>·</span>
          <span>Bureau of Labor Statistics</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Deconstructing the Narrative: What Aggregate Payroll Charts Obscure
        </h2>
        <p className="text-sm text-neutral-600 mt-0.5">
          An economic evaluation of the "Health Care vs. Rest of Economy" dichotomy and five structural realities behind the data
        </p>
      </div>

      {/* 5 Analytical Sections */}
      <div className="space-y-4">
        {/* Section 1 */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-neutral-900">
              The Base Scale Asymmetry: 14% vs. 86% of the American Workforce
            </h3>
          </div>
          <div className="text-xs text-neutral-700 leading-relaxed space-y-2">
            <p>
              When a visualization charts two lines with equal stroke weight against a single vertical axis, human visual cognition instinctively assumes they represent two roughly equal, competing halves of the economy. In reality:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>
                <strong>Health Care & Social Assistance (CES6562000001)</strong> employs approximately <strong>21.8 million individuals</strong>, representing roughly 14% of the total US nonfarm labor force.
              </li>
              <li>
                <strong>The "Rest of the Economy"</strong> represents over <strong>136.7 million workers</strong> across 13 supersectors: Manufacturing, Construction, Retail, Tech, Finance, Transportation, Hospitality, and Government.
              </li>
            </ul>
            <p>
              A 0.16% contraction across 136.7 million workers generates an absolute decline of 222,000 jobs. Conversely, a 4.5% structural expansion in health care generates nearly 1,000,000 jobs. Presenting these on identical scales creates an optical distortion where a standard, sector-specific cyclical cooling appears as an economy-wide collapse.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-bold text-neutral-900">
              The Aggregation Illusion: Masking +670,000 in Non-Health Job Gains
            </h3>
          </div>
          <div className="text-xs text-neutral-700 leading-relaxed space-y-2">
            <p>
              The label "Rest of the Economy" implies that all other industries were shrinking. In reality, the non-healthcare economy was split into two sharply conflicting halves:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-emerald-50/60 rounded border border-emerald-100">
                <div className="font-semibold text-emerald-800 mb-1">
                  Expanding Non-Health Engines (+670,000 Jobs)
                </div>
                <ul className="space-y-1 text-neutral-600">
                  <li>• <strong>Government (+345K):</strong> State & local education hiring</li>
                  <li>• <strong>Construction (+145K):</strong> IIJA and CHIPS Act factory builds</li>
                  <li>• <strong>Leisure & Hospitality (+95K):</strong> Resilient experiential spending</li>
                  <li>• <strong>Other Services & Education (+75K):</strong> Steady community demand</li>
                  <li>• <strong>Financial Activities (+10K):</strong> Insurance expansion</li>
                </ul>
              </div>
              <div className="p-3 bg-red-50/60 rounded border border-red-100">
                <div className="font-semibold text-red-800 mb-1">
                  Contracting Drag Sectors (-892,000 Jobs)
                </div>
                <ul className="space-y-1 text-neutral-600">
                  <li>• <strong>Professional & Business (-365K):</strong> Temp agency cuts (-240K)</li>
                  <li>• <strong>Manufacturing (-185K):</strong> High interest rates on durable goods</li>
                  <li>• <strong>Retail Trade (-140K):</strong> Store automation & footprint trimming</li>
                  <li>• <strong>Information / Tech (-95K):</strong> Software margin optimization</li>
                  <li>• <strong>Logistics & Freight (-95K):</strong> Post-COVID warehouse rightsizing</li>
                </ul>
              </div>
            </div>
            <p>
              Netting these two massive numbers (+670K and -892K) into -222K conceals the extraordinary resilience of public education, municipal infrastructure, and industrial construction.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-bold text-neutral-900">
              The "Temporary Help" Shock Absorber (-240,000 Jobs)
            </h3>
          </div>
          <div className="text-xs text-neutral-700 leading-relaxed space-y-2">
            <p>
              Within the -365,000 drop in Professional & Business Services, a single sub-industry accounted for nearly two-thirds of the total loss: <strong>Temporary Help Services (BLS code CES6056132001) plunged by 240,000 jobs</strong>.
            </p>
            <p>
              Labor economists treat temporary help as an <em>asymmetric shock absorber</em>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>
                During macroeconomic uncertainty, corporations cancel staffing contracts rather than conducting high-cost layoffs of their core full-time talent.
              </li>
              <li>
                Consequently, temp staffing often falls sharply during mere inventory adjustments without translating into broad-based permanent unemployment.
              </li>
              <li>
                <strong>The Counterfactual Truth:</strong> Exclude temporary agency workers, and the entire remainder of the non-health economy was actually <strong>net positive (+18,000 jobs)</strong>.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h3 className="text-base font-bold text-neutral-900">
              Demographic Inevitability vs. Cyclical Monetary Policy
            </h3>
          </div>
          <div className="text-xs text-neutral-700 leading-relaxed space-y-2">
            <p>
              The Federal Reserve manipulates the federal funds rate specifically to slow credit-sensitive sectors: residential mortgages, business capital expenditure, automotive loans, and corporate debt issuance. This mechanism worked as intended on Manufacturing (-185K) and Tech (-95K).
            </p>
            <p>
              However, healthcare demand is structurally non-cyclical:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>
                10,000 Baby Boomers reach age 65 every day. Healthcare visits, orthopedic procedures, and assisted living care cannot be postponed due to 5% interest rates.
              </li>
              <li>
                The majority of healthcare revenue is reimbursed via federal entitlement programs (Medicare & Medicaid), making healthcare payrolls almost completely impervious to central bank tightening.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center">
              5
            </span>
            <h3 className="text-base font-bold text-neutral-900">
              Survey Methodology: Establishment (CES) vs. Household (CPS) & Multiple Jobholders
            </h3>
          </div>
          <div className="text-xs text-neutral-700 leading-relaxed space-y-2">
            <p>
              The headline chart relies on the <strong>Current Employment Statistics (CES)</strong> Establishment Survey, which surveys businesses to count filled payroll positions. It is crucial to distinguish this from the <strong>Current Population Survey (CPS)</strong>, which surveys households to count employed persons.
            </p>
            <p>
              In healthcare—specifically ambulatory home care and private nursing—part-time workers commonly maintain positions across multiple care agencies. In the CES, one worker holding three 15-hour agency jobs is counted as <strong>three distinct jobs</strong>. This dynamic amplifies the perceived surge in healthcare payrolls relative to the actual number of unique individuals employed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
