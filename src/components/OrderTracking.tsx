import React, { useState } from 'react';
import {
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  FileText,
  DollarSign
} from 'lucide-react';
import type { ProductionOrder, OrderStatus, OrderPriority } from '../types/textile';

interface OrderTrackingProps {
  orders: ProductionOrder[];
  onUpdateOrder: (orderId: string, updates: Partial<ProductionOrder>) => Promise<void>;
  onOpenNewOrder: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orders,
  onUpdateOrder,
  onOpenNewOrder
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_weaving' | 'delayed' | 'finished'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high' | 'normal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(orders[0] || null);

  const STAGES = [
    'Yarn Sizing',
    'Warping',
    'Weaving',
    'Inspection',
    'Finishing',
    'Ready for Dispatch'
  ] as const;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && order.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = order.orderCode.toLowerCase().includes(q);
      const matchCust = order.customerName.toLowerCase().includes(q);
      const matchFab = order.fabricName.toLowerCase().includes(q) || order.construction.toLowerCase().includes(q);
      if (!matchCode && !matchCust && !matchFab) return false;
    }
    return true;
  });

  const getPriorityBadge = (p: OrderPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Urgent</span>;
      case 'high':
        return <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">High</span>;
      default:
        return <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Normal</span>;
    }
  };

  const getStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'in_weaving':
        return <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">In Weaving</span>;
      case 'delayed':
        return <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Delayed / Risk</span>;
      case 'finished':
        return <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Finished</span>;
      default:
        return <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Scheduled</span>;
    }
  };

  const handleStageChange = async (order: ProductionOrder, nextStage: typeof STAGES[number]) => {
    await onUpdateOrder(order.id, { currentStage: nextStage });
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...order, currentStage: nextStage });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Order Tracking & Delivery Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end fabric lot traceability from sizing and beam warping to weaving, ASTM inspection, and dispatch.
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap self-start sm:self-auto shadow-sm"
        >
          + Create Production Order
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('in_weaving')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'in_weaving' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Weaving
          </button>
          <button
            onClick={() => setStatusFilter('delayed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'delayed' ? 'bg-white text-rose-700 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delayed ({orders.filter(o => o.status === 'delayed').length})
          </button>
          <button
            onClick={() => setStatusFilter('finished')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'finished' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, customer, fabric spec..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900"
          />
        </div>
      </div>

      {/* Main Grid: Orders Table on Left, Order Detail Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List Table (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Order #</th>
                  <th className="py-2.5 px-4 font-semibold">Customer / Fabric</th>
                  <th className="py-2.5 px-4 font-semibold">Stage</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Meters Progress</th>
                  <th className="py-2.5 px-4 font-semibold">Looms</th>
                  <th className="py-2.5 px-4 font-semibold">Deadline</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => {
                  const progressPct = Math.round((order.metersProduced / order.totalMetersOrdered) * 100);
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-100/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">{order.orderCode}</div>
                        <div className="mt-0.5">{getPriorityBadge(order.priority)}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{order.fabricName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{order.construction}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {order.currentStage}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-semibold text-slate-900 tabular-nums">
                          {order.metersProduced.toLocaleString()} / {order.totalMetersOrdered.toLocaleString()}m
                        </div>
                        <div className="w-24 ml-auto bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${order.status === 'delayed' ? 'bg-rose-500' : 'bg-slate-800'}`}
                            style={{ width: `${Math.min(100, progressPct)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 tabular-nums">
                          {progressPct}% completed
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {order.assignedLooms.map(l => (
                            <span key={l} className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                              {l}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] tabular-nums text-slate-700">
                        {order.deliveryDate}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No orders found matching criteria.
            </div>
          )}
        </div>

        {/* Selected Order Detail Panel (1 Column) */}
        {selectedOrder ? (
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-slate-900">
                  {selectedOrder.orderCode}
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedOrder.customerName}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedOrder.fabricName} · {selectedOrder.weavePattern}
              </p>
            </div>

            {/* Delay Risk Alert if flagged */}
            {selectedOrder.status === 'delayed' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Production Delay Alert</span>
                </div>
                <div className="mt-1 leading-snug">
                  Current production run is lagging behind target delivery date ({selectedOrder.deliveryDate}). Looms experiencing excessive yarn breaks.
                </div>
                <button
                  onClick={() => onUpdateOrder(selectedOrder.id, { priority: 'urgent' })}
                  className="mt-2 px-2.5 py-1 text-[11px] font-semibold text-white bg-rose-700 rounded hover:bg-rose-800 transition-colors"
                >
                  Escalate to Urgent Priority
                </button>
              </div>
            )}

            {/* Production Stage Stepper */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Production Stage Progression
              </div>
              <div className="space-y-1.5">
                {STAGES.map((stg, idx) => {
                  const currentIdx = STAGES.indexOf(selectedOrder.currentStage);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <button
                      key={stg}
                      onClick={() => handleStageChange(selectedOrder, stg)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                        isCurrent
                          ? 'bg-slate-900 text-white font-semibold'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-800 font-medium hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-mono">
                            {idx + 1}
                          </span>
                        )}
                        <span>{stg}</span>
                      </div>
                      {isCurrent && <span className="text-[10px] text-emerald-300 font-mono">ACTIVE</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality Breakdown Metrics */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-xs">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span>Fabric QC Yield</span>
                <span className="font-mono text-slate-500 tabular-nums">
                  {selectedOrder.metersInspected.toLocaleString()}m inspected
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">Grade A</div>
                  <div className="font-bold text-emerald-600 tabular-nums">
                    {selectedOrder.metersPassedGradeA.toLocaleString()}m
                  </div>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">Grade B</div>
                  <div className="font-bold text-amber-600 tabular-nums">
                    {selectedOrder.metersPassedGradeB.toLocaleString()}m
                  </div>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">Rejected</div>
                  <div className="font-bold text-rose-600 tabular-nums">
                    {selectedOrder.metersRejected.toLocaleString()}m
                  </div>
                </div>
              </div>
            </div>

            {/* Commercial & Technical Specs */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Construction:</span>
                <span className="text-slate-900 font-medium">{selectedOrder.construction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Warp Yarn BOM:</span>
                <span className="text-slate-900 font-medium tabular-nums">{selectedOrder.bomYarnWarpKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Weft Yarn BOM:</span>
                <span className="text-slate-900 font-medium tabular-nums">{selectedOrder.bomYarnWeftKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contract Value:</span>
                <span className="text-emerald-700 font-bold tabular-nums">
                  ${Math.round(selectedOrder.totalMetersOrdered * selectedOrder.unitPricePerMeter).toLocaleString()}
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded border border-amber-100">
                <span className="font-semibold text-slate-900">Mill Notes:</span> {selectedOrder.notes}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
            Select an order to view production details.
          </div>
        )}
      </div>
    </div>
  );
};
