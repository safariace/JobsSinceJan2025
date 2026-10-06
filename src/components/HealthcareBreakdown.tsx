import React from 'react';
import { Users, Activity, HeartHandshake, Building2 } from 'lucide-react';

export const HealthcareBreakdown: React.FC = () => {
  const pillars = [
    {
      title: "Ambulatory Health Care Services",
      blsCode: "CES6562100001",
      jobs: "+540,000",
      share: "54.1%",
      icon: Activity,
      color: "blue",
      subItems: [
        { name: "Offices of Physicians & Specialists", change: "+195K" },
        { name: "Home Health Care Services", change: "+180K" },
        { name: "Outpatient Care Centers & Clinics", change: "+115K" },
        { name: "Medical & Diagnostic Laboratories", change: "+50K" },
      ],
      description:
        "The largest driver in the entire economy. A structural shift toward outpatient clinics, same-day surgical centers, and in-home geriatric nursing assistants.",
    },
    {
      title: "Hospitals (Inpatient Care)",
      blsCode: "CES6562200001",
      jobs: "+245,000",
      share: "24.5%",
      icon: Building2,
      color: "indigo",
      subItems: [
        { name: "General Medical & Surgical Hospitals", change: "+210K" },
        { name: "Psychiatric & Substance Abuse Hospitals", change: "+25K" },
        { name: "Specialty Hospitals", change: "+10K" },
      ],
      description:
        "Delayed recovery from the 2020-2022 staffing crisis. Hospitals aggressively recruited registered nurses to eliminate costly traveling agency contracts.",
    },
    {
      title: "Nursing & Residential Care Facilities",
      blsCode: "CES6562300001",
      jobs: "+125,000",
      share: "12.5%",
      icon: Users,
      color: "emerald",
      subItems: [
        { name: "Assisted Living Facilities for the Elderly", change: "+75K" },
        { name: "Skilled Nursing Care Facilities", change: "+35K" },
        { name: "Residential Mental Health & Disability Care", change: "+15K" },
      ],
      description:
        "The fastest recovering segment as facilities restored capacity to accommodate the rapidly rising median age of the US population.",
    },
    {
      title: "Social Assistance",
      blsCode: "CES6562400001",
      jobs: "+88,000",
      share: "8.8%",
      icon: HeartHandshake,
      color: "amber",
      subItems: [
        { name: "Individual & Family Services (Disability/Elder)", change: "+52K" },
        { name: "Child Day Care Services", change: "+28K" },
        { name: "Community Food & Emergency Relief", change: "+8K" },
      ],
      description:
        "Child care and elder community programs regaining staffing to meet working parent demand.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Deep Dive</span>
              <span>·</span>
              <span>Series CES6562000001</span>
              <span>·</span>
              <span>Total +998,000 Jobs</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Why Health Care Boomed: Demographics vs. Business Cycles
            </h2>
            <p className="text-sm text-neutral-600 mt-0.5">
              Deconstructing the 4 pillars of medical employment and why health care is decoupled from Federal Reserve interest rates
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
              +998K
            </span>
            <div className="text-xs text-neutral-500">Jan 2025 – Sep 2026</div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-4 rounded-lg border border-neutral-200 bg-neutral-50/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-blue-100 text-blue-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        {pillar.title}
                      </h3>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {pillar.blsCode}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-blue-600">
                      {pillar.jobs}
                    </div>
                    <div className="text-[10px] text-neutral-500">{pillar.share}</div>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Sub-item breakdowns */}
                <div className="pt-2 border-t border-neutral-200 grid grid-cols-2 gap-2 text-xs">
                  {pillar.subItems.map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-1.5 rounded bg-white border border-neutral-100"
                    >
                      <span className="text-neutral-700 truncate pr-1">{sub.name}</span>
                      <span className="font-mono font-bold text-blue-700 shrink-0">
                        {sub.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structural Economics Drivers */}
      <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
        <h3 className="text-base font-bold text-neutral-900">
          The 3 Fundamental Reasons Health Care Grew While Others Contracted
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="text-xs font-semibold text-neutral-800">
              The "Silver Tsunami"
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every day, roughly <strong>10,000 Americans turn 65</strong>. Individuals aged 65 and older consume approximately three to four times more healthcare services per capita than younger cohorts. This demographic demand curve does not pause during rate hikes or manufacturing downturns.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="text-xs font-semibold text-neutral-800">
              Government-Insulated Cash Flows
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Over <strong>55% of all healthcare spending</strong> is financed directly through Medicare, Medicaid, and federal veterans programs. Unlike commercial construction, venture-funded software, or auto manufacturing, hospital balance sheets are heavily decoupled from private bank lending rates.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="text-xs font-semibold text-neutral-800">
              Multiple-Job Holding in the CES Survey
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              The BLS CES Establishment Survey counts <em>payroll jobs</em>, not individual workers. In home health care and ambulatory support, caregivers and nurses frequently hold <strong>multiple part-time positions</strong> across distinct agencies, generating multiple entries on BLS payroll rolls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
