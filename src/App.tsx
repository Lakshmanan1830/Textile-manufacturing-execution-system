import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { LoomMonitoring } from './components/LoomMonitoring';
import { ProductionPlanning } from './components/ProductionPlanning';
import { OrderTracking } from './components/OrderTracking';
import { QualityInspection } from './components/QualityInspection';
import { InventoryVisibility } from './components/InventoryVisibility';
import { OeeAnalytics } from './components/OeeAnalytics';
import { NewOrderModal } from './components/NewOrderModal';
import { NewInspectionModal } from './components/NewInspectionModal';
import { LoomDetailModal } from './components/LoomDetailModal';
import { QcCertificateModal } from './components/QcCertificateModal';

import type {
  LoomDef,
  ProductionOrder,
  WeavePlan,
  InspectionRoll,
  YarnInventoryItem,
  GreigeFabricRoll,
  OeeMetrics,
  AlertNotification,
  UserSession,
  DefectItem
} from './types/textile';

export default function App() {
  // User Session (Initialized with Production Director for immediate usability, full login page accessible via Sign Out / Switch)
  const [user, setUser] = useState<UserSession | null>({
    id: 'usr-1',
    name: 'Ashwin Vance',
    email: 'ashwin.vance@texflow.internal',
    role: 'production_manager',
    roleTitle: 'Production Director',
    badgeNumber: 'MGR-0412',
    shift: 'Shift A (06:00 - 14:00)',
    plantLocation: 'Plant 01 · Primary Weaving Shed'
  });

  const [activeTab, setActiveTab] = useState<'looms' | 'planning' | 'orders' | 'quality' | 'inventory' | 'oee'>('looms');

  // Application Data States
  const [looms, setLooms] = useState<LoomDef[]>([]);
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [plans, setPlans] = useState<WeavePlan[]>([]);
  const [inspections, setInspections] = useState<InspectionRoll[]>([]);
  const [yarnStock, setYarnStock] = useState<YarnInventoryItem[]>([]);
  const [greigeStock, setGreigeStock] = useState<GreigeFabricRoll[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [metrics, setMetrics] = useState<OeeMetrics | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulation speed (1x, 5x, 0 = paused)
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Modal States
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const [selectedLoomForDetail, setSelectedLoomForDetail] = useState<LoomDef | null>(null);
  const [selectedRollForCert, setSelectedRollForCert] = useState<InspectionRoll | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch all endpoints from Express backend
  const fetchAllData = useCallback(async () => {
    try {
      const [
        loomsRes,
        ordersRes,
        plansRes,
        inspectionsRes,
        yarnRes,
        greigeRes,
        alertsRes,
        analyticsRes
      ] = await Promise.all([
        fetch('/api/looms').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/plans').then(r => r.json()),
        fetch('/api/inspections').then(r => r.json()),
        fetch('/api/inventory/yarn').then(r => r.json()),
        fetch('/api/inventory/greige').then(r => r.json()),
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json())
      ]);

      if (loomsRes.success) setLooms(loomsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (plansRes.success) setPlans(plansRes.data);
      if (inspectionsRes.success) setInspections(inspectionsRes.data);
      if (yarnRes.success) setYarnStock(yarnRes.data);
      if (greigeRes.success) setGreigeStock(greigeRes.data);
      if (alertsRes.success) setAlerts(alertsRes.data);
      if (analyticsRes.success) setMetrics(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // Refresh interval adjusted by simulation speed
    const pollTime = simulationSpeed === 5 ? 4000 : simulationSpeed === 1 ? 12000 : 60000;
    const interval = setInterval(fetchAllData, pollTime);
    return () => clearInterval(interval);
  }, [fetchAllData, simulationSpeed]);

  // Handler: Loom Action (Resume, Stop, Trigger Break, Doff, etc.)
  const handleLoomAction = async (loomId: string, action: string, payload?: any) => {
    try {
      const res = await fetch(`/api/looms/${loomId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      const data = await res.json();
      if (data.success) {
        setLooms(prev => prev.map(l => (l.id === data.data.id ? data.data : l)));
        if (selectedLoomForDetail?.id === data.data.id) {
          setSelectedLoomForDetail(data.data);
        }
        showToast(data.message || `Loom action executed: ${action}`);
        // Refresh alerts and analytics
        fetch('/api/alerts').then(r => r.json()).then(r => r.success && setAlerts(r.data));
        fetch('/api/analytics').then(r => r.json()).then(r => r.success && setMetrics(r.data));
      }
    } catch (err) {
      console.error('Loom action failed:', err);
    }
  };

  // Handler: Trigger random stoppage on a running loom
  const handleTriggerRandomStop = async () => {
    const running = looms.filter(l => l.status === 'running');
    if (running.length === 0) {
      showToast('All looms are currently stopped.');
      return;
    }
    const targetLoom = running[Math.floor(Math.random() * running.length)];
    await handleLoomAction(targetLoom.id, 'trigger_warp_stop');
    showToast(`Simulated Warp Break triggered on Loom ${targetLoom.code}.`);
  };

  // Handler: Acknowledge alert
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/ack`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, acknowledged: true } : a)));
        showToast('Alert acknowledged by operator.');
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  // Handler: Toggle simulation speed
  const handleToggleSimSpeed = () => {
    if (simulationSpeed === 1) {
      setSimulationSpeed(5);
      showToast('Simulation rate set to 5x Accelerated.');
    } else if (simulationSpeed === 5) {
      setSimulationSpeed(0);
      showToast('Live telemetry simulation Paused.');
    } else {
      setSimulationSpeed(1);
      showToast('Simulation rate set to 1x Real-Time.');
    }
  };

  // Handler: Export CSV Report
  const handleExportCsv = () => {
    const rows = [
      ['TexFlow MES Manufacturing Report', new Date().toISOString()],
      [],
      ['--- ACTIVE LOOMS ---'],
      ['Loom Code', 'Model', 'Status', 'RPM', 'Efficiency %', 'Current Meters', 'Target Meters', 'Order #', 'Weaver'],
      ...looms.map(l => [
        l.code,
        l.name,
        l.status,
        l.rpm.toString(),
        `${l.efficiencyPercent}%`,
        l.currentMetersWoven.toString(),
        l.targetMeters.toString(),
        l.currentOrderCode,
        l.operatorName
      ]),
      [],
      ['--- PRODUCTION ORDERS ---'],
      ['Order Code', 'Customer', 'Fabric', 'Ordered (m)', 'Produced (m)', 'Stage', 'Delivery Deadline', 'Status'],
      ...orders.map(o => [
        o.orderCode,
        o.customerName,
        o.fabricName,
        o.totalMetersOrdered.toString(),
        o.metersProduced.toString(),
        o.currentStage,
        o.deliveryDate,
        o.status
      ]),
      [],
      ['--- ASTM D5430 INSPECTIONS ---'],
      ['Roll #', 'Order #', 'Loom', 'Length (yds)', 'Total Pts', 'Pts / 100 sq yd', 'Grade', 'Inspector'],
      ...inspections.map(i => [
        i.rollNumber,
        i.orderCode,
        i.loomCode,
        i.lengthYards.toString(),
        i.totalPoints.toString(),
        i.pointsPer100SqYards.toString(),
        i.grade,
        i.inspectorName
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TexFlow_MES_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Factory report exported to CSV.');
  };

  // Handler: Create Order
  const handleCreateOrder = async (orderData: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => [data.data, ...prev]);
        showToast(`Production Order ${data.data.orderCode} successfully created.`);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  // Handler: Update Order
  const handleUpdateOrder = async (orderId: string, updates: Partial<ProductionOrder>) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o.id === data.data.id ? data.data : o)));
        showToast(`Order ${data.data.orderCode} updated.`);
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  // Handler: Create Weave Plan
  const handleCreatePlan = async (planData: Partial<WeavePlan>) => {
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      const data = await res.json();
      if (data.success) {
        setPlans(prev => [data.data, ...prev]);
        showToast(`Weave Plan ${data.data.planCode} scheduled on Loom ${data.data.assignedLoomCode}.`);
      }
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  // Handler: Submit Quality Inspection
  const handleSubmitInspection = async (inspData: any) => {
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inspData)
      });
      const data = await res.json();
      if (data.success) {
        setInspections(prev => [data.data, ...prev]);
        if (data.greige) {
          setGreigeStock(prev => [data.greige, ...prev]);
        }
        showToast(`Inspection Roll ${data.data.rollNumber} recorded as ${data.data.grade}.`);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to submit inspection:', err);
    }
  };

  // Handler: Pin defect onto inspection roll
  const handleUpdateRollDefects = (rollId: string, defects: DefectItem[]) => {
    setInspections(prev => prev.map(r => {
      if (r.id === rollId) {
        const totalPts = defects.reduce((acc, d) => acc + d.points, 0);
        const ptsPer100 = Math.round(((totalPts * 3600) / (r.widthInches * r.lengthYards)) * 100) / 100;
        let grade: 'Grade A' | 'Grade B' | 'Reject' = 'Grade A';
        if (ptsPer100 > 40) grade = 'Reject';
        else if (ptsPer100 > 20) grade = 'Grade B';
        return {
          ...r,
          defects,
          totalPoints: totalPts,
          pointsPer100SqYards: ptsPer100,
          grade
        };
      }
      return r;
    }));
    showToast('Cloth defect pinned. ASTM D5430 score recalculated.');
  };

  // Handler: Issue Yarn to Loom
  const handleIssueYarn = async (yarnId: string, quantityKg: number, destination: string) => {
    try {
      const res = await fetch(`/api/inventory/yarn/${yarnId}/issue`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityKg, destination })
      });
      const data = await res.json();
      if (data.success) {
        setYarnStock(prev => prev.map(y => (y.id === data.data.id ? data.data : y)));
        showToast(data.message || `Issued ${quantityKg} kg yarn.`);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to issue yarn:', err);
    }
  };

  // Handler: Receive Inbound Yarn
  const handleReceiveYarn = async (yarnData: Partial<YarnInventoryItem>) => {
    try {
      const res = await fetch('/api/inventory/yarn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yarnData)
      });
      const data = await res.json();
      if (data.success) {
        setYarnStock(prev => [data.data, ...prev]);
        showToast(`Received ${data.data.currentStockKg} kg of ${data.data.countNe} into inventory.`);
      }
    } catch (err) {
      console.error('Failed to receive yarn:', err);
    }
  };

  // Handler: Dispatch Greige Roll
  const handleDispatchGreige = async (rollId: string) => {
    try {
      const res = await fetch(`/api/inventory/greige/${rollId}/dispatch`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setGreigeStock(prev => prev.map(g => (g.id === data.data.id ? data.data : g)));
        showToast(data.message || 'Fabric roll dispatched.');
      }
    } catch (err) {
      console.error('Failed to dispatch greige:', err);
    }
  };

  // If user signed out, show the dedicated industrial LoginPage
  if (!user) {
    return (
      <LoginPage
        onLogin={(session) => {
          setUser(session);
          showToast(`Welcome back, ${session.name}. Terminal authenticated for ${session.shift.split(' ')[0]}.`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alerts={alerts}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onOpenNewOrder={() => setIsNewOrderOpen(true)}
        onTriggerRandomStop={handleTriggerRandomStop}
        onRefreshData={fetchAllData}
        user={user}
        onLogout={() => {
          setUser(null);
          showToast('Signed out of terminal.');
        }}
        onExportCsv={handleExportCsv}
        isSimulating={simulationSpeed > 0}
        simulationSpeed={simulationSpeed}
        onToggleSimSpeed={handleToggleSimSpeed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            <div className="mt-3 text-xs text-slate-500 font-mono">
              Connecting to Weaving Shed Telemetry Bus...
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'looms' && (
              <LoomMonitoring
                looms={looms}
                alerts={alerts}
                onLoomAction={handleLoomAction}
                onSelectLoom={(loom) => setSelectedLoomForDetail(loom)}
              />
            )}

            {activeTab === 'planning' && (
              <ProductionPlanning
                plans={plans}
                orders={orders}
                looms={looms}
                onCreatePlan={handleCreatePlan}
              />
            )}

            {activeTab === 'orders' && (
              <OrderTracking
                orders={orders}
                onUpdateOrder={handleUpdateOrder}
                onOpenNewOrder={() => setIsNewOrderOpen(true)}
              />
            )}

            {activeTab === 'quality' && (
              <QualityInspection
                inspections={inspections}
                onOpenNewInspection={() => setIsNewInspectionOpen(true)}
                onViewCertificate={(roll) => setSelectedRollForCert(roll)}
                onUpdateRollDefects={handleUpdateRollDefects}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryVisibility
                yarnStock={yarnStock}
                greigeStock={greigeStock}
                onIssueYarn={handleIssueYarn}
                onReceiveYarn={handleReceiveYarn}
                onDispatchGreige={handleDispatchGreige}
              />
            )}

            {activeTab === 'oee' && metrics && (
              <OeeAnalytics
                metrics={metrics}
                looms={looms}
              />
            )}
          </>
        )}
      </main>

      {/* Clean Factory Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">TexFlow MES</span>
            <span aria-hidden="true">·</span>
            <span>Textile Manufacturing Execution System</span>
            <span aria-hidden="true">·</span>
            <span>ASTM D5430 & ISO 9001 Compliant</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Authenticated: {user.name} ({user.badgeNumber})</span>
            <span>·</span>
            <span>12 High-Speed Looms Online</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        looms={looms}
        onSubmitOrder={handleCreateOrder}
      />

      <NewInspectionModal
        isOpen={isNewInspectionOpen}
        onClose={() => setIsNewInspectionOpen(false)}
        looms={looms}
        orders={orders}
        onSubmitInspection={handleSubmitInspection}
      />

      <LoomDetailModal
        loom={selectedLoomForDetail}
        onClose={() => setSelectedLoomForDetail(null)}
        onLoomAction={handleLoomAction}
      />

      <QcCertificateModal
        roll={selectedRollForCert}
        onClose={() => setSelectedRollForCert(null)}
      />
    </div>
  );
}
