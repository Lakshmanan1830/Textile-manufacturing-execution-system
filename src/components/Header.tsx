import React, { useState } from 'react';
import {
  Activity,
  Bell,
  Plus,
  Play,
  RefreshCw,
  Layers,
  LogOut,
  User,
  Shield,
  Download,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import type { AlertNotification, UserSession } from '../types/textile';

interface HeaderProps {
  activeTab: 'looms' | 'planning' | 'orders' | 'quality' | 'inventory' | 'oee';
  setActiveTab: (tab: 'looms' | 'planning' | 'orders' | 'quality' | 'inventory' | 'oee') => void;
  alerts: AlertNotification[];
  onAcknowledgeAlert: (alertId: string) => void;
  onOpenNewOrder: () => void;
  onTriggerRandomStop: () => void;
  onRefreshData: () => void;
  user: UserSession | null;
  onLogout: () => void;
  onExportCsv: () => void;
  isSimulating: boolean;
  simulationSpeed: number;
  onToggleSimSpeed: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  alerts,
  onAcknowledgeAlert,
  onOpenNewOrder,
  onTriggerRandomStop,
  onRefreshData,
  user,
  onLogout,
  onExportCsv,
  isSimulating,
  simulationSpeed,
  onToggleSimSpeed
}) => {
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unackAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Strict 3-zone Top Bar Contract */}
      <div className="flex items-center justify-between gap-8 px-6 py-3 max-w-7xl mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-tighter">
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            TexFlow MES
          </span>
          <span className="hidden xl:inline text-xs text-slate-500 font-normal">
            Plant 01 · {user ? user.shift.split(' ')[0] : 'Shift A'}
          </span>
        </div>

        {/* Zone 2: 4-6 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('looms')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'looms'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Loom Floor
          </button>
          <button
            onClick={() => setActiveTab('planning')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'planning'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Production Planning
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'orders'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Order Tracking
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'quality'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Quality Inspection
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'inventory'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            Inventory Visibility
          </button>
          <button
            onClick={() => setActiveTab('oee')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'oee'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'hover:text-slate-900'
            }`}
          >
            OEE & Efficiency
          </button>
        </nav>

        {/* Zone 3: Primary action cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Simulation Rate Button (Interactive) */}
          <button
            onClick={onToggleSimSpeed}
            title="Adjust background telemetry tick rate (1x / 5x / Paused)"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sim: {simulationSpeed}x</span>
          </button>

          {/* Quick Simulation Warp Stop trigger */}
          <button
            onClick={onTriggerRandomStop}
            title="Simulate random yarn break on active loom to test stoppage alert and MTTR response"
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Sim Stop</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={onExportCsv}
            title="Export mill data report to CSV"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Refresh Telemetry */}
          <button
            onClick={onRefreshData}
            title="Refresh mill floor telemetry"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Alert Notification Bell with Count Pill */}
          <div className="relative">
            <button
              onClick={() => setShowAlertDrawer(!showAlertDrawer)}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Factory Alarms & Stoppage Feed"
            >
              <Bell className="w-4 h-4" />
              {unackAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
              )}
            </button>

            {/* Alert Slide-Down Popover */}
            {showAlertDrawer && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Mill Floor Alarms & Stops</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {unackAlerts.length} unacknowledged
                  </span>
                </div>

                <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map(a => (
                      <div
                        key={a.id}
                        className={`p-2.5 rounded-lg border text-xs transition-colors ${
                          a.acknowledged
                            ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'
                            : a.severity === 'high'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <span className="font-mono">{a.loomCode}:</span>
                            <span>{a.title}</span>
                          </div>
                          {!a.acknowledged && (
                            <button
                              onClick={() => onAcknowledgeAlert(a.id)}
                              className="px-2 py-0.5 text-[10px] font-medium bg-white border border-slate-300 rounded hover:bg-slate-100 shrink-0"
                            >
                              Acknowledge
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] mt-1 leading-snug">{a.message}</p>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">{a.timestamp}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      Zero active alarms. Mill running nominal.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* New Order CTA */}
          <button
            onClick={onOpenNewOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Order</span>
          </button>

          {/* User Profile & Sign Out (Interactive) */}
          {user && (
            <div className="relative border-l border-slate-200 pl-2.5">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-xs leading-none">
                  <div className="font-semibold text-slate-900 truncate max-w-[100px]">{user.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{user.badgeNumber}</div>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 text-xs">
                  <div className="pb-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{user.name}</div>
                    <div className="text-slate-500 text-[11px]">{user.roleTitle}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{user.email}</div>
                  </div>

                  <div className="py-2 space-y-1 font-mono text-[11px] text-slate-600 border-b border-slate-100">
                    <div>Badge: {user.badgeNumber}</div>
                    <div>Shift: {user.shift}</div>
                    <div className="truncate">Facility: {user.plantLocation}</div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full mt-2 py-1.5 px-2 text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Terminal</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-2 text-xs">
        {(['looms', 'planning', 'orders', 'quality', 'inventory', 'oee'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium capitalize ${
              activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            {tab === 'oee' ? 'OEE' : tab}
          </button>
        ))}
      </div>
    </header>
  );
};
