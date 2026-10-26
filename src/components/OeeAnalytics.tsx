import React from 'react';
import {
  TrendingUp,
  Clock,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Users,
  ShieldAlert,
  ArrowUpRight,
  Zap,
  Info
} from 'lucide-react';
import type { OeeMetrics, LoomDef } from '../types/textile';

interface OeeAnalyticsProps {
  metrics: OeeMetrics;
  looms: LoomDef[];
}

export const OeeAnalytics: React.FC<OeeAnalyticsProps> = ({
  metrics,
  looms
}) => {
  // Weaver performance ranking
  const weavers = [
    { name: 'David K. (Weaver #14)', shed: 'Shed A · Air Jet', looms: 'L-101, L-102', avgEfficiency: 94.6, meters: 3310, stops: 8 },
    { name: 'Tariq Mansour (Weaver #04)', shed: 'Shed B · Rapier', looms: 'L-107, L-108', avgEfficiency: 93.5, meters: 8450, stops: 6 },
    { name: 'Chen Wei (Weaver #17)', shed: 'Shed B · Rapier', looms: 'L-109, L-110', avgEfficiency: 86.4, meters: 4610, stops: 11 },
    { name: 'Marco Silva (Weaver #22)', shed: 'Shed A · Air Jet', looms: 'L-105, L-106', avgEfficiency: 86.8, meters: 6180, stops: 18 },
    { name: 'Elena Rostova (Weaver #09)', shed: 'Shed A · Air Jet', looms: 'L-103, L-104', avgEfficiency: 84.6, meters: 3000, stops: 22 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          OEE Telemetry & Production Delay Diagnostics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Overall Equipment Effectiveness (Availability × Performance × Quality) and root-cause downtime Pareto analysis.
        </p>
      </div>

      {/* OEE Tri-Factor Hero Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-emerald-400">PLANT WEAVING BENCHMARK</div>
            <div className="text-3xl font-extrabold font-mono text-white mt-1 tabular-nums">
              {metrics.overallOee}% <span className="text-lg font-normal text-slate-400 font-sans">Overall OEE</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Target World-Class Standard: &gt; 85.0% · Current Shift: Nominal
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <div className="text-slate-400">Total Picks Today</div>
              <div className="text-base font-bold text-white tabular-nums">4,852,000</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400">Operating Hours</div>
              <div className="text-base font-bold text-white tabular-nums">174.6 / 192 hrs</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400">Total Meters</div>
              <div className="text-base font-bold text-emerald-400 tabular-nums">
                {metrics.totalMetersProduced.toLocaleString()} m
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of OEE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Availability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Availability</span>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                {metrics.availability}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.availability)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Operating Time vs Planned Time. Downtime caused by warp breaks & knotting.
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Performance (Speed)</span>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                {metrics.performance}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.performance)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Actual RPM ({metrics.actualAverageRpm}) vs Ideal Rated Speed ({metrics.idealRunRateRpm} RPM).
            </div>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Quality (ASTM Yield)</span>
              <span className="font-mono font-bold text-white text-sm tabular-nums">
                {metrics.quality}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.quality)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              Grade A First-Quality fabric output passed under ASTM D5430.
            </div>
          </div>
        </div>
      </div>

      {/* Downtime Pareto Analysis & Delay Elimination Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downtime Cause Pareto Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-900">
                Stoppage Causes Pareto Breakdown
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Total: 343 mins lost today
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {metrics.stopCausesPareto.map((item) => (
              <div key={item.reason} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate pr-2">
                    {item.reason}
                  </span>
                  <span className="font-mono text-slate-600 shrink-0 tabular-nums">
                    {item.downtimeMinutes} min ({item.percentage}%) · {item.count} stops
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      item.percentage > 30 ? 'bg-rose-500' :
                      item.percentage > 20 ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Key Finding:</span> Warp yarn breaks account for 41.5% of all loom downtime. Sizing pick-up on Yarn Lot #EG-2026-118 is identified as the root cause.
          </div>
        </div>

        {/* Operational Delay Prevention Action Items */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Delay Mitigation Action Directives
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              3 Directives Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">1. Adjust Sizing Add-on on 50s Giza Warp</span>
                <span className="font-mono text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">HIGH IMPACT</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Increase size penetration by 1.2% in sizing box to reduce chafing at heald wires on L-103. Expected downtime reduction: ~50 mins/shift.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">2. Accelerate ORD-2026-883 with Secondary Loom</span>
                <span className="font-mono text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">DELIVERY RISK</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Assign Loom L-104 to take over 1,500m of the Sovereign Shirting order to protect the Nov 4 customer delivery deadline.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">3. Reorder 50s Giza Cotton Cones</span>
                <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">PROCUREMENT</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Inventory at 1,450 kg is beneath the 1,800 kg safety buffer. Trigger replenishment purchase order with Nile Delta Spinners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weaver Efficiency Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900">
              Shift A Weaver Performance & Loom Load
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Supervisor: Chief Weaver J. Vance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Weaver Name</th>
                <th className="py-2.5 px-4 font-semibold">Weaving Shed</th>
                <th className="py-2.5 px-4 font-semibold">Assigned Looms</th>
                <th className="py-2.5 px-4 font-semibold text-right">Avg Efficiency</th>
                <th className="py-2.5 px-4 font-semibold text-right">Shift Meters</th>
                <th className="py-2.5 px-4 font-semibold text-right">Stops Attended</th>
                <th className="py-2.5 px-4 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weavers.map((w) => (
                <tr key={w.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {w.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {w.shed}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">
                    {w.looms}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-right tabular-nums">
                    <span className={w.avgEfficiency >= 90 ? 'text-emerald-600' : 'text-slate-800'}>
                      {w.avgEfficiency}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-right tabular-nums text-slate-800">
                    {w.meters.toLocaleString()} m
                  </td>
                  <td className="py-3 px-4 font-mono text-right tabular-nums text-slate-600">
                    {w.stops}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      w.avgEfficiency >= 92 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {w.avgEfficiency >= 92 ? 'Top Tier' : 'Standard'}
                    </span>
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
