import React, { useState } from 'react';
import {
  X,
  Play,
  Square,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  Gauge,
  Thermometer,
  Wrench,
  RotateCcw,
  Sliders
} from 'lucide-react';
import type { LoomDef } from '../types/textile';

interface LoomDetailModalProps {
  loom: LoomDef | null;
  onClose: () => void;
  onLoomAction: (loomId: string, action: string, payload?: any) => Promise<void>;
}

export const LoomDetailModal: React.FC<LoomDetailModalProps> = ({
  loom,
  onClose,
  onLoomAction
}) => {
  if (!loom) return null;

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoadingAction(action);
    try {
      await onLoomAction(loom.id, action);
    } finally {
      setLoadingAction(null);
    }
  };

  const isStopped = loom.status === 'warp_stop' || loom.status === 'weft_stop';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-slate-900">{loom.code}</span>
            <span className="text-xs text-slate-500 font-medium">{loom.name}</span>
            <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{loom.shed}</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 mt-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl flex items-center justify-between ${
            isStopped ? 'bg-rose-50 border border-rose-200 text-rose-900' :
            loom.status === 'running' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' :
            'bg-slate-100 text-slate-800'
          }`}>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider">Loom Status</div>
              <div className="text-base font-bold capitalize mt-0.5">{loom.status.replace('_', ' ')}</div>
              {loom.lastStopReason && (
                <div className="text-xs mt-1 leading-snug">{loom.lastStopReason}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isStopped ? (
                <button
                  onClick={() => handleAction('resume')}
                  disabled={loadingAction === 'resume'}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Weaving</span>
                </button>
              ) : loom.status === 'running' ? (
                <button
                  onClick={() => handleAction('pause')}
                  disabled={loadingAction === 'pause'}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Manual Stop</span>
                </button>
              ) : (
                <button
                  onClick={() => handleAction('resume')}
                  disabled={loadingAction === 'resume'}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Loom</span>
                </button>
              )}
            </div>
          </div>

          {/* Telemetry Sensor Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="text-slate-500">Current Speed</div>
              <div className="font-mono text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                {loom.rpm} <span className="text-[10px] text-slate-500 font-sans">RPM</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Rated: {loom.standardRpm} RPM</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="text-slate-500">Shift Efficiency</div>
              <div className="font-mono text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                {loom.efficiencyPercent}%
              </div>
              <div className="text-[10px] text-emerald-600 font-mono">Target: 88.0%</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="text-slate-500">Operating Temp</div>
              <div className="font-mono text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                {loom.temperatureC} °C
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Nominal (18-30°C)</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="text-slate-500">Vibration</div>
              <div className="font-mono text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                {loom.vibrationMmSec} mm/s
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Standard: &lt; 2.5</div>
            </div>
          </div>

          {/* Active Job & Fabric Information */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
            <div className="font-semibold text-slate-900 flex items-center justify-between pb-2 border-b border-slate-200">
              <span>Active Production Assignment</span>
              <span className="font-mono text-slate-700">{loom.currentOrderCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-medium text-slate-900">{loom.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fabric Construction:</span>
              <span className="font-medium text-slate-900 truncate max-w-xs">{loom.fabricSpec}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Warp Yarn Package:</span>
              <span className="font-mono text-slate-800">{loom.warpYarn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Weft Yarn Package:</span>
              <span className="font-mono text-slate-800">{loom.weftYarn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Weaver:</span>
              <span className="font-medium text-slate-900">{loom.operatorName} ({loom.shift})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Warp Beam Remaining:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">{loom.beamLengthRemainingMeters.toLocaleString()} meters</span>
            </div>
          </div>

          {/* Stoppage Breakdown Today */}
          <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-900">Today's Stop Frequencies</div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500">Warp Yarn Stops</div>
                <div className="text-sm font-bold text-slate-900 tabular-nums">{loom.todayStops.warp}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500">Weft Stops</div>
                <div className="text-sm font-bold text-slate-900 tabular-nums">{loom.todayStops.weft}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <div className="text-[10px] text-slate-500">Mechanical/Other</div>
                <div className="text-sm font-bold text-slate-900 tabular-nums">{loom.todayStops.other}</div>
              </div>
            </div>
          </div>

          {/* Control Overrides */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('trigger_warp_stop')}
                className="px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
              >
                Simulate Warp Break
              </button>
              <button
                onClick={() => handleAction('knot_beam')}
                className="px-2.5 py-1.5 text-xs font-medium text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
              >
                Knot Beam
              </button>
              <button
                onClick={() => handleAction('doff')}
                className="px-2.5 py-1.5 text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                Cloth Doff
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
