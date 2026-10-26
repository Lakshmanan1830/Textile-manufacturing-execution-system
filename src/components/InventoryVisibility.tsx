import React, { useState } from 'react';
import {
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Search,
  Truck,
  Box,
  SlidersHorizontal,
  Archive,
  Send
} from 'lucide-react';
import type { YarnInventoryItem, GreigeFabricRoll } from '../types/textile';

interface InventoryVisibilityProps {
  yarnStock: YarnInventoryItem[];
  greigeStock: GreigeFabricRoll[];
  onIssueYarn: (yarnId: string, quantityKg: number, destination: string) => Promise<void>;
  onReceiveYarn: (yarn: Partial<YarnInventoryItem>) => Promise<void>;
  onDispatchGreige: (rollId: string) => Promise<void>;
  inventoryImage?: string;
}

export const InventoryVisibility: React.FC<InventoryVisibilityProps> = ({
  yarnStock,
  greigeStock,
  onIssueYarn,
  onReceiveYarn,
  onDispatchGreige,
  inventoryImage = '/src/assets/images/yarn_cone_inventory_1792989956625.jpg'
}) => {
  const [activeTab, setActiveTab] = useState<'yarn' | 'greige'>('yarn');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedYarnForIssue, setSelectedYarnForIssue] = useState<YarnInventoryItem | null>(null);
  const [issueQuantity, setIssueQuantity] = useState<number>(200);
  const [issueDestination, setIssueDestination] = useState<string>('Weaving Shed A (Looms L-101/L-102)');

  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [newCountNe, setNewCountNe] = useState('40s Ne');
  const [newYarnType, setNewYarnType] = useState('100% Combed Cotton Ring Spun');
  const [newLotNumber, setNewLotNumber] = useState(`LOT-CT-2026-${Math.floor(Math.random() * 900) + 100}`);
  const [newSupplier, setNewSupplier] = useState('Premier Cotton Spinners');
  const [newStockKg, setNewStockKg] = useState(2500);
  const [newSafetyStockKg, setNewSafetyStockKg] = useState(1500);
  const [newUnitCost, setNewUnitCost] = useState(4.85);
  const [newStorageBin, setNewStorageBin] = useState('Aisle A - Rack 03');

  // Filter yarn
  const filteredYarn = yarnStock.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = item.itemCode.toLowerCase().includes(q);
      const matchType = item.yarnType.toLowerCase().includes(q);
      const matchLot = item.lotNumber.toLowerCase().includes(q);
      const matchSupplier = item.supplier.toLowerCase().includes(q);
      if (!matchCode && !matchType && !matchLot && !matchSupplier) return false;
    }
    return true;
  });

  // Filter greige
  const filteredGreige = greigeStock.filter(roll => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRoll = roll.rollCode.toLowerCase().includes(q);
      const matchOrder = roll.orderCode.toLowerCase().includes(q);
      const matchFab = roll.fabricName.toLowerCase().includes(q) || roll.construction.toLowerCase().includes(q);
      if (!matchRoll && !matchOrder && !matchFab) return false;
    }
    return true;
  });

  // Summaries
  const totalYarnKg = yarnStock.reduce((acc, y) => acc + y.currentStockKg, 0);
  const lowStockYarns = yarnStock.filter(y => y.currentStockKg < y.minSafetyStockKg);
  const totalGreigeMeters = greigeStock.reduce((acc, g) => acc + g.lengthMeters, 0);
  const availableGreigeCount = greigeStock.filter(g => g.status === 'in_warehouse').length;

  const handleOpenIssue = (yarn: YarnInventoryItem) => {
    setSelectedYarnForIssue(yarn);
    setIssueQuantity(Math.min(300, Math.floor(yarn.currentStockKg * 0.1)));
    setShowIssueModal(true);
  };

  const handleConfirmIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYarnForIssue) return;
    await onIssueYarn(selectedYarnForIssue.id, issueQuantity, issueDestination);
    setShowIssueModal(false);
  };

  const handleConfirmReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    await onReceiveYarn({
      itemCode: `YRN-${newCountNe.replace(/[^0-9]/g, '')}-${Math.floor(Math.random() * 90) + 10}`,
      yarnType: newYarnType,
      countNe: newCountNe,
      blend: 'Cotton / Poly blend',
      lotNumber: newLotNumber,
      supplier: newSupplier,
      currentStockKg: Number(newStockKg),
      minSafetyStockKg: Number(newSafetyStockKg),
      unitCostPerKg: Number(newUnitCost),
      storageBin: newStorageBin
    });
    setShowReceiveModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner with Yarn Cone Inventory Image */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[170px] flex flex-col justify-end p-6">
        <img
          src={inventoryImage}
          alt="Textile yarn warehouse with stacked bobbin racks"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-1">
            <span>Central Warehouse & Material Management</span>
            <span aria-hidden="true">·</span>
            <span>Raw Yarn Cones & Greige Fabric Stock</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
            Material Inventory & Storage Visibility
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Live yarn cone weights, safety threshold reorder warnings, automated BOM stock allocation, and greige warehouse roll locations.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Total Yarn In Stock</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalYarnKg.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">kg</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">{yarnStock.length} active yarn lots</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Safety Stock Reorder Alerts</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${lowStockYarns.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lowStockYarns.length}
            </span>
            <span className="text-xs text-slate-500">lots below threshold</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {lowStockYarns.length > 0 ? 'Sourcing PO recommended' : 'All yarn above safety line'}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Greige Fabric Warehouse</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalGreigeMeters.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">meters</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            {availableGreigeCount} rolls ready for dyeing/finishing
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs text-slate-500 font-medium">Yarn Inventory Value</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              ${Math.round(yarnStock.reduce((acc, y) => acc + (y.currentStockKg * y.unitCostPerKg), 0)).toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Average: $4.92 / kg</div>
        </div>
      </div>

      {/* Safety Reorder Callout (if low stock detected) */}
      {lowStockYarns.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-900">
                Low Yarn Stock Alert: {lowStockYarns.map(y => `${y.countNe} (${y.currentStockKg}kg / min ${y.minSafetyStockKg}kg)`).join(', ')}
              </div>
              <div className="text-xs text-amber-700 mt-0.5">
                Current warehouse quantity has dipped below minimum safety threshold. Potential bottleneck for upcoming weave schedules.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowReceiveModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Receive Inbound Yarn
          </button>
        </div>
      )}

      {/* Segmented Tab Switch: Raw Yarn vs Greige Fabric */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('yarn')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'yarn' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw Yarn Stock ({yarnStock.length} Lots)
          </button>
          <button
            onClick={() => setActiveTab('greige')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'greige' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Greige Fabric Rolls ({greigeStock.length} Rolls)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'yarn' ? 'Search yarn count, lot, supplier...' : 'Search roll code, order...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
            />
          </div>

          {activeTab === 'yarn' ? (
            <button
              onClick={() => setShowReceiveModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Receive Yarn Lot</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Tab 1: Raw Yarn Table */}
      {activeTab === 'yarn' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Item / Lot #</th>
                  <th className="py-2.5 px-4 font-semibold">Yarn Count & Blend</th>
                  <th className="py-2.5 px-4 font-semibold">Supplier</th>
                  <th className="py-2.5 px-4 font-semibold text-right">In Stock (kg)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Min Safety Stock</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Cones</th>
                  <th className="py-2.5 px-4 font-semibold">Bin Location</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredYarn.map(item => {
                  const isLow = item.currentStockKg < item.minSafetyStockKg;
                  const stockPct = Math.round((item.currentStockKg / Math.max(item.minSafetyStockKg * 2, 1)) * 100);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">{item.itemCode}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{item.lotNumber}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{item.countNe}</div>
                        <div className="text-[11px] text-slate-500">{item.yarnType}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {item.supplier}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-bold text-slate-900 tabular-nums">
                          {item.currentStockKg.toLocaleString()} kg
                        </div>
                        <div className="w-20 ml-auto bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${isLow ? 'bg-amber-500' : 'bg-slate-800'}`}
                            style={{ width: `${Math.min(100, stockPct)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-right tabular-nums text-slate-600">
                        {item.minSafetyStockKg.toLocaleString()} kg
                      </td>

                      <td className="py-3 px-4 font-mono text-right tabular-nums text-slate-800">
                        {item.conesAvailable.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                        {item.storageBin}
                      </td>

                      <td className="py-3 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Optimal
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenIssue(item)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors whitespace-nowrap inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Issue to Loom</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Greige Fabric Warehouse Table */}
      {activeTab === 'greige' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Roll Code</th>
                  <th className="py-2.5 px-4 font-semibold">Order #</th>
                  <th className="py-2.5 px-4 font-semibold">Fabric Construction</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Length (Meters)</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Weight (kg)</th>
                  <th className="py-2.5 px-4 font-semibold">Grade</th>
                  <th className="py-2.5 px-4 font-semibold">Storage Location</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGreige.map(roll => {
                  return (
                    <tr key={roll.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {roll.rollCode}
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {roll.orderCode}
                      </td>

                      <td className="py-3 px-4 text-slate-800">
                        <div className="font-semibold text-slate-900">{roll.fabricName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{roll.construction} · {roll.widthInches}"</div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-right tabular-nums text-slate-900">
                        {roll.lengthMeters.toLocaleString()} m
                      </td>

                      <td className="py-3 px-4 font-mono text-right tabular-nums text-slate-700">
                        {roll.weightKg} kg
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          roll.grade === 'Grade A' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {roll.grade}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {roll.storageBin}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          roll.status === 'in_warehouse' ? 'bg-blue-50 text-blue-700' :
                          roll.status === 'allocated_to_dyeing' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {roll.status === 'in_warehouse' ? 'In Warehouse' : roll.status === 'allocated_to_dyeing' ? 'Allocated to Dyeing' : 'Dispatched'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {roll.status !== 'dispatched' ? (
                          <button
                            onClick={() => onDispatchGreige(roll.id)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors whitespace-nowrap inline-flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3 text-slate-700" />
                            <span>Dispatch</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Dispatched</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Issue Yarn to Loom */}
      {showIssueModal && selectedYarnForIssue && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Issue Yarn to Weaving Shed
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Transfer yarn packages from warehouse bin to active looms for beam filling.
            </p>

            <form onSubmit={handleConfirmIssue} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div><span className="text-slate-500">Yarn Lot:</span> <strong className="font-mono text-slate-900">{selectedYarnForIssue.itemCode}</strong></div>
                <div><span className="text-slate-500">Count / Blend:</span> <strong>{selectedYarnForIssue.countNe} · {selectedYarnForIssue.yarnType}</strong></div>
                <div><span className="text-slate-500">Available Stock:</span> <strong className="font-mono text-emerald-700">{selectedYarnForIssue.currentStockKg} kg</strong></div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Quantity to Issue (kg)
                </label>
                <input
                  type="number"
                  max={selectedYarnForIssue.currentStockKg}
                  min={1}
                  value={issueQuantity}
                  onChange={(e) => setIssueQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Destination Loom / Shed
                </label>
                <select
                  value={issueDestination}
                  onChange={(e) => setIssueDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="Weaving Shed A (Looms L-101/L-102 Poplin)">Weaving Shed A · Air Jet Looms L-101/L-102</option>
                  <option value="Weaving Shed A (Looms L-103/L-104 Oxford)">Weaving Shed A · Air Jet Looms L-103/L-104</option>
                  <option value="Weaving Shed B (Looms L-107/L-108 Twill)">Weaving Shed B · Rapier Looms L-107/L-108</option>
                  <option value="Warp Sizing Department (Beamer 01)">Warp Sizing Department · Beamer 01</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Receive Inbound Yarn */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Receive Inbound Yarn Shipment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Log arrival of fresh yarn cones into central inventory storage.
            </p>

            <form onSubmit={handleConfirmReceive} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Count (Ne)</label>
                  <input
                    type="text"
                    value={newCountNe}
                    onChange={(e) => setNewCountNe(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Lot Number</label>
                  <input
                    type="text"
                    value={newLotNumber}
                    onChange={(e) => setNewLotNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Yarn Description & Fiber Type</label>
                <input
                  type="text"
                  value={newYarnType}
                  onChange={(e) => setNewYarnType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Spinning Mill / Supplier</label>
                <input
                  type="text"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={newStockKg}
                    onChange={(e) => setNewStockKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Min Safety (kg)</label>
                  <input
                    type="number"
                    value={newSafetyStockKg}
                    onChange={(e) => setNewSafetyStockKg(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Unit Cost ($/kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Warehouse Storage Bin</label>
                <input
                  type="text"
                  value={newStorageBin}
                  onChange={(e) => setNewStorageBin(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReceiveModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Receive Inbound Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
