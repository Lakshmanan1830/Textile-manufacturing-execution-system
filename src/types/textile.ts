export type LoomType = 'Air Jet' | 'Rapier' | 'Water Jet' | 'Projectile';
export type LoomStatus = 'running' | 'warp_stop' | 'weft_stop' | 'doffing' | 'knotting' | 'maintenance' | 'idle';
export type OrderStatus = 'scheduled' | 'in_weaving' | 'inspection' | 'finished' | 'delayed';
export type OrderPriority = 'urgent' | 'high' | 'normal';
export type FabricGrade = 'Grade A' | 'Grade B' | 'Reject';
export type WeavePattern = 'Plain' | 'Twill 2/1' | 'Twill 3/1' | 'Satin 4/1' | 'Oxford' | 'Dobby' | 'Herringbone';

export type UserRole = 'production_manager' | 'loom_technician' | 'qc_inspector' | 'inventory_lead';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  badgeNumber: string;
  shift: 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Shift C (22:00 - 06:00)';
  plantLocation: string;
}

export interface LoomDef {
  id: string;
  code: string; // e.g. "L-101"
  name: string; // e.g. "Tsudakoma ZAX-9200i"
  type: LoomType;
  shed: 'Shed A - Air Jet (Fine Apparel)' | 'Shed B - Rapier (Heavy & Suiting)';
  status: LoomStatus;
  rpm: number;
  standardRpm: number;
  efficiencyPercent: number;
  reedWidthInches: number;
  currentOrderCode: string;
  customerName: string;
  fabricSpec: string;
  weavePattern: WeavePattern;
  currentMetersWoven: number;
  targetMeters: number;
  warpYarn: string; // e.g. "40s Combed Cotton"
  weftYarn: string; // e.g. "40s Combed Cotton"
  operatorName: string;
  shift: 'Shift A' | 'Shift B' | 'Shift C';
  todayStops: {
    warp: number;
    weft: number;
    other: number;
  };
  lastStopReason?: string;
  lastStopTime?: string;
  temperatureC: number;
  vibrationMmSec: number;
  beamLengthRemainingMeters: number;
}

export interface ProductionOrder {
  id: string;
  orderCode: string; // e.g. "ORD-2026-881"
  customerName: string;
  fabricCode: string; // e.g. "FAB-C100-TW"
  fabricName: string;
  construction: string; // e.g. "40s x 40s / 132 x 72 / 63\""
  weavePattern: WeavePattern;
  widthInches: number;
  totalMetersOrdered: number;
  metersProduced: number;
  metersInspected: number;
  metersPassedGradeA: number;
  metersPassedGradeB: number;
  metersRejected: number;
  status: OrderStatus;
  priority: OrderPriority;
  deliveryDate: string;
  startDate: string;
  assignedLooms: string[]; // loom codes
  bomYarnWarpKg: number;
  bomYarnWeftKg: number;
  yarnAvailable: boolean;
  unitPricePerMeter: number;
  notes: string;
  currentStage: 'Yarn Sizing' | 'Warping' | 'Weaving' | 'Inspection' | 'Finishing' | 'Ready for Dispatch';
}

export interface WeavePlan {
  id: string;
  planCode: string;
  orderId: string;
  orderCode: string;
  fabricSpec: string;
  assignedLoomId: string;
  assignedLoomCode: string;
  warpCountNe: string;
  weftCountNe: string;
  epi: number; // Ends Per Inch
  ppi: number; // Picks Per Inch
  totalEnds: number;
  reedSpaceInches: number;
  warpCrimpPercent: number;
  weftCrimpPercent: number;
  beamNumber: string;
  beamLengthMeters: number;
  plannedDailyOutputMeters: number;
  startDate: string;
  estimatedEndDate: string;
  status: 'active' | 'scheduled' | 'completed';
}

export interface DefectItem {
  id: string;
  yardPosition: number;
  defectType: 'Warp Break / Float' | 'Broken Pick' | 'Slub / Thick End' | 'Oil / Grease Spot' | 'Reed Mark' | 'Selvedge Tear' | 'Snarl / Loop' | 'Contamination';
  severity: 1 | 2 | 3 | 4; // ASTM D5430 point value
  points: number;
  description: string;
  xPositionPercent: number; // 0-100% across fabric width
}

export interface InspectionRoll {
  id: string;
  rollNumber: string; // e.g. "ROLL-4821"
  orderId: string;
  orderCode: string;
  loomCode: string;
  fabricSpec: string;
  widthInches: number;
  lengthYards: number;
  grossWeightKg: number;
  totalPoints: number;
  pointsPer100SqYards: number;
  grade: FabricGrade;
  inspectedAt: string;
  inspectorName: string;
  defects: DefectItem[];
  remarks: string;
  certificateNumber: string;
  verified: boolean;
}

export interface YarnInventoryItem {
  id: string;
  itemCode: string; // e.g. "YRN-40C-01"
  yarnType: string;
  countNe: string; // e.g. "40s Ne"
  blend: string; // e.g. "100% Combed Cotton"
  lotNumber: string;
  supplier: string;
  currentStockKg: number;
  allocatedStockKg: number;
  minSafetyStockKg: number;
  conesAvailable: number;
  unitCostPerKg: number;
  storageBin: string;
  reorderAlert: boolean;
  receivedDate: string;
}

export interface GreigeFabricRoll {
  id: string;
  rollCode: string;
  orderCode: string;
  fabricCode: string;
  fabricName: string;
  construction: string;
  widthInches: number;
  lengthMeters: number;
  weightKg: number;
  grade: FabricGrade;
  inspectionRollId?: string;
  storageBin: string;
  status: 'in_warehouse' | 'allocated_to_dyeing' | 'dispatched';
  producedAt: string;
}

export interface OeeMetrics {
  overallOee: number;
  availability: number;
  performance: number;
  quality: number;
  plannedProductionHours: number;
  actualOperatingHours: number;
  idealRunRateRpm: number;
  actualAverageRpm: number;
  totalPicksProduced: number;
  totalMetersProduced: number;
  firstQualityMeters: number;
  stopCausesPareto: Array<{ reason: string; count: number; downtimeMinutes: number; percentage: number }>;
}

export interface AlertNotification {
  id: string;
  loomCode: string;
  type: 'warp_stop' | 'weft_stop' | 'critical_delay' | 'low_yarn' | 'high_defect_rate' | 'maintenance_due';
  title: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'info';
  acknowledged: boolean;
}
