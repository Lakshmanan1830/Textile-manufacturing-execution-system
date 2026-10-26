import React, { useState } from 'react';
import { Layers, ShieldCheck, ArrowRight, UserCheck, Key, Lock, Building2, Clock, Check } from 'lucide-react';
import type { UserSession, UserRole } from '../types/textile';

interface LoginPageProps {
  onLogin: (session: UserSession) => void;
  shedImage?: string;
}

interface DemoAccount {
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  badgeNumber: string;
  shift: 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Shift C (22:00 - 06:00)';
  plantLocation: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'Ashwin Vance',
    email: 'ashwin.vance@texflow.internal',
    role: 'production_manager',
    roleTitle: 'Production Director',
    badgeNumber: 'MGR-0412',
    shift: 'Shift A (06:00 - 14:00)',
    plantLocation: 'Plant 01 · Primary Weaving Shed'
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@texflow.internal',
    role: 'loom_technician',
    roleTitle: 'Chief Loom Technician',
    badgeNumber: 'TECH-8819',
    shift: 'Shift A (06:00 - 14:00)',
    plantLocation: 'Plant 01 · Shed A (Air Jet Line)'
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@texflow.internal',
    role: 'qc_inspector',
    roleTitle: 'Senior ASTM QA Auditor',
    badgeNumber: 'QC-3302',
    shift: 'Shift A (06:00 - 14:00)',
    plantLocation: 'Plant 01 · Quality Inspection Lab'
  },
  {
    name: 'Marcus Brody',
    email: 'marcus.brody@texflow.internal',
    role: 'inventory_lead',
    roleTitle: 'Warehouse & Yarn Logistics Lead',
    badgeNumber: 'INV-1094',
    shift: 'Shift A (06:00 - 14:00)',
    plantLocation: 'Central Raw Material Warehouse'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  shedImage = '/src/assets/images/textile_weaving_shed_1792989928293.jpg'
}) => {
  const [selectedDemo, setSelectedDemo] = useState<DemoAccount>(DEMO_ACCOUNTS[0]);
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [badgeNumber, setBadgeNumber] = useState(DEMO_ACCOUNTS[0].badgeNumber);
  const [password, setPassword] = useState('••••••••••••');
  const [shift, setShift] = useState<'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Shift C (22:00 - 06:00)'>('Shift A (06:00 - 14:00)');
  const [plant, setPlant] = useState('Plant 01 · Primary Weaving Shed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectDemoAccount = (acc: DemoAccount) => {
    setSelectedDemo(acc);
    setEmail(acc.email);
    setBadgeNumber(acc.badgeNumber);
    setShift(acc.shift);
    setPlant(acc.plantLocation);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onLogin({
        id: `usr-${Date.now()}`,
        name: selectedDemo.name,
        email,
        role: selectedDemo.role,
        roleTitle: selectedDemo.roleTitle,
        badgeNumber,
        shift,
        plantLocation: plant
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-white selection:bg-emerald-500 selection:text-black">
      {/* Left Column: Industrial Plant Photography & Visual Ambience */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        {/* Background photo */}
        <img
          src={shedImage}
          alt="Modern automated weaving shed interior"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        {/* Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        {/* Top Branding Lockup */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white">TexFlow MES</div>
            <div className="text-xs text-slate-400 font-mono">Textile Manufacturing Execution System</div>
          </div>
        </div>

        {/* Ambient Plant Live Metrics */}
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Plant 01 Weaving Shed: Active Telemetry</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
            Precision loom monitoring, automated ASTM quality grading, and zero-delay production planning.
          </h2>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
            <div>
              <div className="text-slate-400">Connected Looms</div>
              <div className="text-lg font-bold text-white mt-0.5 tabular-nums">12 / 12 Units</div>
              <div className="text-[11px] text-emerald-400">Air Jet & Rapier</div>
            </div>
            <div>
              <div className="text-slate-400">Active Shift OEE</div>
              <div className="text-lg font-bold text-white mt-0.5 tabular-nums">85.4%</div>
              <div className="text-[11px] text-slate-400">Target: 85.0%</div>
            </div>
            <div>
              <div className="text-slate-400">ASTM Inspection</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5 tabular-nums">98.2% Pass</div>
              <div className="text-[11px] text-slate-400">Grade A First-Quality</div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500 font-mono">
          ISO 9001:2015 · ASTM D5430 Fabric Inspection Standard Compliant
        </div>
      </div>

      {/* Right Column: Interactive Login Terminal */}
      <div className="w-full lg:w-[520px] xl:w-[560px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-slate-900 overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8 my-auto">
          {/* Header */}
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">TexFlow MES</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              Mill Terminal Access
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select an operator profile below or enter your plant badge credentials.
            </p>
          </div>

          {/* Quick Role Preset Picker (Interactive UX) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Quick Operator Profile Select:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const isSelected = selectedDemo.email === acc.email;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => selectDemoAccount(acc)}
                    className={`p-2.5 rounded-lg text-left transition-all border ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">
                        {acc.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {acc.roleTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {acc.badgeNumber}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Operator Email / System Identifier
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Plant Badge ID
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Terminal Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Current Shift
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600"
                  >
                    <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                    <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                    <option value="Shift C (22:00 - 06:00)">Shift C (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Plant Division
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <select
                    value={plant}
                    onChange={(e) => setPlant(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-slate-600 truncate"
                  >
                    <option value="Plant 01 · Primary Weaving Shed">Plant 01 · Weaving Shed</option>
                    <option value="Plant 01 · Shed A (Air Jet Line)">Plant 01 · Shed A (Air Jet)</option>
                    <option value="Plant 01 · Shed B (Rapier Line)">Plant 01 · Shed B (Rapier)</option>
                    <option value="Central Raw Material Warehouse">Central Warehouse</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs tracking-wide transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Plant Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedDemo.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Industrial Single Sign-On · Station Gate 04 Secured</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 text-center font-mono">
          TexFlow MES Operating System · Build 2026.10
        </div>
      </div>
    </div>
  );
};
