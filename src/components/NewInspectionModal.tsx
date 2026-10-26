import React, { useState } from 'react';
import { X, Plus, Trash2, Award, Info, CheckCircle2 } from 'lucide-react';
import type { LoomDef, ProductionOrder, DefectItem } from '../types/textile';

interface NewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  looms: LoomDef[];
  orders: ProductionOrder[];
  onSubmitInspection: (data: any) => Promise<void>;
}

export const NewInspectionModal: React.FC<NewInspectionModalProps> = ({
  isOpen,
  onClose,
  looms,
  orders,
  onSubmitInspection
}) => {
  if (!isOpen) return null;

  const [orderCode, setOrderCode] = useState(orders[0]?.orderCode || 'ORD-2026-881');
  const [loomCode, setLoomCode] = useState(looms[0]?.code || 'L-101');
  const [fabricSpec, setFabricSpec] = useState('40s Combed x 40s Combed / 132x72 Poplin');
  const [widthInches, setWidthInches] = useState(63);
  const [lengthYards, setLengthYards] = useState(120);
  const [grossWeightKg, setGrossWeightKg] = useState(21.5);
  const [inspectorName, setInspectorName] = useState('Maria Santos (QC Certified #08)');
  const [remarks, setRemarks] = useState('Standard illuminated light-table inspection completed.');

  // Defect logging list
  const [defects, setDefects] = useState<Array<{
    id: string;
    yardPosition: number;
    defectType: any;
    severity: 1 | 2 | 3 | 4;
    description: string;
    xPositionPercent: number;
  }>>([
    {
      id: 'd-1',
      yardPosition: 24,
      defectType: 'Slub / Thick End',
      severity: 1,
      description: 'Minor slub < 3"',
      xPositionPercent: 35
    },
    {
      id: 'd-2',
      yardPosition: 68,
      defectType: 'Oil / Grease Spot',
      severity: 2,
      description: 'Temple oil drop 4"',
      xPositionPercent: 88
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live ASTM D5430 Calculation:
  // Points / 100 sq yds = (Total Points * 3600) / (Fabric Width in inches * Roll Length in yards)
  const totalPoints = defects.reduce((sum, d) => sum + Number(d.severity), 0);
  const pointsPer100SqYards = widthInches > 0 && lengthYards > 0
    ? Math.round(((totalPoints * 3600) / (widthInches * lengthYards)) * 100) / 100
    : 0;

  let calculatedGrade: 'Grade A' | 'Grade B' | 'Reject' = 'Grade A';
  if (pointsPer100SqYards > 40) {
    calculatedGrade = 'Reject';
  } else if (pointsPer100SqYards > 20) {
    calculatedGrade = 'Grade B';
  }

  const addDefect = () => {
    setDefects([
      ...defects,
      {
        id: `d-${Date.now()}`,
        yardPosition: Math.floor(Math.random() * lengthYards),
        defectType: 'Broken Pick',
        severity: 2,
        description: 'Broken weft thread',
        xPositionPercent: 50
      }
    ]);
  };

  const removeDefect = (id: string) => {
    setDefects(defects.filter(d => d.id !== id));
  };

  const updateDefect = (id: string, field: string, val: any) => {
    setDefects(defects.map(d => (d.id === id ? { ...d, [field]: val } : d)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitInspection({
        orderCode,
        loomCode,
        fabricSpec,
        widthInches: Number(widthInches),
        lengthYards: Number(lengthYards),
        grossWeightKg: Number(grossWeightKg),
        inspectorName,
        remarks,
        defects: defects.map(d => ({
          ...d,
          points: Number(d.severity)
        }))
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Log ASTM D5430 Fabric Quality Inspection Roll
            </h3>
            <p className="text-xs text-slate-500">
              Standard 4-point fabric inspection log with defect coordinates and automatic Grade determination.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Order #</label>
              <select
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium"
              >
                {orders.map(o => (
                  <option key={o.id} value={o.orderCode}>{o.orderCode} ({o.customerName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Loom Code</label>
              <select
                value={loomCode}
                onChange={(e) => setLoomCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium"
              >
                {looms.map(l => (
                  <option key={l.id} value={l.code}>{l.code} · {l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Inspector</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Fabric Width (Inches)</label>
              <input
                type="number"
                value={widthInches}
                onChange={(e) => setWidthInches(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Roll Length (Yards)</label>
              <input
                type="number"
                value={lengthYards}
                onChange={(e) => setLengthYards(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Gross Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={grossWeightKg}
                onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* Defect Logger List */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900">
                Log Observed Defects (ASTM 4-Point Scale)
              </span>
              <button
                type="button"
                onClick={addDefect}
                className="px-2.5 py-1 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-100 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Defect</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {defects.map(d => (
                <div key={d.id} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-slate-200 text-xs">
                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-400 block">Yard Position</label>
                    <input
                      type="number"
                      value={d.yardPosition}
                      onChange={(e) => updateDefect(d.id, 'yardPosition', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono"
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-400 block">Defect Type</label>
                    <select
                      value={d.defectType}
                      onChange={(e) => updateDefect(d.id, 'defectType', e.target.value)}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded"
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

                  <div className="col-span-3">
                    <label className="text-[10px] text-slate-400 block">ASTM Penalty Pts</label>
                    <select
                      value={d.severity}
                      onChange={(e) => updateDefect(d.id, 'severity', Number(e.target.value))}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold"
                    >
                      <option value={1}>1 pt (up to 3")</option>
                      <option value={2}>2 pts (&gt;3" to 6")</option>
                      <option value={3}>3 pts (&gt;6" to 9")</option>
                      <option value={4}>4 pts (&gt;9" or hole)</option>
                    </select>
                  </div>

                  <div className="col-span-2 text-right pt-3">
                    <button
                      type="button"
                      onClick={() => removeDefect(d.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ASTM Score Preview Callout */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[10px]">ASTM D5430 CALCULATION SCORE</div>
              <div className="text-xl font-bold text-white mt-0.5">
                {pointsPer100SqYards} <span className="text-xs font-normal text-slate-300">points / 100 sq yds</span>
              </div>
              <div className="text-[11px] text-slate-400">Total Penalty Points: {totalPoints} pts</div>
            </div>

            <div className="text-right">
              <div className="text-slate-400 text-[10px]">DETERMINED GRADE</div>
              <div className={`text-base font-bold px-3 py-1 rounded inline-block mt-1 ${
                calculatedGrade === 'Grade A' ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' :
                calculatedGrade === 'Grade B' ? 'bg-amber-900 text-amber-300 border border-amber-700' :
                'bg-rose-900 text-rose-300 border border-rose-700'
              }`}>
                {calculatedGrade}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Roll...' : 'Certify & Record Roll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
