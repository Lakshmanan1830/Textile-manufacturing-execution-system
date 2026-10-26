import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Award,
  Eye,
  Plus,
  FileCheck,
  Search,
  Sparkles,
  Info,
  Sliders,
  Pin,
  X
} from 'lucide-react';
import type { InspectionRoll, DefectItem, FabricGrade } from '../types/textile';

interface QualityInspectionProps {
  inspections: InspectionRoll[];
  onOpenNewInspection: () => void;
  onViewCertificate: (roll: InspectionRoll) => void;
  onUpdateRollDefects?: (rollId: string, defects: DefectItem[]) => void;
  inspectionImage?: string;
}

export const QualityInspection: React.FC<QualityInspectionProps> = ({
  inspections,
  onOpenNewInspection,
  onViewCertificate,
  onUpdateRollDefects,
  inspectionImage = '/src/assets/images/fabric_inspection_station_1792989943210.jpg'
}) => {
  const [selectedRoll, setSelectedRoll] = useState<InspectionRoll | null>(inspections[0] || null);
  const [gradeFilter, setGradeFilter] = useState<'all' | 'Grade A' | 'Grade B' | 'Reject'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Pin-on-Cloth state
  const [pinningPosition, setPinningPosition] = useState<{ yard: number; xPct: number } | null>(null);
  const [pinDefectType, setPinDefectType] = useState<any>('Slub / Thick End');
  const [pinSeverity, setPinSeverity] = useState<1 | 2 | 3 | 4>(2);
  const [pinDescription, setPinDescription] = useState('Observed at illuminated light table');

  const filteredInspections = inspections.filter(roll => {
    if (gradeFilter !== 'all' && roll.grade !== gradeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRoll = roll.rollNumber.toLowerCase().includes(q);
      const matchOrder = roll.orderCode.toLowerCase().includes(q);
      const matchLoom = roll.loomCode.toLowerCase().includes(q);
      const matchInspector = roll.inspectorName.toLowerCase().includes(q);
      if (!matchRoll && !matchOrder && !matchLoom && !matchInspector) return false;
    }
    return true;
  });

  const getGradeBadge = (grade: FabricGrade) => {
    switch (grade) {
      case 'Grade A':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Grade A (First Quality)
          </span>
        );
      case 'Grade B':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Grade B (Second Quality)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Reject / Cut-Piece
          </span>
        );
    }
  };

  const gradeACount = inspections.filter(r => r.grade === 'Grade A').length;
  const gradeBCount = inspections.filter(r => r.grade === 'Grade B').length;
  const rejectCount = inspections.filter(r => r.grade === 'Reject').length;
  const avgPoints = Math.round((inspections.reduce((acc, r) => acc + r.pointsPer100SqYards, 0) / Math.max(1, inspections.length)) * 10) / 10;

  // Handle clicking directly on the fabric light table to add a defect
  const handleLightTableClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedRoll) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPct = Math.round((clickX / rect.width) * 100);
    const yard = Math.round((xPct / 100) * selectedRoll.lengthYards);

    setPinningPosition({ yard, xPct });
  };

  const handleConfirmPinDefect = () => {
    if (!selectedRoll || !pinningPosition) return;

    const newDefect: DefectItem = {
      id: `def-${Date.now()}`,
      yardPosition: pinningPosition.yard,
      defectType: pinDefectType,
      severity: pinSeverity,
      points: pinSeverity,
      description: pinDescription,
      xPositionPercent: pinningPosition.xPct
    };

    const updatedDefects = [...selectedRoll.defects, newDefect];
    const totalPts = updatedDefects.reduce((acc, d) => acc + d.points, 0);
    const ptsPer100 = Math.round(((totalPts * 3600) / (selectedRoll.widthInches * selectedRoll.lengthYards)) * 100) / 100;

    let newGrade: FabricGrade = 'Grade A';
    if (ptsPer100 > 40) newGrade = 'Reject';
    else if (ptsPer100 > 20) newGrade = 'Grade B';

    const updatedRoll: InspectionRoll = {
      ...selectedRoll,
      defects: updatedDefects,
      totalPoints: totalPts,
      pointsPer100SqYards: ptsPer100,
      grade: newGrade
    };

    setSelectedRoll(updatedRoll);
    if (onUpdateRollDefects) {
      onUpdateRollDefects(updatedRoll.id, updatedDefects);
    }
    setPinningPosition(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Industrial Inspection Image */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[170px] flex flex-col justify-end p-6">
        <img
          src={inspectionImage}
          alt="Textile illuminated inspection light table station"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-1">
            <span>Quality Assurance Division</span>
            <span aria-hidden="true">·</span>
            <span>ASTM D5430 4-Point System</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">Interactive Light Table Inspection</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
            Fabric Quality Inspection & Defect Mapping
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Automated roll grading, defect coordinate mapping, and ISO-compliant inspection certificate generation.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Grade A (First Quality)</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {gradeACount}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({Math.round((gradeACount / Math.max(1, inspections.length)) * 100)}%)
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Threshold &lt; 20 pts/100 sq yd</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Grade B (Second Quality)</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
              {gradeBCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({Math.round((gradeBCount / Math.max(1, inspections.length)) * 100)}%)
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">20.1 to 40 pts/100 sq yd</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Fabric Rejects</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
              {rejectCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">rolls</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">&gt; 40 pts/100 sq yd cutoff</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Average Points Score</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {avgPoints}
            </span>
            <span className="text-xs text-slate-500">pts / 100 sq yd</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">Commercial export pass</div>
        </div>
      </div>

      {/* ASTM D5430 Standard Summary Strip */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700">
        <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1.5">
          <Info className="w-4 h-4 text-slate-600" />
          <span>ASTM D5430 4-Point System Assessment Formula</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div className="bg-white p-2 rounded border border-slate-200">
            <div className="text-slate-500">1 Point:</div>
            <div className="font-semibold text-slate-900">Length up to 3 inches</div>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <div className="text-slate-500">2 Points:</div>
            <div className="font-semibold text-slate-900">&gt; 3 up to 6 inches</div>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <div className="text-slate-500">3 Points:</div>
            <div className="font-semibold text-slate-900">&gt; 6 up to 9 inches</div>
          </div>
          <div className="bg-white p-2 rounded border border-slate-200">
            <div className="text-slate-500">4 Points:</div>
            <div className="font-semibold text-slate-900">&gt; 9 inches or holes</div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setGradeFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              gradeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Rolls ({inspections.length})
          </button>
          <button
            onClick={() => setGradeFilter('Grade A')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              gradeFilter === 'Grade A' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grade A ({gradeACount})
          </button>
          <button
            onClick={() => setGradeFilter('Grade B')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              gradeFilter === 'Grade B' ? 'bg-white text-amber-800 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grade B ({gradeBCount})
          </button>
          <button
            onClick={() => setGradeFilter('Reject')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              gradeFilter === 'Reject' ? 'bg-white text-rose-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejects ({rejectCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search roll #, order, loom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
            />
          </div>

          <button
            onClick={onOpenNewInspection}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Inspection</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inspection Roll Visualizer & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of Inspected Rolls (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Roll #</th>
                  <th className="py-2.5 px-4 font-semibold">Order / Loom</th>
                  <th className="py-2.5 px-4 font-semibold">Width x Length</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total Pts</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Pts / 100 sq yd</th>
                  <th className="py-2.5 px-4 font-semibold">ASTM Grade</th>
                  <th className="py-2.5 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInspections.map(roll => {
                  const isSelected = selectedRoll?.id === roll.id;

                  return (
                    <tr
                      key={roll.id}
                      onClick={() => setSelectedRoll(roll)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-100/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {roll.rollNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{roll.orderCode}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Loom: {roll.loomCode}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] tabular-nums text-slate-700">
                        {roll.widthInches}" x {roll.lengthYards} yds ({roll.grossWeightKg} kg)
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-semibold text-slate-900 tabular-nums">
                        {roll.totalPoints} pts
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-bold tabular-nums">
                        <span className={
                          roll.pointsPer100SqYards <= 20 ? 'text-emerald-700' :
                          roll.pointsPer100SqYards <= 40 ? 'text-amber-700' : 'text-rose-700'
                        }>
                          {roll.pointsPer100SqYards}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getGradeBadge(roll.grade)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCertificate(roll);
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors whitespace-nowrap flex items-center gap-1"
                        >
                          <FileCheck className="w-3 h-3 text-slate-600" />
                          <span>QC Certificate</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Roll Light Table Inspection Simulator with Interactive Defect Pinning */}
        {selectedRoll ? (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-slate-500">Inspection File</span>
                <h3 className="font-mono font-bold text-base text-slate-900">
                  {selectedRoll.rollNumber}
                </h3>
              </div>
              {getGradeBadge(selectedRoll.grade)}
            </div>

            {/* Visual Light Table Canvas with Interactive Pin-to-Cloth */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <span>Interactive Defect Map</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-normal font-mono">
                    Click cloth to pin defect
                  </span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {selectedRoll.defects.length} defects
                </span>
              </div>

              {/* Fabric strip simulation with backlit illumination effect */}
              <div
                onClick={handleLightTableClick}
                className="relative w-full h-28 bg-amber-50/70 border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-lg overflow-hidden shadow-inner flex flex-col justify-between p-2 cursor-crosshair group transition-all"
                title="Click anywhere on the cloth surface to pin an observed defect"
              >
                {/* Subtle weave texture stripes */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,#e2e8f0_25px)] bg-[length:25px_100%] opacity-40 pointer-events-none" />

                <div className="text-[10px] font-mono text-slate-400 flex justify-between z-10 pointer-events-none">
                  <span>Yard 0</span>
                  <span>Yard {Math.round(selectedRoll.lengthYards / 2)}</span>
                  <span>Yard {selectedRoll.lengthYards}</span>
                </div>

                {/* Defect markers placed by yardPosition */}
                <div className="relative w-full h-10 z-10 pointer-events-none">
                  {selectedRoll.defects.map((def) => {
                    const leftPct = Math.min(95, Math.max(3, (def.yardPosition / selectedRoll.lengthYards) * 100));
                    return (
                      <div
                        key={def.id}
                        className="group/item absolute -translate-x-1/2 pointer-events-auto"
                        style={{ left: `${leftPct}%`, top: '4px' }}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm transition-transform hover:scale-150 ${
                          def.severity >= 3 ? 'bg-rose-600' : 'bg-amber-600'
                        }`}>
                          {def.points}
                        </div>
                        {/* Tooltip on hover */}
                        <div className="hidden group-hover/item:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-30 shadow-lg font-mono">
                          Yd {def.yardPosition}: {def.defectType} ({def.points} pts)
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[10px] text-slate-500 flex justify-between z-10 pointer-events-none">
                  <span>Selvedge L</span>
                  <span className="text-[9px] font-mono opacity-60 group-hover:opacity-100 text-emerald-700">Click to place defect mark</span>
                  <span>Selvedge R</span>
                </div>
              </div>

              {/* Pin Defect Popover Modal (Interactive) */}
              {pinningPosition && (
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg mt-2 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Log Defect at Yard {pinningPosition.yard}</span>
                    </span>
                    <button onClick={() => setPinningPosition(null)} className="p-0.5 text-slate-400 hover:text-slate-700">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Defect Type</label>
                      <select
                        value={pinDefectType}
                        onChange={(e) => setPinDefectType(e.target.value)}
                        className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                      >
                        <option value="Warp Break / Float">Warp Break / Float</option>
                        <option value="Broken Pick">Broken Pick</option>
                        <option value="Slub / Thick End">Slub / Thick End</option>
                        <option value="Oil / Grease Spot">Oil / Grease Spot</option>
                        <option value="Reed Mark">Reed Mark</option>
                        <option value="Selvedge Tear">Selvedge Tear</option>
                        <option value="Snarl / Loop">Snarl / Loop</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">ASTM Penalty Points</label>
                      <select
                        value={pinSeverity}
                        onChange={(e) => setPinSeverity(Number(e.target.value) as any)}
                        className="w-full p-1 bg-white border border-slate-200 rounded text-xs font-mono font-bold"
                      >
                        <option value={1}>1 pt (&le; 3")</option>
                        <option value={2}>2 pts (&gt;3" to 6")</option>
                        <option value={3}>3 pts (&gt;6" to 9")</option>
                        <option value={4}>4 pts (&gt;9" or hole)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setPinningPosition(null)}
                      className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmPinDefect}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 rounded hover:bg-slate-800"
                    >
                      Pin & Recalculate Grade
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Defect Log Breakdown */}
            <div>
              <div className="text-xs font-semibold text-slate-800 mb-2">
                Defect Log Entries ({selectedRoll.defects.length})
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedRoll.defects.map(d => (
                  <div key={d.id} className="p-2 bg-slate-50 border border-slate-100 rounded text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{d.defectType}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Yard {d.yardPosition} · {d.description || 'Observed at light table'}
                      </div>
                    </div>
                    <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                      d.severity >= 3 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.points} pt{d.points > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ASTM Math Breakdown */}
            <div className="p-3 bg-slate-900 text-white rounded-lg text-xs font-mono space-y-1">
              <div className="text-slate-400 text-[10px]">ASTM D5430 CALCULATION:</div>
              <div className="text-emerald-300 font-semibold">
                ({selectedRoll.totalPoints} pts × 3600) ÷ ({selectedRoll.widthInches}" × {selectedRoll.lengthYards} yds)
              </div>
              <div className="text-slate-200">
                = <span className="font-bold text-white text-sm">{selectedRoll.pointsPer100SqYards}</span> pts / 100 sq yds
              </div>
            </div>

            {/* Inspector Verification footer */}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-900">{selectedRoll.inspectorName}</div>
                <div className="text-[10px] text-slate-500 font-mono">Inspected: {selectedRoll.inspectedAt}</div>
              </div>
              <button
                onClick={() => onViewCertificate(selectedRoll)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                View Certificate
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
            Select a roll to view quality inspection map.
          </div>
        )}
      </div>
    </div>
  );
};
