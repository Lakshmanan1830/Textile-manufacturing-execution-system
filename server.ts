import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  LoomDef,
  ProductionOrder,
  WeavePlan,
  InspectionRoll,
  YarnInventoryItem,
  GreigeFabricRoll,
  OeeMetrics,
  AlertNotification
} from './src/types/textile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial State Data Store
let looms: LoomDef[] = [
  {
    id: 'loom-101',
    code: 'L-101',
    name: 'Picanol OmniPlus-i (Air Jet)',
    type: 'Air Jet',
    shed: 'Shed A - Air Jet (Fine Apparel)',
    status: 'running',
    rpm: 820,
    standardRpm: 850,
    efficiencyPercent: 93.4,
    reedWidthInches: 75,
    currentOrderCode: 'ORD-2026-881',
    customerName: 'Nordic Apparel Co.',
    fabricSpec: '40s Combed x 40s Combed / 132x72 / 63" Poplin',
    weavePattern: 'Plain',
    currentMetersWoven: 1420,
    targetMeters: 5000,
    warpYarn: '40s Ne Combed Compact Cotton',
    weftYarn: '40s Ne Combed Compact Cotton',
    operatorName: 'David K. (Weaver #14)',
    shift: 'Shift A',
    todayStops: { warp: 2, weft: 3, other: 0 },
    temperatureC: 24.2,
    vibrationMmSec: 1.1,
    beamLengthRemainingMeters: 3580,
  },
  {
    id: 'loom-102',
    code: 'L-102',
    name: 'Picanol OmniPlus-i (Air Jet)',
    type: 'Air Jet',
    shed: 'Shed A - Air Jet (Fine Apparel)',
    status: 'running',
    rpm: 840,
    standardRpm: 850,
    efficiencyPercent: 95.8,
    reedWidthInches: 75,
    currentOrderCode: 'ORD-2026-881',
    customerName: 'Nordic Apparel Co.',
    fabricSpec: '40s Combed x 40s Combed / 132x72 / 63" Poplin',
    weavePattern: 'Plain',
    currentMetersWoven: 1890,
    targetMeters: 5000,
    warpYarn: '40s Ne Combed Compact Cotton',
    weftYarn: '40s Ne Combed Compact Cotton',
    operatorName: 'David K. (Weaver #14)',
    shift: 'Shift A',
    todayStops: { warp: 1, weft: 2, other: 0 },
    temperatureC: 24.8,
    vibrationMmSec: 1.2,
    beamLengthRemainingMeters: 3110,
  },
  {
    id: 'loom-103',
    code: 'L-103',
    name: 'Tsudakoma ZAX-9200i (Air Jet)',
    type: 'Air Jet',
    shed: 'Shed A - Air Jet (Fine Apparel)',
    status: 'warp_stop',
    rpm: 0,
    standardRpm: 800,
    efficiencyPercent: 78.2,
    reedWidthInches: 75,
    currentOrderCode: 'ORD-2026-883',
    customerName: 'Sovereign Shirting Ltd',
    fabricSpec: '50s x 50s / 144x76 / 58" Royal Oxford',
    weavePattern: 'Oxford',
    currentMetersWoven: 850,
    targetMeters: 3800,
    warpYarn: '50s Ne Egyptian Giza 88 Cotton',
    weftYarn: '50s Ne Egyptian Giza 88 Cotton',
    operatorName: 'Elena Rostova (Weaver #09)',
    shift: 'Shift A',
    todayStops: { warp: 6, weft: 4, other: 1 },
    lastStopReason: 'Drop Wire Drop / Warp Yarn Break at Harness 4',
    lastStopTime: '3 mins ago',
    temperatureC: 25.1,
    vibrationMmSec: 0.0,
    beamLengthRemainingMeters: 2950,
  },
  {
    id: 'loom-104',
    code: 'L-104',
    name: 'Tsudakoma ZAX-9200i (Air Jet)',
    type: 'Air Jet',
    shed: 'Shed A - Air Jet (Fine Apparel)',
    status: 'running',
    rpm: 810,
    standardRpm: 800,
    efficiencyPercent: 91.0,
    reedWidthInches: 75,
    currentOrderCode: 'ORD-2026-883',
    customerName: 'Sovereign Shirting Ltd',
    fabricSpec: '50s x 50s / 144x76 / 58" Royal Oxford',
    weavePattern: 'Oxford',
    currentMetersWoven: 2150,
    targetMeters: 3800,
    warpYarn: '50s Ne Egyptian Giza 88 Cotton',
    weftYarn: '50s Ne Egyptian Giza 88 Cotton',
    operatorName: 'Elena Rostova (Weaver #09)',
    shift: 'Shift A',
    todayStops: { warp: 3, weft: 1, other: 0 },
    temperatureC: 24.6,
    vibrationMmSec: 1.3,
    beamLengthRemainingMeters: 1650,
  },
  {
    id: 'loom-105',
    code: 'L-105',
    name: 'Toyota JAT810 (Air Jet)',
    type: 'Air Jet',
    shed: 'Shed A - Air Jet (Fine Apparel)',
    status: 'running',
    rpm: 775,
    standardRpm: 790,
    efficiencyPercent: 89.5,
    reedWidthInches: 85,
    currentOrderCode: 'ORD-2026-884',
    customerName: 'Himalaya Home Textiles',
    fabricSpec: '60s x 60s / 173x120 / 108" Satin 4/1 Bedding',
    weavePattern: 'Satin 4/1',
    currentMetersWoven: 3200,
    targetMeters: 8000,
    warpYarn: '60s Ne Supima Combed Cotton',
    weftYarn: '60s Ne Supima Combed Cotton',
    operatorName: 'Marco Silva (Weaver #22)',
    shift: 'Shift A',
    todayStops: { warp: 4, weft: 5, other: 0 },
    temperatureC: 25.5,
    vibrationMmSec: 1.4,
    beamLengthRemainingMeters: 4800,
  },
  {
    id: 'loom-106',
    code: 'L-106',
    name: 'Toyota JAT810 (Air Jet)',
    type: 'Air Jet',
    shed: 'Shed A - Air Jet (Fine Apparel)',
    status: 'weft_stop',
    rpm: 0,
    standardRpm: 790,
    efficiencyPercent: 84.1,
    reedWidthInches: 85,
    currentOrderCode: 'ORD-2026-884',
    customerName: 'Himalaya Home Textiles',
    fabricSpec: '60s x 60s / 173x120 / 108" Satin 4/1 Bedding',
    weavePattern: 'Satin 4/1',
    currentMetersWoven: 2980,
    targetMeters: 8000,
    warpYarn: '60s Ne Supima Combed Cotton',
    weftYarn: '60s Ne Supima Combed Cotton',
    operatorName: 'Marco Silva (Weaver #22)',
    shift: 'Shift A',
    todayStops: { warp: 2, weft: 7, other: 1 },
    lastStopReason: 'Optical Weft Sensor Stop - Short Pick detected',
    lastStopTime: '1 min ago',
    temperatureC: 25.2,
    vibrationMmSec: 0.1,
    beamLengthRemainingMeters: 5020,
  },
  {
    id: 'loom-107',
    code: 'L-107',
    name: 'Picanol OptiMax-i (Rapier)',
    type: 'Rapier',
    shed: 'Shed B - Rapier (Heavy & Suiting)',
    status: 'running',
    rpm: 620,
    standardRpm: 630,
    efficiencyPercent: 92.8,
    reedWidthInches: 75,
    currentOrderCode: 'ORD-2026-882',
    customerName: 'Calico Garments Ltd',
    fabricSpec: '2/30s PV x 2/30s PV / 68x56 / 58" Twill 2/1',
    weavePattern: 'Twill 2/1',
    currentMetersWoven: 4100,
    targetMeters: 6500,
    warpYarn: '2/30s Poly-Viscose 65/35',
    weftYarn: '2/30s Poly-Viscose 65/35',
    operatorName: 'Tariq Mansour (Weaver #04)',
    shift: 'Shift A',
    todayStops: { warp: 1, weft: 2, other: 0 },
    temperatureC: 26.0,
    vibrationMmSec: 1.5,
    beamLengthRemainingMeters: 2400,
  },
  {
    id: 'loom-108',
    code: 'L-108',
    name: 'Picanol OptiMax-i (Rapier)',
    type: 'Rapier',
    shed: 'Shed B - Rapier (Heavy & Suiting)',
    status: 'running',
    rpm: 625,
    standardRpm: 630,
    efficiencyPercent: 94.2,
    reedWidthInches: 75,
    currentOrderCode: 'ORD-2026-882',
    customerName: 'Calico Garments Ltd',
    fabricSpec: '2/30s PV x 2/30s PV / 68x56 / 58" Twill 2/1',
    weavePattern: 'Twill 2/1',
    currentMetersWoven: 4350,
    targetMeters: 6500,
    warpYarn: '2/30s Poly-Viscose 65/35',
    weftYarn: '2/30s Poly-Viscose 65/35',
    operatorName: 'Tariq Mansour (Weaver #04)',
    shift: 'Shift A',
    todayStops: { warp: 0, weft: 3, other: 0 },
    temperatureC: 25.8,
    vibrationMmSec: 1.4,
    beamLengthRemainingMeters: 2150,
  },
  {
    id: 'loom-109',
    code: 'L-109',
    name: 'Itema R9500-2 (Rapier)',
    type: 'Rapier',
    shed: 'Shed B - Rapier (Heavy & Suiting)',
    status: 'doffing',
    rpm: 0,
    standardRpm: 610,
    efficiencyPercent: 82.0,
    reedWidthInches: 85,
    currentOrderCode: 'ORD-2026-885',
    customerName: 'Equinox Workwear Corp',
    fabricSpec: '10s O.E. x 10s O.E. / 72x42 / 60" 3/1 Heavy Drill',
    weavePattern: 'Twill 3/1',
    currentMetersWoven: 2400,
    targetMeters: 4500,
    warpYarn: '10s Open End Ring Cotton',
    weftYarn: '10s Open End Ring Cotton',
    operatorName: 'Chen Wei (Weaver #17)',
    shift: 'Shift A',
    todayStops: { warp: 1, weft: 1, other: 2 },
    lastStopReason: 'Fabric Roll Doffing reached 300m batch limit',
    lastStopTime: '8 mins ago',
    temperatureC: 24.1,
    vibrationMmSec: 0.0,
    beamLengthRemainingMeters: 2100,
  },
  {
    id: 'loom-110',
    code: 'L-110',
    name: 'Itema R9500-2 (Rapier)',
    type: 'Rapier',
    shed: 'Shed B - Rapier (Heavy & Suiting)',
    status: 'running',
    rpm: 605,
    standardRpm: 610,
    efficiencyPercent: 90.7,
    reedWidthInches: 85,
    currentOrderCode: 'ORD-2026-885',
    customerName: 'Equinox Workwear Corp',
    fabricSpec: '10s O.E. x 10s O.E. / 72x42 / 60" 3/1 Heavy Drill',
    weavePattern: 'Twill 3/1',
    currentMetersWoven: 2210,
    targetMeters: 4500,
    warpYarn: '10s Open End Ring Cotton',
    weftYarn: '10s Open End Ring Cotton',
    operatorName: 'Chen Wei (Weaver #17)',
    shift: 'Shift A',
    todayStops: { warp: 2, weft: 2, other: 0 },
    temperatureC: 25.0,
    vibrationMmSec: 1.6,
    beamLengthRemainingMeters: 2290,
  },
  {
    id: 'loom-111',
    code: 'L-111',
    name: 'Dornier P2 (Rigid Rapier)',
    type: 'Rapier',
    shed: 'Shed B - Rapier (Heavy & Suiting)',
    status: 'knotting',
    rpm: 0,
    standardRpm: 580,
    efficiencyPercent: 71.5,
    reedWidthInches: 90,
    currentOrderCode: 'ORD-2026-886',
    customerName: 'Atelier Linen Guild',
    fabricSpec: '25s Linen x 25s Linen / 52x48 / 62" Plain Linen',
    weavePattern: 'Plain',
    currentMetersWoven: 120,
    targetMeters: 2800,
    warpYarn: '25s Wet Spun Pure Flax Linen',
    weftYarn: '25s Wet Spun Pure Flax Linen',
    operatorName: 'Knotting Tech Team (Lead: Hans M.)',
    shift: 'Shift A',
    todayStops: { warp: 0, weft: 0, other: 1 },
    lastStopReason: 'Automatic Warp Tying / Knotting Machine in progress (Uster Topmatic)',
    lastStopTime: '15 mins ago',
    temperatureC: 23.8,
    vibrationMmSec: 0.0,
    beamLengthRemainingMeters: 2680,
  },
  {
    id: 'loom-112',
    code: 'L-112',
    name: 'Dornier P2 (Rigid Rapier)',
    type: 'Rapier',
    shed: 'Shed B - Rapier (Heavy & Suiting)',
    status: 'running',
    rpm: 575,
    standardRpm: 580,
    efficiencyPercent: 88.6,
    reedWidthInches: 90,
    currentOrderCode: 'ORD-2026-886',
    customerName: 'Atelier Linen Guild',
    fabricSpec: '25s Linen x 25s Linen / 52x48 / 62" Plain Linen',
    weavePattern: 'Plain',
    currentMetersWoven: 1450,
    targetMeters: 2800,
    warpYarn: '25s Wet Spun Pure Flax Linen',
    weftYarn: '25s Wet Spun Pure Flax Linen',
    operatorName: 'Elena Rostova (Weaver #09)',
    shift: 'Shift A',
    todayStops: { warp: 3, weft: 3, other: 0 },
    temperatureC: 24.9,
    vibrationMmSec: 1.7,
    beamLengthRemainingMeters: 1350,
  }
];

let productionOrders: ProductionOrder[] = [
  {
    id: 'ord-881',
    orderCode: 'ORD-2026-881',
    customerName: 'Nordic Apparel Co.',
    fabricCode: 'FAB-C40-POP',
    fabricName: 'Premium Poplin Cotton',
    construction: '40s Combed x 40s Combed / 132 x 72 / 63" Poplin',
    weavePattern: 'Plain',
    widthInches: 63,
    totalMetersOrdered: 10000,
    metersProduced: 3310,
    metersInspected: 2400,
    metersPassedGradeA: 2320,
    metersPassedGradeB: 60,
    metersRejected: 20,
    status: 'in_weaving',
    priority: 'high',
    deliveryDate: '2026-11-12',
    startDate: '2026-10-18',
    assignedLooms: ['L-101', 'L-102'],
    bomYarnWarpKg: 1840,
    bomYarnWeftKg: 1010,
    yarnAvailable: true,
    unitPricePerMeter: 3.45,
    notes: 'Export standard for autumn shirting collection. Zero oil stains allowed.',
    currentStage: 'Weaving'
  },
  {
    id: 'ord-882',
    orderCode: 'ORD-2026-882',
    customerName: 'Calico Garments Ltd',
    fabricCode: 'FAB-PV30-TW',
    fabricName: 'Executive Suiting Twill',
    construction: '2/30s PV x 2/30s PV / 68 x 56 / 58" Twill 2/1',
    weavePattern: 'Twill 2/1',
    widthInches: 58,
    totalMetersOrdered: 13000,
    metersProduced: 8450,
    metersInspected: 7200,
    metersPassedGradeA: 7080,
    metersPassedGradeB: 95,
    metersRejected: 25,
    status: 'in_weaving',
    priority: 'normal',
    deliveryDate: '2026-11-20',
    startDate: '2026-10-10',
    assignedLooms: ['L-107', 'L-108'],
    bomYarnWarpKg: 2890,
    bomYarnWeftKg: 2380,
    yarnAvailable: true,
    unitPricePerMeter: 4.80,
    notes: 'Anti-wrinkle finish requirement. Color consistency critical across lot.',
    currentStage: 'Weaving'
  },
  {
    id: 'ord-883',
    orderCode: 'ORD-2026-883',
    customerName: 'Sovereign Shirting Ltd',
    fabricCode: 'FAB-C50-OXF',
    fabricName: 'Royal Oxford Luxury',
    construction: '50s x 50s / 144 x 76 / 58" Royal Oxford',
    weavePattern: 'Oxford',
    widthInches: 58,
    totalMetersOrdered: 7600,
    metersProduced: 3000,
    metersInspected: 2100,
    metersPassedGradeA: 2010,
    metersPassedGradeB: 80,
    metersRejected: 10,
    status: 'delayed',
    priority: 'urgent',
    deliveryDate: '2026-11-04',
    startDate: '2026-10-12',
    assignedLooms: ['L-103', 'L-104'],
    bomYarnWarpKg: 1320,
    bomYarnWeftKg: 710,
    yarnAvailable: true,
    unitPricePerMeter: 5.20,
    notes: 'Flagged for warp break delays on L-103. Extra inspection sampling required.',
    currentStage: 'Weaving'
  },
  {
    id: 'ord-884',
    orderCode: 'ORD-2026-884',
    customerName: 'Himalaya Home Textiles',
    fabricCode: 'FAB-C60-SAT',
    fabricName: 'Supima Satin 4/1 Bedding',
    construction: '60s x 60s / 173 x 120 / 108" Satin 4/1',
    weavePattern: 'Satin 4/1',
    widthInches: 108,
    totalMetersOrdered: 16000,
    metersProduced: 6180,
    metersInspected: 5200,
    metersPassedGradeA: 5120,
    metersPassedGradeB: 65,
    metersRejected: 15,
    status: 'in_weaving',
    priority: 'normal',
    deliveryDate: '2026-11-30',
    startDate: '2026-10-14',
    assignedLooms: ['L-105', 'L-106'],
    bomYarnWarpKg: 3450,
    bomYarnWeftKg: 2420,
    yarnAvailable: true,
    unitPricePerMeter: 6.90,
    notes: 'Extra wide reed 108". Check selvedge tension continually.',
    currentStage: 'Weaving'
  },
  {
    id: 'ord-885',
    orderCode: 'ORD-2026-885',
    customerName: 'Equinox Workwear Corp',
    fabricCode: 'FAB-C10-DRL',
    fabricName: 'Heavy Industrial Drill',
    construction: '10s O.E. x 10s O.E. / 72 x 42 / 60" 3/1 Heavy Drill',
    weavePattern: 'Twill 3/1',
    widthInches: 60,
    totalMetersOrdered: 9000,
    metersProduced: 4610,
    metersInspected: 4200,
    metersPassedGradeA: 4090,
    metersPassedGradeB: 90,
    metersRejected: 20,
    status: 'in_weaving',
    priority: 'normal',
    deliveryDate: '2026-11-16',
    startDate: '2026-10-08',
    assignedLooms: ['L-109', 'L-110'],
    bomYarnWarpKg: 3600,
    bomYarnWeftKg: 2100,
    yarnAvailable: true,
    unitPricePerMeter: 4.10,
    notes: 'Heavy duty military and utility apparel spec.',
    currentStage: 'Weaving'
  },
  {
    id: 'ord-886',
    orderCode: 'ORD-2026-886',
    customerName: 'Atelier Linen Guild',
    fabricCode: 'FAB-L25-PLN',
    fabricName: 'Natural European Linen',
    construction: '25s Linen x 25s Linen / 52 x 48 / 62" Plain',
    weavePattern: 'Plain',
    widthInches: 62,
    totalMetersOrdered: 5600,
    metersProduced: 1570,
    metersInspected: 1200,
    metersPassedGradeA: 1140,
    metersPassedGradeB: 50,
    metersRejected: 10,
    status: 'in_weaving',
    priority: 'high',
    deliveryDate: '2026-11-18',
    startDate: '2026-10-20',
    assignedLooms: ['L-111', 'L-112'],
    bomYarnWarpKg: 1220,
    bomYarnWeftKg: 1140,
    yarnAvailable: true,
    unitPricePerMeter: 7.40,
    notes: 'Wet spun flax. High humidity shed required (65% RH).',
    currentStage: 'Weaving'
  }
];

let weavePlans: WeavePlan[] = [
  {
    id: 'plan-101',
    planCode: 'WP-2026-440',
    orderId: 'ord-881',
    orderCode: 'ORD-2026-881',
    fabricSpec: '40s Combed x 40s Combed / 132x72 / 63" Poplin',
    assignedLoomId: 'loom-101',
    assignedLoomCode: 'L-101',
    warpCountNe: '40s Ne',
    weftCountNe: '40s Ne',
    epi: 132,
    ppi: 72,
    totalEnds: 8316,
    reedSpaceInches: 65.5,
    warpCrimpPercent: 7.2,
    weftCrimpPercent: 6.0,
    beamNumber: 'BEAM-CT-892',
    beamLengthMeters: 5000,
    plannedDailyOutputMeters: 750,
    startDate: '2026-10-18',
    estimatedEndDate: '2026-11-02',
    status: 'active'
  },
  {
    id: 'plan-102',
    planCode: 'WP-2026-441',
    orderId: 'ord-882',
    orderCode: 'ORD-2026-882',
    fabricSpec: '2/30s PV x 2/30s PV / 68x56 / 58" Twill 2/1',
    assignedLoomId: 'loom-107',
    assignedLoomCode: 'L-107',
    warpCountNe: '2/30s Ne',
    weftCountNe: '2/30s Ne',
    epi: 68,
    ppi: 56,
    totalEnds: 3944,
    reedSpaceInches: 60.5,
    warpCrimpPercent: 9.4,
    weftCrimpPercent: 7.8,
    beamNumber: 'BEAM-PV-401',
    beamLengthMeters: 6500,
    plannedDailyOutputMeters: 680,
    startDate: '2026-10-10',
    estimatedEndDate: '2026-11-14',
    status: 'active'
  },
  {
    id: 'plan-103',
    planCode: 'WP-2026-442',
    orderId: 'ord-883',
    orderCode: 'ORD-2026-883',
    fabricSpec: '50s x 50s / 144x76 / 58" Royal Oxford',
    assignedLoomId: 'loom-103',
    assignedLoomCode: 'L-103',
    warpCountNe: '50s Ne',
    weftCountNe: '50s Ne',
    epi: 144,
    ppi: 76,
    totalEnds: 8352,
    reedSpaceInches: 60.0,
    warpCrimpPercent: 8.5,
    weftCrimpPercent: 6.8,
    beamNumber: 'BEAM-EG-312',
    beamLengthMeters: 3800,
    plannedDailyOutputMeters: 550,
    startDate: '2026-10-12',
    estimatedEndDate: '2026-11-04',
    status: 'active'
  }
];

let inspectionRolls: InspectionRoll[] = [
  {
    id: 'insp-4819',
    rollNumber: 'ROLL-4819',
    orderId: 'ord-881',
    orderCode: 'ORD-2026-881',
    loomCode: 'L-101',
    fabricSpec: '40s x 40s / 132x72 Poplin',
    widthInches: 63,
    lengthYards: 120,
    grossWeightKg: 21.4,
    totalPoints: 12,
    pointsPer100SqYards: 5.71,
    grade: 'Grade A',
    inspectedAt: '2026-10-25 09:30',
    inspectorName: 'Maria Santos (QC Certified #08)',
    defects: [
      { id: 'def-1', yardPosition: 24, defectType: 'Slub / Thick End', severity: 1, points: 1, description: 'Minor weft slub 1/2 inch', xPositionPercent: 35 },
      { id: 'def-2', yardPosition: 68, defectType: 'Oil / Grease Spot', severity: 2, points: 2, description: 'Small loom lubrication droplet near selvedge', xPositionPercent: 92 },
      { id: 'def-3', yardPosition: 104, defectType: 'Broken Pick', severity: 1, points: 1, description: 'Single pick break caught within 2 picks', xPositionPercent: 48 }
    ],
    remarks: 'Flawless poplin surface. High lustre, tension uniform across beam.',
    certificateNumber: 'QC-2026-9921',
    verified: true
  },
  {
    id: 'insp-4820',
    rollNumber: 'ROLL-4820',
    orderId: 'ord-882',
    orderCode: 'ORD-2026-882',
    loomCode: 'L-107',
    fabricSpec: '2/30s PV x 2/30s PV / 68x56 Twill',
    widthInches: 58,
    lengthYards: 110,
    grossWeightKg: 29.8,
    totalPoints: 18,
    pointsPer100SqYards: 10.15,
    grade: 'Grade A',
    inspectedAt: '2026-10-25 11:15',
    inspectorName: 'Maria Santos (QC Certified #08)',
    defects: [
      { id: 'def-4', yardPosition: 12, defectType: 'Reed Mark', severity: 2, points: 2, description: 'Faint reed mark across 3 inches', xPositionPercent: 20 },
      { id: 'def-5', yardPosition: 45, defectType: 'Warp Break / Float', severity: 3, points: 3, description: 'Warp float 1.5 inches', xPositionPercent: 62 },
      { id: 'def-6', yardPosition: 91, defectType: 'Snarl / Loop', severity: 2, points: 2, description: 'Weft snarl at left temple', xPositionPercent: 8 }
    ],
    remarks: 'Clear twill line, well balanced hand feel.',
    certificateNumber: 'QC-2026-9922',
    verified: true
  },
  {
    id: 'insp-4821',
    rollNumber: 'ROLL-4821',
    orderId: 'ord-883',
    orderCode: 'ORD-2026-883',
    loomCode: 'L-103',
    fabricSpec: '50s x 50s / 144x76 Oxford',
    widthInches: 58,
    lengthYards: 105,
    grossWeightKg: 18.2,
    totalPoints: 46,
    pointsPer100SqYards: 27.2,
    grade: 'Grade B',
    inspectedAt: '2026-10-25 14:05',
    inspectorName: 'Arun Patel (QC Lead #03)',
    defects: [
      { id: 'def-7', yardPosition: 18, defectType: 'Warp Break / Float', severity: 4, points: 4, description: 'Major warp tie-in knot float 4 inches', xPositionPercent: 54 },
      { id: 'def-8', yardPosition: 33, defectType: 'Broken Pick', severity: 3, points: 3, description: 'Double broken pick not detected by feeder sensor', xPositionPercent: 44 },
      { id: 'def-9', yardPosition: 58, defectType: 'Selvedge Tear', severity: 4, points: 4, description: 'Ravelled selvedge over 5 inches', xPositionPercent: 98 },
      { id: 'def-10', yardPosition: 82, defectType: 'Oil / Grease Spot', severity: 4, points: 4, description: 'Oil spray from temple guide', xPositionPercent: 12 }
    ],
    remarks: 'Graded B due to frequent stop restarts on L-103. Recommended for secondary dyeing or cut piece.',
    certificateNumber: 'QC-2026-9923',
    verified: true
  }
];

let yarnInventory: YarnInventoryItem[] = [
  {
    id: 'yrn-1',
    itemCode: 'YRN-40C-01',
    yarnType: 'Ring Spun Combed Compact',
    countNe: '40s Ne',
    blend: '100% Combed Cotton',
    lotNumber: 'LOT-CT-2026-891',
    supplier: 'Alps Cotton Mills',
    currentStockKg: 6420,
    allocatedStockKg: 2850,
    minSafetyStockKg: 2000,
    conesAvailable: 3410,
    unitCostPerKg: 4.85,
    storageBin: 'Aisle A - Rack 02 - Shelf B',
    reorderAlert: false,
    receivedDate: '2026-10-04'
  },
  {
    id: 'yrn-2',
    itemCode: 'YRN-50E-02',
    yarnType: 'Giza 88 Extra Long Staple',
    countNe: '50s Ne',
    blend: '100% Egyptian Cotton',
    lotNumber: 'LOT-EG-2026-118',
    supplier: 'Nile Delta Fine Spinners',
    currentStockKg: 1450,
    allocatedStockKg: 1320,
    minSafetyStockKg: 1800,
    conesAvailable: 780,
    unitCostPerKg: 7.90,
    storageBin: 'Aisle A - Rack 04 - Shelf A',
    reorderAlert: true,
    receivedDate: '2026-09-22'
  },
  {
    id: 'yrn-3',
    itemCode: 'YRN-60S-03',
    yarnType: 'Supima Combed Ring',
    countNe: '60s Ne',
    blend: '100% American Supima Cotton',
    lotNumber: 'LOT-SP-2026-402',
    supplier: 'Bakersfield Yarn Co.',
    currentStockKg: 5120,
    allocatedStockKg: 3450,
    minSafetyStockKg: 2500,
    conesAvailable: 2940,
    unitCostPerKg: 8.60,
    storageBin: 'Aisle B - Rack 01 - Shelf C',
    reorderAlert: false,
    receivedDate: '2026-10-11'
  },
  {
    id: 'yrn-4',
    itemCode: 'YRN-230PV-04',
    yarnType: '2/30s Siro Spun PV',
    countNe: '2/30s Ne',
    blend: '65% Polyester / 35% Viscose',
    lotNumber: 'LOT-PV-2026-722',
    supplier: 'Reliance Polychem Textiles',
    currentStockKg: 7800,
    allocatedStockKg: 5270,
    minSafetyStockKg: 3000,
    conesAvailable: 4200,
    unitCostPerKg: 3.40,
    storageBin: 'Aisle C - Rack 03 - Shelf B',
    reorderAlert: false,
    receivedDate: '2026-10-08'
  },
  {
    id: 'yrn-5',
    itemCode: 'YRN-10OE-05',
    yarnType: 'Open End Rotor Spun',
    countNe: '10s O.E.',
    blend: '100% Virgin Cotton',
    lotNumber: 'LOT-OE-2026-301',
    supplier: 'Southern Plains Spinning',
    currentStockKg: 9400,
    allocatedStockKg: 5700,
    minSafetyStockKg: 4000,
    conesAvailable: 4900,
    unitCostPerKg: 2.85,
    storageBin: 'Aisle D - Pallet Zone 01',
    reorderAlert: false,
    receivedDate: '2026-10-15'
  },
  {
    id: 'yrn-6',
    itemCode: 'YRN-25LN-06',
    yarnType: 'Wet Spun Flax Yarn',
    countNe: '25s Linen',
    blend: '100% European Flax Linen',
    lotNumber: 'LOT-LN-2026-094',
    supplier: 'Flanders Flax Cooperatives',
    currentStockKg: 1980,
    allocatedStockKg: 2360,
    minSafetyStockKg: 2000,
    conesAvailable: 1100,
    unitCostPerKg: 11.20,
    storageBin: 'Aisle E - Climate Room 01',
    reorderAlert: true,
    receivedDate: '2026-10-01'
  }
];

let greigeWarehouse: GreigeFabricRoll[] = [
  {
    id: 'grg-1',
    rollCode: 'GRG-C40-001',
    orderCode: 'ORD-2026-881',
    fabricCode: 'FAB-C40-POP',
    fabricName: 'Premium Poplin Cotton',
    construction: '40s x 40s / 132x72 Poplin',
    widthInches: 63,
    lengthMeters: 320,
    weightKg: 41.2,
    grade: 'Grade A',
    inspectionRollId: 'insp-4819',
    storageBin: 'Warehouse Bay 01 - Rack 03',
    status: 'in_warehouse',
    producedAt: '2026-10-24 16:40'
  },
  {
    id: 'grg-2',
    rollCode: 'GRG-PV30-002',
    orderCode: 'ORD-2026-882',
    fabricCode: 'FAB-PV30-TW',
    fabricName: 'Executive Suiting Twill',
    construction: '2/30s PV x 2/30s PV Twill',
    widthInches: 58,
    lengthMeters: 450,
    weightKg: 82.5,
    grade: 'Grade A',
    inspectionRollId: 'insp-4820',
    storageBin: 'Warehouse Bay 02 - Rack 01',
    status: 'allocated_to_dyeing',
    producedAt: '2026-10-24 20:10'
  },
  {
    id: 'grg-3',
    rollCode: 'GRG-C60-003',
    orderCode: 'ORD-2026-884',
    fabricCode: 'FAB-C60-SAT',
    fabricName: 'Supima Satin 4/1',
    construction: '60s x 60s / 173x120 Satin',
    widthInches: 108,
    lengthMeters: 280,
    weightKg: 52.8,
    grade: 'Grade A',
    storageBin: 'Warehouse Bay 04 - Wide Rack',
    status: 'in_warehouse',
    producedAt: '2026-10-25 08:30'
  }
];

let alerts: AlertNotification[] = [
  {
    id: 'alt-1',
    loomCode: 'L-103',
    type: 'warp_stop',
    title: 'Warp Yarn Break Alert',
    message: 'Drop wire activated at harness 4. Weaving halted on Order ORD-2026-883.',
    timestamp: '2026-10-25 14:41',
    severity: 'high',
    acknowledged: false
  },
  {
    id: 'alt-2',
    loomCode: 'L-106',
    type: 'weft_stop',
    title: 'Weft Feeder Optical Sensor Stop',
    message: 'Short pick detected on feeder 2. Check yarn package unwinding.',
    timestamp: '2026-10-25 14:43',
    severity: 'medium',
    acknowledged: false
  },
  {
    id: 'alt-3',
    loomCode: 'WAREHOUSE',
    type: 'low_yarn',
    title: 'Yarn Reorder Warning: Giza 88 (50s Ne)',
    message: 'Stock (1,450 kg) has dropped below safety threshold (1,800 kg). Sourcing required for ORD-2026-883 continuation.',
    timestamp: '2026-10-25 12:10',
    severity: 'medium',
    acknowledged: false
  }
];

// Helper: Calculate ASTM D5430 points per 100 sq yd
function calculateAstmD5430(totalPoints: number, widthInches: number, lengthYards: number) {
  if (widthInches <= 0 || lengthYards <= 0) return 0;
  // Formula: (Points * 3600) / (Fabric width in inches * Roll length in yards)
  const pts = (totalPoints * 3600) / (widthInches * lengthYards);
  return Math.round(pts * 100) / 100;
}

// Background simulation ticker (increments meters & picks slightly on running looms)
setInterval(() => {
  looms.forEach(loom => {
    if (loom.status === 'running') {
      // 1 minute of running at RPM produces: rpm / picksPerInch / 39.37 meters
      const picksIncrement = Math.floor(loom.rpm * 0.1);
      const metersIncrement = Math.round((picksIncrement / 72 / 39.37) * 100) / 100;
      loom.currentMetersWoven = Math.min(loom.targetMeters, Math.round((loom.currentMetersWoven + metersIncrement) * 10) / 10);
      loom.beamLengthRemainingMeters = Math.max(0, Math.round((loom.beamLengthRemainingMeters - metersIncrement) * 10) / 10);
    }
  });
}, 10000);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Endpoints
  // 1. Looms
  app.get('/api/looms', (req, res) => {
    res.json({ success: true, count: looms.length, data: looms });
  });

  app.get('/api/looms/:id', (req, res) => {
    const loom = looms.find(l => l.id === req.params.id || l.code === req.params.id);
    if (!loom) return res.status(404).json({ success: false, error: 'Loom not found' });
    res.json({ success: true, data: loom });
  });

  app.post('/api/looms/:id/action', (req, res) => {
    const loom = looms.find(l => l.id === req.params.id || l.code === req.params.id);
    if (!loom) return res.status(404).json({ success: false, error: 'Loom not found' });

    const { action, notes, reason } = req.body;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (action === 'resume' || action === 'start') {
      loom.status = 'running';
      loom.rpm = loom.standardRpm;
      loom.lastStopReason = undefined;
      // remove active stop alert for this loom
      alerts = alerts.filter(a => a.loomCode !== loom.code);
    } else if (action === 'pause' || action === 'stop') {
      loom.status = 'idle';
      loom.rpm = 0;
      loom.lastStopReason = reason || 'Operator manual stop';
      loom.lastStopTime = 'Just now';
    } else if (action === 'acknowledge') {
      if (loom.status === 'warp_stop' || loom.status === 'weft_stop') {
        loom.todayStops.other += 0;
      }
      const existingAlert = alerts.find(a => a.loomCode === loom.code && !a.acknowledged);
      if (existingAlert) existingAlert.acknowledged = true;
    } else if (action === 'trigger_warp_stop') {
      loom.status = 'warp_stop';
      loom.rpm = 0;
      loom.todayStops.warp += 1;
      loom.lastStopReason = 'Warp yarn break at drop wire harness 2';
      loom.lastStopTime = 'Just now';
      alerts.unshift({
        id: `alt-${Date.now()}`,
        loomCode: loom.code,
        type: 'warp_stop',
        title: `Warp Break on ${loom.code}`,
        message: `Drop wire signaled yarn break. Weaving halted at meter ${loom.currentMetersWoven}.`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        severity: 'high',
        acknowledged: false
      });
    } else if (action === 'trigger_weft_stop') {
      loom.status = 'weft_stop';
      loom.rpm = 0;
      loom.todayStops.weft += 1;
      loom.lastStopReason = 'Weft sensor: filling break in acceleration nozzle';
      loom.lastStopTime = 'Just now';
      alerts.unshift({
        id: `alt-${Date.now()}`,
        loomCode: loom.code,
        type: 'weft_stop',
        title: `Weft Stop on ${loom.code}`,
        message: `Filling yarn insertion interrupted. Operator inspection required.`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        severity: 'medium',
        acknowledged: false
      });
    } else if (action === 'knot_beam') {
      loom.status = 'knotting';
      loom.rpm = 0;
      loom.lastStopReason = 'Beam knotting / knot tying machine engaged';
      loom.lastStopTime = 'Just now';
    } else if (action === 'doff') {
      loom.status = 'doffing';
      loom.rpm = 0;
      loom.lastStopReason = 'Cloth roll doffing in progress';
      loom.lastStopTime = 'Just now';
    }

    res.json({ success: true, message: `Loom ${loom.code} action ${action} executed`, data: loom });
  });

  app.patch('/api/looms/:id', (req, res) => {
    const loom = looms.find(l => l.id === req.params.id || l.code === req.params.id);
    if (!loom) return res.status(404).json({ success: false, error: 'Loom not found' });

    Object.assign(loom, req.body);
    res.json({ success: true, data: loom });
  });

  // 2. Production Orders
  app.get('/api/orders', (req, res) => {
    res.json({ success: true, count: productionOrders.length, data: productionOrders });
  });

  app.post('/api/orders', (req, res) => {
    const {
      customerName,
      fabricName,
      construction,
      weavePattern,
      widthInches,
      totalMetersOrdered,
      priority,
      deliveryDate,
      assignedLooms,
      notes,
      unitPricePerMeter
    } = req.body;

    if (!customerName || !fabricName || !totalMetersOrdered) {
      return res.status(400).json({ success: false, error: 'Missing required order fields' });
    }

    const orderNumber = 880 + productionOrders.length + 1;
    const orderCode = `ORD-2026-${orderNumber}`;
    const fabricCode = `FAB-${fabricName.slice(0, 3).toUpperCase()}-${weavePattern ? weavePattern.slice(0, 3).toUpperCase() : 'PLN'}`;

    // Calculate approximate BOM Yarn Weight (standard textile formula with crimp & 3% waste)
    const meters = Number(totalMetersOrdered);
    const width = Number(widthInches || 60);
    const estWarpKg = Math.round((meters * 0.17) * 1.03);
    const estWeftKg = Math.round((meters * 0.11) * 1.03);

    const newOrder: ProductionOrder = {
      id: `ord-${orderNumber}`,
      orderCode,
      customerName,
      fabricCode,
      fabricName,
      construction: construction || '40s x 40s / 120 x 68',
      weavePattern: weavePattern || 'Plain',
      widthInches: width,
      totalMetersOrdered: meters,
      metersProduced: 0,
      metersInspected: 0,
      metersPassedGradeA: 0,
      metersPassedGradeB: 0,
      metersRejected: 0,
      status: 'scheduled',
      priority: priority || 'normal',
      deliveryDate: deliveryDate || new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      assignedLooms: assignedLooms || [],
      bomYarnWarpKg: estWarpKg,
      bomYarnWeftKg: estWeftKg,
      yarnAvailable: true,
      unitPricePerMeter: Number(unitPricePerMeter) || 4.20,
      notes: notes || '',
      currentStage: 'Yarn Sizing'
    };

    productionOrders.unshift(newOrder);

    // If looms assigned, update those looms
    if (newOrder.assignedLooms && newOrder.assignedLooms.length > 0) {
      newOrder.assignedLooms.forEach(code => {
        const l = looms.find(loom => loom.code === code);
        if (l) {
          l.currentOrderCode = newOrder.orderCode;
          l.customerName = newOrder.customerName;
          l.fabricSpec = newOrder.construction;
          l.targetMeters = Math.round(newOrder.totalMetersOrdered / newOrder.assignedLooms.length);
          l.currentMetersWoven = 0;
        }
      });
    }

    res.status(201).json({ success: true, data: newOrder });
  });

  app.patch('/api/orders/:id', (req, res) => {
    const order = productionOrders.find(o => o.id === req.params.id || o.orderCode === req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    Object.assign(order, req.body);
    res.json({ success: true, data: order });
  });

  app.delete('/api/orders/:id', (req, res) => {
    const idx = productionOrders.findIndex(o => o.id === req.params.id || o.orderCode === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Order not found' });
    const deleted = productionOrders.splice(idx, 1)[0];
    res.json({ success: true, data: deleted });
  });

  // 3. Weave Plans
  app.get('/api/plans', (req, res) => {
    res.json({ success: true, count: weavePlans.length, data: weavePlans });
  });

  app.post('/api/plans', (req, res) => {
    const planNumber = 440 + weavePlans.length + 1;
    const newPlan: WeavePlan = {
      id: `plan-${planNumber}`,
      planCode: `WP-2026-${planNumber}`,
      ...req.body
    };
    weavePlans.unshift(newPlan);
    res.status(201).json({ success: true, data: newPlan });
  });

  // 4. Fabric Quality Inspection (ASTM D5430 4-Point System)
  app.get('/api/inspections', (req, res) => {
    res.json({ success: true, count: inspectionRolls.length, data: inspectionRolls });
  });

  app.post('/api/inspections', (req, res) => {
    const {
      orderCode,
      loomCode,
      fabricSpec,
      widthInches,
      lengthYards,
      grossWeightKg,
      defects,
      inspectorName,
      remarks
    } = req.body;

    const width = Number(widthInches || 60);
    const yards = Number(lengthYards || 100);
    const defectList = Array.isArray(defects) ? defects : [];

    const totalPoints = defectList.reduce((sum: number, d: any) => sum + (Number(d.points) || Number(d.severity) || 1), 0);
    const pointsPer100SqYd = calculateAstmD5430(totalPoints, width, yards);

    let grade: 'Grade A' | 'Grade B' | 'Reject' = 'Grade A';
    if (pointsPer100SqYd > 40) {
      grade = 'Reject';
    } else if (pointsPer100SqYd > 20) {
      grade = 'Grade B';
    }

    const rollSeq = 4820 + inspectionRolls.length + 1;
    const newRoll: InspectionRoll = {
      id: `insp-${rollSeq}`,
      rollNumber: `ROLL-${rollSeq}`,
      orderId: req.body.orderId || 'ord-881',
      orderCode: orderCode || 'ORD-2026-881',
      loomCode: loomCode || 'L-101',
      fabricSpec: fabricSpec || 'Standard Construction',
      widthInches: width,
      lengthYards: yards,
      grossWeightKg: Number(grossWeightKg) || Math.round(yards * 0.18 * 10) / 10,
      totalPoints,
      pointsPer100SqYards: pointsPer100SqYd,
      grade,
      inspectedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      inspectorName: inspectorName || 'Maria Santos (QC Certified #08)',
      defects: defectList.map((d: any, idx: number) => ({
        id: `def-${Date.now()}-${idx}`,
        yardPosition: Number(d.yardPosition) || 0,
        defectType: d.defectType || 'Slub / Thick End',
        severity: (Number(d.severity) || 1) as 1 | 2 | 3 | 4,
        points: Number(d.severity) || 1,
        description: d.description || '',
        xPositionPercent: Number(d.xPositionPercent) || 50
      })),
      remarks: remarks || `Automated ASTM D5430 4-point rating: ${pointsPer100SqYd} pts/100 sq yd`,
      certificateNumber: `QC-2026-${9920 + inspectionRolls.length + 1}`,
      verified: true
    };

    inspectionRolls.unshift(newRoll);

    // Also add to greige fabric warehouse
    const lengthMeters = Math.round(yards * 0.9144 * 10) / 10;
    const newGreigeRoll: GreigeFabricRoll = {
      id: `grg-${Date.now()}`,
      rollCode: `GRG-${newRoll.rollNumber}`,
      orderCode: newRoll.orderCode,
      fabricCode: 'FAB-GREIGE',
      fabricName: newRoll.fabricSpec,
      construction: newRoll.fabricSpec,
      widthInches: width,
      lengthMeters,
      weightKg: newRoll.grossWeightKg,
      grade: newRoll.grade,
      inspectionRollId: newRoll.id,
      storageBin: `Warehouse Bay 0${Math.floor(Math.random() * 4) + 1} - Shelf B`,
      status: 'in_warehouse',
      producedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    greigeWarehouse.unshift(newGreigeRoll);

    // Update production order metrics
    const relatedOrder = productionOrders.find(o => o.orderCode === newRoll.orderCode);
    if (relatedOrder) {
      relatedOrder.metersInspected += lengthMeters;
      if (grade === 'Grade A') relatedOrder.metersPassedGradeA += lengthMeters;
      else if (grade === 'Grade B') relatedOrder.metersPassedGradeB += lengthMeters;
      else relatedOrder.metersRejected += lengthMeters;
    }

    res.status(201).json({ success: true, data: newRoll, greige: newGreigeRoll });
  });

  // 5. Yarn Inventory
  app.get('/api/inventory/yarn', (req, res) => {
    res.json({ success: true, count: yarnInventory.length, data: yarnInventory });
  });

  app.post('/api/inventory/yarn', (req, res) => {
    const newItem: YarnInventoryItem = {
      id: `yrn-${Date.now()}`,
      itemCode: req.body.itemCode || `YRN-${req.body.countNe || '40'}-${Date.now().toString().slice(-3)}`,
      yarnType: req.body.yarnType || 'Combed Cotton Ring Spun',
      countNe: req.body.countNe || '40s Ne',
      blend: req.body.blend || '100% Cotton',
      lotNumber: req.body.lotNumber || `LOT-${Date.now().toString().slice(-6)}`,
      supplier: req.body.supplier || 'Premium Mill Spinners',
      currentStockKg: Number(req.body.currentStockKg) || 1000,
      allocatedStockKg: 0,
      minSafetyStockKg: Number(req.body.minSafetyStockKg) || 800,
      conesAvailable: Math.round((Number(req.body.currentStockKg) || 1000) * 0.5),
      unitCostPerKg: Number(req.body.unitCostPerKg) || 4.50,
      storageBin: req.body.storageBin || 'Aisle A - Pallet 01',
      reorderAlert: false,
      receivedDate: new Date().toISOString().split('T')[0]
    };
    yarnInventory.unshift(newItem);
    res.status(201).json({ success: true, data: newItem });
  });

  app.patch('/api/inventory/yarn/:id/issue', (req, res) => {
    const item = yarnInventory.find(y => y.id === req.params.id || y.itemCode === req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Yarn item not found' });

    const qtyKg = Number(req.body.quantityKg) || 100;
    if (item.currentStockKg < qtyKg) {
      return res.status(400).json({ success: false, error: 'Insufficient yarn stock in inventory' });
    }

    item.currentStockKg -= qtyKg;
    item.allocatedStockKg = Math.max(0, item.allocatedStockKg - qtyKg);
    item.conesAvailable = Math.max(0, item.conesAvailable - Math.round(qtyKg * 0.5));
    if (item.currentStockKg < item.minSafetyStockKg) {
      item.reorderAlert = true;
    }

    res.json({ success: true, data: item, message: `Issued ${qtyKg} kg to ${req.body.destination || 'Weaving Shed'}` });
  });

  // 6. Greige Warehouse Inventory
  app.get('/api/inventory/greige', (req, res) => {
    res.json({ success: true, count: greigeWarehouse.length, data: greigeWarehouse });
  });

  app.post('/api/inventory/greige/:id/dispatch', (req, res) => {
    const roll = greigeWarehouse.find(r => r.id === req.params.id || r.rollCode === req.params.id);
    if (!roll) return res.status(404).json({ success: false, error: 'Fabric roll not found' });
    roll.status = 'dispatched';
    res.json({ success: true, data: roll, message: `Roll ${roll.rollCode} marked as dispatched` });
  });

  // 7. System Alerts & Notifications
  app.get('/api/alerts', (req, res) => {
    res.json({ success: true, count: alerts.length, data: alerts });
  });

  app.post('/api/alerts/:id/ack', (req, res) => {
    const alert = alerts.find(a => a.id === req.params.id);
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    alert.acknowledged = true;
    res.json({ success: true, data: alert });
  });

  // 8. OEE & Analytics
  app.get('/api/analytics', (req, res) => {
    const runningLooms = looms.filter(l => l.status === 'running').length;
    const avgEfficiency = Math.round(looms.reduce((acc, l) => acc + l.efficiencyPercent, 0) / looms.length * 10) / 10;
    
    // Calculate OEE Factors:
    // Availability = Operating Hours / Planned Hours
    const availability = Math.round(((looms.length - (looms.filter(l => l.status === 'maintenance' || l.status === 'idle').length * 0.5)) / looms.length) * 1000) / 10;
    // Performance = Actual RPM / Standard RPM
    const performance = avgEfficiency;
    // Quality = Grade A + B passed / Total inspected
    const totalPassed = inspectionRolls.filter(r => r.grade !== 'Reject').length;
    const quality = inspectionRolls.length > 0 ? Math.round((totalPassed / inspectionRolls.length) * 1000) / 10 : 98.4;
    
    const overallOee = Math.round(((availability / 100) * (performance / 100) * (quality / 100)) * 1000) / 10;

    const stopCausesPareto = [
      { reason: 'Warp Yarn Break (Drop Wire)', count: 28, downtimeMinutes: 142, percentage: 41.5 },
      { reason: 'Weft Sensor Stop / Short Pick', count: 22, downtimeMinutes: 77, percentage: 22.5 },
      { reason: 'Beam Knotting / Sizing Change', count: 4, downtimeMinutes: 68, percentage: 19.8 },
      { reason: 'Cloth Doffing / Batch Reached', count: 6, downtimeMinutes: 32, percentage: 9.4 },
      { reason: 'Mechanical Lube / Temple Adjust', count: 3, downtimeMinutes: 24, percentage: 6.8 },
    ];

    const metrics: OeeMetrics = {
      overallOee,
      availability: Math.min(100, availability),
      performance: Math.min(100, performance),
      quality: Math.min(100, quality),
      plannedProductionHours: 192,
      actualOperatingHours: 174.6,
      idealRunRateRpm: 740,
      actualAverageRpm: Math.round(looms.filter(l => l.rpm > 0).reduce((acc, l) => acc + l.rpm, 0) / Math.max(1, runningLooms)),
      totalPicksProduced: 4852000,
      totalMetersProduced: looms.reduce((acc, l) => acc + l.currentMetersWoven, 0),
      firstQualityMeters: Math.round(looms.reduce((acc, l) => acc + l.currentMetersWoven, 0) * 0.965),
      stopCausesPareto
    };

    res.json({ success: true, data: metrics, activeLoomsCount: runningLooms, totalLoomsCount: looms.length });
  });

  // Mount Vite or static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[TexFlow MES] Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
