import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Calculator,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Cpu,
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import type { WeavePlan, ProductionOrder, LoomDef } from '../types/textile';

interface ProductionPlanningProps {
  plans: WeavePlan[];
  orders: ProductionOrder[];
  looms: LoomDef[];
  onCreatePlan: (newPlan: Partial<WeavePlan>) => Promise<void>;
}

interface ConstructionPreset {
  name: string;
  category: string;
  warpCount: number;
  weftCount: number;
  epi: number;
  ppi: number;
  width: number;
  warpCrimp: number;
  weftCrimp: number;
  cost: number;
}

const FABRIC_RECIPES: ConstructionPreset[] = [
  {
    name: 'Fine Cotton Poplin',
    category: 'Shirting',
    warpCount: 40,
    weftCount: 40,
    epi: 132,
    ppi: 72,
    width: 63,
    warpCrimp: 7.5,
    weftCrimp: 6.0,
    cost: 4.85
  },
  {
    name: 'Royal Oxford Cloth',
    category: 'Luxury Apparel',
    warpCount: 50,
    weftCount: 50,
    epi: 144,
    ppi: 76,
    width: 58,
    warpCrimp: 8.5,
    weftCrimp: 6.8,
    cost: 7.90
  },
  {
    name: 'Executive Suiting Twill',
    category: 'PV Blends',
    warpCount: 30,
    weftCount: 30,
    epi: 68,
    ppi: 56,
    width: 58,
    warpCrimp: 9.4,
    weftCrimp: 7.8,
    cost: 3.40
  },
  {
    name: 'Supima Satin 4/1',
    category: 'Bedding',
    warpCount: 60,
    weftCount: 60,
    epi: 173,
    ppi: 120,
    width: 108,
    warpCrimp: 11.2,
    weftCrimp: 8.0,
    cost: 8.60
  },
  {
    name: 'Heavy Industrial Drill',
    category: 'Workwear',
    warpCount: 10,
    weftCount: 10,
    epi: 72,
    ppi: 42,
    width: 60,
    warpCrimp: 6.8,
    weftCrimp: 5.4,
    cost: 2.85
  },
  {
    name: 'Belgian Pure Flax Linen',
    category: 'Home & Table',
    warpCount: 25,
    weftCount: 25,
    epi: 52,
    ppi: 48,
    width: 62,
    warpCrimp: 6.0,
    weftCrimp: 5.0,
    cost: 11.20
  }
];

export const ProductionPlanning: React.FC<ProductionPlanningProps> = ({
  plans,
  orders,
  looms,
  onCreatePlan
}) => {
  // Yarn BOM Interactive Calculator State
  const [calcMeters, setCalcMeters] = useState<number>(5000);
  const [calcWarpCount, setCalcWarpCount] = useState<number>(40);
  const [calcWeftCount, setCalcWeftCount] = useState<number>(40);
  const [calcEpi, setCalcEpi] = useState<number>(132);
  const [calcPpi, setCalcPpi] = useState<number>(72);
  const [calcWidthInches, setCalcWidthInches] = useState<number>(63);
  const [calcWarpCrimp, setCalcWarpCrimp] = useState<number>(7.5);
  const [calcWeftCrimp, setCalcWeftCrimp] = useState<number>(6.0);
  const [calcYarnCostPerKg, setCalcYarnCostPerKg] = useState<number>(4.80);
  const [activeRecipeName, setActiveRecipeName] = useState<string>('Fine Cotton Poplin');

  // New Plan form state
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState<string>(orders[0]?.orderCode || '');
  const [selectedLoomCode, setSelectedLoomCode] = useState<string>(looms[0]?.code || '');
  const [planDailyOutput, setPlanDailyOutput] = useState<number>(700);
  const [beamLength, setBeamLength] = useState<number>(4500);

  // Apply construction preset
  const applyPreset = (recipe: ConstructionPreset) => {
    setActiveRecipeName(recipe.name);
    setCalcWarpCount(recipe.warpCount);
    setCalcWeftCount(recipe.weftCount);
    setCalcEpi(recipe.epi);
    setCalcPpi(recipe.ppi);
    setCalcWidthInches(recipe.width);
    setCalcWarpCrimp(recipe.warpCrimp);
    setCalcWeftCrimp(recipe.weftCrimp);
    setCalcYarnCostPerKg(recipe.cost);
  };

  // Calculate BOM results
  const totalEnds = Math.round(calcWidthInches * calcEpi);
  const reedSpaceInches = Math.round((calcWidthInches * (1 + calcWeftCrimp / 100)) * 10) / 10;

  const lengthYards = calcMeters * 1.09361;
  const warpLbs = (lengthYards * totalEnds * (1 + calcWarpCrimp / 100)) / (840 * calcWarpCount);
  const rawWarpKg = Math.round((warpLbs / 2.20462) * 10) / 10;
  const warpKgWithWaste = Math.round((rawWarpKg * 1.03) * 10) / 10; // 3% warping waste

  const weftLbs = (lengthYards * reedSpaceInches * calcPpi * (1 + calcWeftCrimp / 100)) / (840 * calcWeftCount);
  const rawWeftKg = Math.round((weftLbs / 2.20462) * 10) / 10;
  const weftKgWithWaste = Math.round((rawWeftKg * 1.04) * 10) / 10; // 4% weft waste

  const totalYarnKg = Math.round((warpKgWithWaste + weftKgWithWaste) * 10) / 10;
  const estimatedFabricGsm = Math.round(((totalYarnKg * 1000) / (calcMeters * (calcWidthInches * 0.0254))) * 10) / 10;
  const totalYarnCost = Math.round(totalYarnKg * calcYarnCostPerKg);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find(o => o.orderCode === selectedOrderCode) || orders[0];
    const loom = looms.find(l => l.code === selectedLoomCode) || looms[0];

    const newPlan: Partial<WeavePlan> = {
      orderId: order.id,
      orderCode: order.orderCode,
      fabricSpec: order.construction,
      assignedLoomId: loom.id,
      assignedLoomCode: loom.code,
      warpCountNe: `${calcWarpCount}s Ne`,
      weftCountNe: `${calcWeftCount}s Ne`,
      epi: calcEpi,
      ppi: calcPpi,
      totalEnds,
      reedSpaceInches,
      warpCrimpPercent: calcWarpCrimp,
      weftCrimpPercent: calcWeftCrimp,
      beamNumber: `BEAM-${Date.now().toString().slice(-4)}`,
      beamLengthMeters: Number(beamLength),
      plannedDailyOutputMeters: Number(planDailyOutput),
      startDate: new Date().toISOString().split('T')[0],
      estimatedEndDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
      status: 'active'
    };

    await onCreatePlan(newPlan);
    setShowPlanModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Production Planning & Weave Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Master Weaving Schedule, Loom Allocations, Warp Beam Management & Automated Textile BOM Engine.
          </p>
        </div>

        <button
          onClick={() => setShowPlanModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Weave Plan</span>
        </button>
      </div>

      {/* Loom Schedule Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-900">
              Active Weaving Schedules & Beam Status
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {plans.length} active allocation plans
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Plan Code</th>
                <th className="py-2.5 px-4 font-semibold">Order / Client</th>
                <th className="py-2.5 px-4 font-semibold">Loom</th>
                <th className="py-2.5 px-4 font-semibold">Fabric Construction</th>
                <th className="py-2.5 px-4 font-semibold text-right">EPI x PPI</th>
                <th className="py-2.5 px-4 font-semibold">Beam # & Length</th>
                <th className="py-2.5 px-4 font-semibold text-right">Target Daily</th>
                <th className="py-2.5 px-4 font-semibold">Schedule Period</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {plans.map((p) => {
                const assignedLoom = looms.find(l => l.code === p.assignedLoomCode);
                const order = orders.find(o => o.orderCode === p.orderCode);
                const beamRemaining = assignedLoom ? assignedLoom.beamLengthRemainingMeters : p.beamLengthMeters;
                const beamPct = Math.round((beamRemaining / p.beamLengthMeters) * 100);

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {p.planCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.orderCode}</div>
                      <div className="text-[11px] text-slate-500">{order?.customerName || 'Contract Client'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {p.assignedLoomCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={p.fabricSpec}>
                      {p.fabricSpec}
                    </td>
                    <td className="py-3 px-4 font-mono text-right tabular-nums text-slate-800">
                      {p.epi} x {p.ppi} ({p.totalEnds} ends)
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-800 text-[11px]">{p.beamNumber}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-16 bg-slate-100 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full ${beamPct < 25 ? 'bg-amber-500' : 'bg-slate-800'}`}
                            style={{ width: `${Math.min(100, beamPct)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                          {beamRemaining.toLocaleString()}m ({beamPct}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-right tabular-nums text-slate-900">
                      {p.plannedDailyOutputMeters} m/day
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {p.startDate} <span className="text-slate-400">→</span> {p.estimatedEndDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Textile Yarn BOM & Crimp Calculation Engine with Interactive Presets */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Textile Yarn BOM & Crimp Requirement Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard Cotton Count (Ne) formula accounting for warp/weft crimp and waste allowances.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">
            System: Cotton Ne Count Standard
          </span>
        </div>

        {/* Quick Recipe Preset Chips (Interactive UX) */}
        <div>
          <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Standard Fabric Construction Presets (Click to autofill):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {FABRIC_RECIPES.map((recipe) => {
              const isActive = activeRecipeName === recipe.name;
              return (
                <button
                  key={recipe.name}
                  onClick={() => applyPreset(recipe)}
                  className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-semibold truncate">{recipe.name}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {recipe.warpCount}s x {recipe.weftCount}s · {recipe.epi}x{recipe.ppi}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${isActive ? 'text-emerald-300' : 'text-emerald-700 font-medium'}`}>
                    ${recipe.cost}/kg
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Input Controls */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Meters
                </label>
                <input
                  type="number"
                  value={calcMeters}
                  onChange={(e) => setCalcMeters(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Finished Width (Inches)
                </label>
                <input
                  type="number"
                  value={calcWidthInches}
                  onChange={(e) => setCalcWidthInches(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Yarn Cost ($/kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcYarnCostPerKg}
                  onChange={(e) => setCalcYarnCostPerKg(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Warp Count (Ne)
                </label>
                <input
                  type="number"
                  value={calcWarpCount}
                  onChange={(e) => setCalcWarpCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Weft Count (Ne)
                </label>
                <input
                  type="number"
                  value={calcWeftCount}
                  onChange={(e) => setCalcWeftCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Warp Density (EPI)
                </label>
                <input
                  type="number"
                  value={calcEpi}
                  onChange={(e) => setCalcEpi(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Weft Density (PPI)
                </label>
                <input
                  type="number"
                  value={calcPpi}
                  onChange={(e) => setCalcPpi(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Warp Crimp (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcWarpCrimp}
                  onChange={(e) => setCalcWarpCrimp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Weft Crimp (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcWeftCrimp}
                  onChange={(e) => setCalcWeftCrimp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900">Total Warp Ends:</span> {totalEnds.toLocaleString()} ends
              </div>
              <div>
                <span className="font-semibold text-slate-900">Calculated Reed Space:</span> {reedSpaceInches}"
              </div>
              <div>
                <span className="font-semibold text-slate-900">Est. Fabric GSM:</span> {estimatedFabricGsm} g/m²
              </div>
            </div>
          </div>

          {/* BOM Output Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">BOM Output Summary</div>
              <div className="mt-2 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {totalYarnKg.toLocaleString()} kg
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Total Yarn Required for {calcMeters.toLocaleString()}m
              </div>

              <div className="mt-5 space-y-3 pt-4 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Warp Yarn (inc. 3% waste):</span>
                  <span className="font-bold text-white tabular-nums">{warpKgWithWaste.toLocaleString()} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Weft Yarn (inc. 4% waste):</span>
                  <span className="font-bold text-white tabular-nums">{weftKgWithWaste.toLocaleString()} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Standard Cones (~1.8kg/cone):</span>
                  <span className="text-white tabular-nums">{Math.ceil(totalYarnKg / 1.8).toLocaleString()} cones</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Est. Raw Yarn Cost:</span>
                  <span className="text-emerald-300 font-bold tabular-nums">${totalYarnCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Directly matches yarn inventory stock deduction rules.</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Create New Weave Plan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Allocate production order to a weaving loom and configure beam parameters.
            </p>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Production Order
                </label>
                <select
                  value={selectedOrderCode}
                  onChange={(e) => setSelectedOrderCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.orderCode}>
                      {o.orderCode} · {o.customerName} ({o.fabricName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Assign to Loom
                </label>
                <select
                  value={selectedLoomCode}
                  onChange={(e) => setSelectedLoomCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono font-medium"
                >
                  {looms.map(l => (
                    <option key={l.id} value={l.code}>
                      {l.code} ({l.name} · {l.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Beam Length (m)
                  </label>
                  <input
                    type="number"
                    value={beamLength}
                    onChange={(e) => setBeamLength(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Target Daily Output (m)
                  </label>
                  <input
                    type="number"
                    value={planDailyOutput}
                    onChange={(e) => setPlanDailyOutput(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Confirm Weave Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
