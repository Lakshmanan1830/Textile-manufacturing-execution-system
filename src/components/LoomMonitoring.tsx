import React, { useState } from 'react';
import {
  Play,
  Square,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  Clock,
  Gauge,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  LayoutGrid,
  MapPin,
  Layers,
  Sliders,
  Volume2,
  Activity
} from 'lucide-react';
import type { LoomDef, LoomStatus, AlertNotification } from '../types/textile';

interface LoomMonitoringProps {
  looms: LoomDef[];
  alerts: AlertNotification[];
  onLoomAction: (loomId: string, action: string, payload?: any) => Promise<void>;
  onSelectLoom: (loom: LoomDef) => void;
  shedImage?: string;
}

export const LoomMonitoring: React.FC<LoomMonitoringProps> = ({
  looms,
  alerts,
  onLoomAction,
  onSelectLoom,
  shedImage = '/src/assets/images/textile_weaving_shed_1792989928293.jpg'
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'schematic'>('cards');
  const [selectedShed, setSelectedShed] = useState<'all' | 'Shed A' | 'Shed B'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'running' | 'stopped' | 'changeover'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedSchematicLoom, setSelectedSchematicLoom] = useState<LoomDef | null>(null);

  // Filter looms
  const filteredLooms = looms.filter(loom => {
    if (selectedShed === 'Shed A' && !loom.shed.includes('Shed A')) return false;
    if (selectedShed === 'Shed B' && !loom.shed.includes('Shed B')) return false;

    if (selectedStatus === 'running' && loom.status !== 'running') return false;
    if (selectedStatus === 'stopped' && loom.status !== 'warp_stop' && loom.status !== 'weft_stop') return false;
    if (selectedStatus === 'changeover' && loom.status !== 'doffing' && loom.status !== 'knotting' && loom.status !== 'maintenance') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = loom.code.toLowerCase().includes(q);
      const matchOrder = loom.currentOrderCode.toLowerCase().includes(q);
      const matchCustomer = loom.customerName.toLowerCase().includes(q);
      const matchFabric = loom.fabricSpec.toLowerCase().includes(q);
      const matchOperator = loom.operatorName.toLowerCase().includes(q);
      if (!matchCode && !matchOrder && !matchCustomer && !matchFabric && !matchOperator) return false;
    }
    return true;
  });

  const runningCount = looms.filter(l => l.status === 'running').length;
  const stoppedCount = looms.filter(l => l.status === 'warp_stop' || l.status === 'weft_stop').length;
  const changeoverCount = looms.filter(l => l.status === 'doffing' || l.status === 'knotting' || l.status === 'maintenance').length;
  const avgEfficiency = Math.round(looms.reduce((acc, l) => acc + l.efficiencyPercent, 0) / looms.length * 10) / 10;
  const totalMeters = looms.reduce((acc, l) => acc + l.currentMetersWoven, 0);

  const handleAction = async (loomId: string, action: string, payload?: any) => {
    setActionLoading(`${loomId}-${action}`);
    try {
      await onLoomAction(loomId, action, payload);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: LoomStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Running
          </span>
        );
      case 'warp_stop':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
            Warp Stop (Drop Wire)
          </span>
        );
      case 'weft_stop':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Weft Stop (Feeder)
          </span>
        );
      case 'doffing':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Cloth Doffing
          </span>
        );
      case 'knotting':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
            <Settings2 className="w-3.5 h-3.5 text-purple-600" />
            Beam Knotting
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Idle
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Mill Hero Banner with Industrial Photo */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[170px] flex flex-col justify-end p-6">
        <img
          src={shedImage}
          alt="Modern automated weaving shed with air jet looms"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-1">
            <span>Plant 01 · Weaving Division</span>
            <span aria-hidden="true">·</span>
            <span>12 High-Speed Looms Online</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-mono">Live Telemetry Synchronized</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
            Loom Floor Monitoring & Telemetry
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Live sensor bus detecting drop wire warp breaks, filling yarn feeder alerts, speed regulation, and MTTR recovery response.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Running Looms</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {runningCount}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {looms.length} units</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{Math.round((runningCount / looms.length) * 100)}% utilization</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Floor Efficiency</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {avgEfficiency}%
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Target standard: 88.0%</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Active Stoppages</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${stoppedCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {stoppedCount}
            </span>
            <span className="text-xs text-slate-500">yarn breaks</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {stoppedCount > 0 ? 'Technicians dispatched' : 'Zero stoppages'}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Beam / Doff Changeover</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {changeoverCount}
            </span>
            <span className="text-xs text-slate-500">looms</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Knotting & doffing</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Shift Meters Woven</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalMeters.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">m</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            Shift A Output Nominal
          </div>
        </div>
      </div>

      {/* Urgent Stoppage Action Banner */}
      {stoppedCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-rose-900">
                {stoppedCount} Loom Stoppage{stoppedCount > 1 ? 's' : ''} Detected
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                {looms
                  .filter(l => l.status === 'warp_stop' || l.status === 'weft_stop')
                  .map(l => `${l.code}: ${l.lastStopReason || l.status}`)
                  .join(' · ')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {looms
              .filter(l => l.status === 'warp_stop' || l.status === 'weft_stop')
              .map(l => (
                <button
                  key={l.id}
                  onClick={() => handleAction(l.id, 'resume')}
                  disabled={actionLoading === `${l.id}-resume`}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume {l.code}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Filter Toolbar, Search, & View Mode Switch (Interactive) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* View Mode Toggle: Cards vs Schematic Map */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards View</span>
          </button>
          <button
            onClick={() => setViewMode('schematic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'schematic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shed Floor Schematic Map</span>
          </button>
        </div>

        {/* Shed Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setSelectedShed('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedShed === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sheds ({looms.length})
          </button>
          <button
            onClick={() => setSelectedShed('Shed A')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedShed === 'Shed A' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shed A · Air Jet
          </button>
          <button
            onClick={() => setSelectedShed('Shed B')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              selectedShed === 'Shed B' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shed B · Rapier
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search loom, fabric, weaver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
          />
        </div>
      </div>

      {/* View 1: Interactive Shed Floor Schematic Map */}
      {viewMode === 'schematic' ? (
        <div className="bg-slate-950 text-white border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <div className="text-xs font-mono text-emerald-400">ARCHITECTURAL WEAVING SHED MAP</div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Physical Mill Floor Grid Layout · Plant 01
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Running</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-bounce" />
                <span>Warp/Weft Stop</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Doff/Knot</span>
              </span>
            </div>
          </div>

          {/* Shed Layout Columns: Shed A on Left, Shed B on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shed A - Air Jet Line */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-white uppercase tracking-wider font-mono">
                  Shed A · Air Jet High-Speed Line (Looms L-101 to L-106)
                </span>
                <span className="text-[11px] text-slate-400">Max 850 RPM · Poplin & Oxford</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {looms.filter(l => l.shed.includes('Shed A')).map(l => {
                  const isStopped = l.status === 'warp_stop' || l.status === 'weft_stop';
                  const isRunning = l.status === 'running';

                  return (
                    <div
                      key={l.id}
                      onClick={() => onSelectLoom(l)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                        isStopped
                          ? 'bg-rose-950/60 border-rose-500 ring-1 ring-rose-500'
                          : isRunning
                          ? 'bg-slate-900 border-emerald-500/40 hover:border-emerald-400'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-white">{l.code}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          isStopped ? 'bg-rose-500 animate-ping' :
                          isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
                        }`} />
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        {l.rpm} RPM · {l.efficiencyPercent}%
                      </div>

                      <div className="text-[10px] text-slate-300 truncate mt-1">
                        {l.currentOrderCode}
                      </div>

                      {/* Animated yarn beam progress indicator */}
                      <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                        <div
                          className={`h-full ${isStopped ? 'bg-rose-500' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.round((l.currentMetersWoven / l.targetMeters) * 100)}%` }}
                        />
                      </div>

                      <div className="mt-2 text-[10px] font-mono flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>{l.currentMetersWoven}m</span>
                        <span className="text-slate-500">{l.operatorName.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shed B - Rapier Line */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-white uppercase tracking-wider font-mono">
                  Shed B · Rapier Heavy & Suiting Line (Looms L-107 to L-112)
                </span>
                <span className="text-[11px] text-slate-400">Max 630 RPM · Twill & Linen</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {looms.filter(l => l.shed.includes('Shed B')).map(l => {
                  const isStopped = l.status === 'warp_stop' || l.status === 'weft_stop';
                  const isRunning = l.status === 'running';

                  return (
                    <div
                      key={l.id}
                      onClick={() => onSelectLoom(l)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                        isStopped
                          ? 'bg-rose-950/60 border-rose-500 ring-1 ring-rose-500'
                          : isRunning
                          ? 'bg-slate-900 border-emerald-500/40 hover:border-emerald-400'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-white">{l.code}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          isStopped ? 'bg-rose-500 animate-ping' :
                          isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
                        }`} />
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        {l.rpm} RPM · {l.efficiencyPercent}%
                      </div>

                      <div className="text-[10px] text-slate-300 truncate mt-1">
                        {l.currentOrderCode}
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                        <div
                          className={`h-full ${isStopped ? 'bg-rose-500' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.round((l.currentMetersWoven / l.targetMeters) * 100)}%` }}
                        />
                      </div>

                      <div className="mt-2 text-[10px] font-mono flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>{l.currentMetersWoven}m</span>
                        <span className="text-slate-500">{l.operatorName.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* View 2: Detailed Telemetry Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLooms.map(loom => {
            const progressPct = Math.round((loom.currentMetersWoven / loom.targetMeters) * 100);
            const isLoomStopped = loom.status === 'warp_stop' || loom.status === 'weft_stop';

            return (
              <div
                key={loom.id}
                className={`bg-white border rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-sm ${
                  isLoomStopped
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base font-mono text-slate-900">
                        {loom.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {loom.type}
                      </span>
                    </div>
                    {getStatusBadge(loom.status)}
                  </div>

                  <div className="text-xs text-slate-500 truncate mb-3" title={loom.name}>
                    {loom.name} · {loom.reedWidthInches}" Reed
                  </div>

                  {/* Fabric & Order Details */}
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg mb-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-700 mb-0.5">
                      <span className="font-semibold text-slate-900">{loom.currentOrderCode}</span>
                      <span className="text-slate-500">{loom.weavePattern}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 truncate" title={loom.fabricSpec}>
                      {loom.fabricSpec}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">
                      Customer: {loom.customerName}
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Current Speed</div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                          {loom.rpm}
                        </span>
                        <span className="text-[10px] text-slate-500">RPM</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Std: {loom.standardRpm} RPM
                      </div>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Efficiency</div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className={`font-mono font-bold text-sm tabular-nums ${
                          loom.efficiencyPercent >= 90 ? 'text-emerald-600' : loom.efficiencyPercent >= 80 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {loom.efficiencyPercent}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Stops: {loom.todayStops.warp + loom.todayStops.weft} today
                      </div>
                    </div>
                  </div>

                  {/* Production Meters Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Batch Progress</span>
                      <span className="font-mono font-semibold text-slate-800 tabular-nums">
                        {loom.currentMetersWoven.toLocaleString()}m / {loom.targetMeters.toLocaleString()}m ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          progressPct >= 90 ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stop Reason Callout */}
                  {loom.lastStopReason && (
                    <div className="p-2 rounded bg-rose-50 border border-rose-100 text-xs text-rose-800 mb-3">
                      <div className="font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Stop Cause:</span>
                      </div>
                      <div className="text-[11px] mt-0.5 leading-snug">{loom.lastStopReason}</div>
                    </div>
                  )}
                </div>

                {/* Card Action Strip */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectLoom(loom)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
                  >
                    <span>Diagnostics</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isLoomStopped ? (
                      <button
                        onClick={() => handleAction(loom.id, 'resume')}
                        disabled={actionLoading === `${loom.id}-resume`}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start</span>
                      </button>
                    ) : loom.status === 'running' ? (
                      <>
                        <button
                          onClick={() => handleAction(loom.id, 'trigger_warp_stop')}
                          title="Simulate warp yarn drop wire break"
                          className="px-2 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors"
                        >
                          Stop Test
                        </button>
                        <button
                          onClick={() => handleAction(loom.id, 'pause')}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Square className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAction(loom.id, 'resume')}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
