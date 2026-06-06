// ============================================================
// GARAGE INSPECTION & REPAIR MANAGEMENT PLATFORM — MOCK DATA
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'garage_manager'
  | 'receptionist'
  | 'inspector'
  | 'technician'
  | 'accountant'

export type VehicleStatus =
  | 'registered'
  | 'under_inspection'
  | 'awaiting_approval'
  | 'approved'
  | 'in_repair'
  | 'quality_check'
  | 'ready'
  | 'delivered'

export type WorkOrderStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'waiting_parts'
  | 'quality_check'
  | 'completed'
  | 'delivered'

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'partially_approved'
  | 'rejected'

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  avatar?: string
  totalVehicles: number
  totalSpent: number
  joinedAt: string
  loyaltyPoints: number
}

export interface Vehicle {
  id: string
  customerId: string
  customerName: string
  plate: string
  make: string
  model: string
  year: number
  color: string
  vin: string
  mileage: number
  status: VehicleStatus
  lastService?: string
  image?: string
}

export interface InspectionFinding {
  id: string
  category: string
  title: string
  description: string
  severity: Severity
  recommendedAction: string
  parts: string[]
  laborHours: number
  estimatedCost: number
  photos: string[]
}

export interface Inspection {
  id: string
  vehicleId: string
  vehiclePlate: string
  vehicleName: string
  customerId: string
  customerName: string
  inspectorId: string
  inspectorName: string
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed'
  findings: InspectionFinding[]
  totalEstimate: number
  createdAt: string
  completedAt?: string
}

export interface QuotationItem {
  findingId: string
  title: string
  partsCost: number
  laborCost: number
  approved: boolean
}

export interface Quotation {
  id: string
  inspectionId: string
  vehicleId: string
  vehiclePlate: string
  customerId: string
  customerName: string
  items: QuotationItem[]
  subtotal: number
  tax: number
  serviceCharge: number
  discount: number
  total: number
  approvalStatus: ApprovalStatus
  createdAt: string
  approvedAt?: string
}

export interface WorkOrder {
  id: string
  quotationId: string
  vehicleId: string
  vehiclePlate: string
  vehicleName: string
  customerId: string
  customerName: string
  technicianId?: string
  technicianName?: string
  status: WorkOrderStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  description: string
  estimatedHours: number
  actualHours?: number
  startedAt?: string
  completedAt?: string
  createdAt: string
  dueDate: string
}

export interface Technician {
  id: string
  name: string
  avatar?: string
  specialization: string[]
  skills: string[]
  status: 'available' | 'busy' | 'off_duty'
  activeJobs: number
  completedToday: number
  rating: number
  efficiency: number
  joinedAt: string
}

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  minStock: number
  unit: string
  costPrice: number
  sellPrice: number
  supplier: string
  lastRestocked: string
}

// ─── CUSTOMERS ───────────────────────────────────────────────
export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Abebe Girma',
    phone: '+251 911 234 567',
    email: 'abebe.girma@email.com',
    address: 'Bole, Addis Ababa',
    totalVehicles: 2,
    totalSpent: 45800,
    joinedAt: '2023-03-15',
    loyaltyPoints: 458,
  },
  {
    id: 'c2',
    name: 'Tigist Haile',
    phone: '+251 922 345 678',
    email: 'tigist.haile@email.com',
    address: 'Kazanchis, Addis Ababa',
    totalVehicles: 1,
    totalSpent: 18200,
    joinedAt: '2023-07-22',
    loyaltyPoints: 182,
  },
  {
    id: 'c3',
    name: 'Dawit Bekele',
    phone: '+251 933 456 789',
    email: 'dawit.bekele@email.com',
    address: 'Piassa, Addis Ababa',
    totalVehicles: 3,
    totalSpent: 87500,
    joinedAt: '2022-11-10',
    loyaltyPoints: 875,
  },
  {
    id: 'c4',
    name: 'Sara Tadesse',
    phone: '+251 944 567 890',
    email: 'sara.tadesse@email.com',
    address: 'Sarbet, Addis Ababa',
    totalVehicles: 1,
    totalSpent: 12400,
    joinedAt: '2024-01-08',
    loyaltyPoints: 124,
  },
  {
    id: 'c5',
    name: 'Yohannes Alemu',
    phone: '+251 955 678 901',
    email: 'yohannes.alemu@email.com',
    address: 'CMC, Addis Ababa',
    totalVehicles: 2,
    totalSpent: 56000,
    joinedAt: '2023-05-19',
    loyaltyPoints: 560,
  },
  {
    id: 'c6',
    name: 'Meron Tekeste',
    phone: '+251 966 789 012',
    email: 'meron.tekeste@email.com',
    address: 'Gerji, Addis Ababa',
    totalVehicles: 1,
    totalSpent: 9800,
    joinedAt: '2024-02-14',
    loyaltyPoints: 98,
  },
]

// ─── VEHICLES ────────────────────────────────────────────────
export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    customerId: 'c1',
    customerName: 'Abebe Girma',
    plate: 'AA-3-04521',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2019,
    color: 'White',
    vin: 'JTMHX3JH5K4012345',
    mileage: 87500,
    status: 'in_repair',
    lastService: '2024-12-10',
  },
  {
    id: 'v2',
    customerId: 'c1',
    customerName: 'Abebe Girma',
    plate: 'AA-1-98234',
    make: 'Toyota',
    model: 'Hilux',
    year: 2021,
    color: 'Silver',
    vin: 'MROCA3CD8M0098765',
    mileage: 42000,
    status: 'registered',
    lastService: '2025-01-20',
  },
  {
    id: 'v3',
    customerId: 'c2',
    customerName: 'Tigist Haile',
    plate: 'AA-2-67891',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2020,
    color: 'Blue',
    vin: 'KM8J33A46LU091234',
    mileage: 63200,
    status: 'under_inspection',
    lastService: '2024-11-05',
  },
  {
    id: 'v4',
    customerId: 'c3',
    customerName: 'Dawit Bekele',
    plate: 'AA-4-12398',
    make: 'Isuzu',
    model: 'D-Max',
    year: 2018,
    color: 'Black',
    vin: 'MPAEK8DXK JN010234',
    mileage: 124500,
    status: 'awaiting_approval',
    lastService: '2024-09-30',
  },
  {
    id: 'v5',
    customerId: 'c4',
    customerName: 'Sara Tadesse',
    plate: 'AA-3-55671',
    make: 'Nissan',
    model: 'X-Trail',
    year: 2022,
    color: 'Grey',
    vin: 'JN1TBNT32Z0123456',
    mileage: 28700,
    status: 'quality_check',
    lastService: '2024-10-15',
  },
  {
    id: 'v6',
    customerId: 'c5',
    customerName: 'Yohannes Alemu',
    plate: 'AA-1-78902',
    make: 'Ford',
    model: 'Ranger',
    year: 2020,
    color: 'Red',
    vin: 'MNABXXMJ2KM209876',
    mileage: 95300,
    status: 'ready',
    lastService: '2024-12-01',
  },
  {
    id: 'v7',
    customerId: 'c5',
    customerName: 'Yohannes Alemu',
    plate: 'AA-2-34512',
    make: 'Mitsubishi',
    model: 'Pajero',
    year: 2017,
    color: 'White',
    vin: 'JMBLYV78JHJ012387',
    mileage: 138900,
    status: 'in_repair',
    lastService: '2024-08-20',
  },
  {
    id: 'v8',
    customerId: 'c6',
    customerName: 'Meron Tekeste',
    plate: 'AA-4-90123',
    make: 'Kia',
    model: 'Sportage',
    year: 2023,
    color: 'Pearl White',
    vin: 'KNDJP3A54P7012345',
    mileage: 15800,
    status: 'registered',
    lastService: '2025-01-30',
  },
]

// ─── TECHNICIANS ─────────────────────────────────────────────
export const mockTechnicians: Technician[] = [
  {
    id: 't1',
    name: 'Biruk Tesfaye',
    specialization: ['Engine', 'Transmission'],
    skills: ['Toyota', 'Isuzu', 'Ford', 'Engine Overhaul'],
    status: 'busy',
    activeJobs: 2,
    completedToday: 1,
    rating: 4.9,
    efficiency: 96,
    joinedAt: '2021-03-10',
  },
  {
    id: 't2',
    name: 'Kaleab Wolde',
    specialization: ['Electrical', 'AC System'],
    skills: ['Auto Electrical', 'Diagnostics', 'AC Regas', 'Wiring'],
    status: 'busy',
    activeJobs: 1,
    completedToday: 2,
    rating: 4.7,
    efficiency: 91,
    joinedAt: '2020-08-15',
  },
  {
    id: 't3',
    name: 'Henok Assefa',
    specialization: ['Brake System', 'Suspension'],
    skills: ['Brake Overhaul', 'Wheel Alignment', 'Shock Absorbers'],
    status: 'available',
    activeJobs: 0,
    completedToday: 3,
    rating: 4.8,
    efficiency: 94,
    joinedAt: '2022-01-20',
  },
  {
    id: 't4',
    name: 'Naod Girma',
    specialization: ['Body Work', 'Painting'],
    skills: ['Dent Repair', 'Spray Painting', 'Panel Beating'],
    status: 'busy',
    activeJobs: 1,
    completedToday: 0,
    rating: 4.6,
    efficiency: 88,
    joinedAt: '2022-06-05',
  },
  {
    id: 't5',
    name: 'Semere Hailu',
    specialization: ['Engine', 'Cooling System'],
    skills: ['Radiator Repair', 'Timing Belt', 'Head Gasket'],
    status: 'available',
    activeJobs: 0,
    completedToday: 2,
    rating: 4.5,
    efficiency: 87,
    joinedAt: '2023-02-14',
  },
]

// ─── INSPECTIONS ─────────────────────────────────────────────
export const mockInspections: Inspection[] = [
  {
    id: 'ins1',
    vehicleId: 'v3',
    vehiclePlate: 'AA-2-67891',
    vehicleName: 'Hyundai Tucson 2020',
    customerId: 'c2',
    customerName: 'Tigist Haile',
    inspectorId: 't3',
    inspectorName: 'Henok Assefa',
    status: 'in_progress',
    findings: [
      {
        id: 'f1',
        category: 'Brake System',
        title: 'Worn Front Brake Pads',
        description:
          'Front brake pads worn below minimum thickness (2mm). Immediate replacement required.',
        severity: 'critical',
        recommendedAction: 'Replace front brake pads and inspect rotors',
        parts: ['Front Brake Pad Set', 'Brake Rotor (if needed)'],
        laborHours: 1.5,
        estimatedCost: 4500,
        photos: [],
      },
      {
        id: 'f2',
        category: 'Engine',
        title: 'Engine Oil Leak',
        description: 'Minor oil seepage from valve cover gasket.',
        severity: 'medium',
        recommendedAction: 'Replace valve cover gasket',
        parts: ['Valve Cover Gasket Set'],
        laborHours: 2,
        estimatedCost: 2800,
        photos: [],
      },
    ],
    totalEstimate: 7300,
    createdAt: '2025-06-05T08:30:00Z',
  },
  {
    id: 'ins2',
    vehicleId: 'v4',
    vehiclePlate: 'AA-4-12398',
    vehicleName: 'Isuzu D-Max 2018',
    customerId: 'c3',
    customerName: 'Dawit Bekele',
    inspectorId: 't1',
    inspectorName: 'Biruk Tesfaye',
    status: 'completed',
    findings: [
      {
        id: 'f3',
        category: 'Transmission',
        title: 'Transmission Fluid Contamination',
        description: 'Transmission fluid dark and burnt-smelling. Full flush required.',
        severity: 'high',
        recommendedAction: 'Full transmission fluid flush and filter change',
        parts: ['ATF Fluid 4L', 'Transmission Filter'],
        laborHours: 2.5,
        estimatedCost: 6200,
        photos: [],
      },
      {
        id: 'f4',
        category: 'Suspension',
        title: 'Worn Rear Shock Absorbers',
        description: 'Rear shocks leaking and not providing adequate dampening.',
        severity: 'high',
        recommendedAction: 'Replace rear shock absorbers',
        parts: ['Rear Shock Absorber Set'],
        laborHours: 3,
        estimatedCost: 8500,
        photos: [],
      },
    ],
    totalEstimate: 14700,
    createdAt: '2025-06-04T10:00:00Z',
    completedAt: '2025-06-04T14:30:00Z',
  },
]

// ─── QUOTATIONS ───────────────────────────────────────────────
export const mockQuotations: Quotation[] = [
  {
    id: 'q1',
    inspectionId: 'ins2',
    vehicleId: 'v4',
    vehiclePlate: 'AA-4-12398',
    customerId: 'c3',
    customerName: 'Dawit Bekele',
    items: [
      {
        findingId: 'f3',
        title: 'Transmission Fluid Flush',
        partsCost: 2800,
        laborCost: 1250,
        approved: false,
      },
      {
        findingId: 'f4',
        title: 'Rear Shock Absorber Replacement',
        partsCost: 5500,
        laborCost: 1500,
        approved: false,
      },
    ],
    subtotal: 11050,
    tax: 1657.5,
    serviceCharge: 550,
    discount: 300,
    total: 12957.5,
    approvalStatus: 'pending',
    createdAt: '2025-06-04T15:00:00Z',
  },
]

// ─── WORK ORDERS ──────────────────────────────────────────────
export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo1',
    quotationId: 'q2',
    vehicleId: 'v1',
    vehiclePlate: 'AA-3-04521',
    vehicleName: 'Toyota Land Cruiser 2019',
    customerId: 'c1',
    customerName: 'Abebe Girma',
    technicianId: 't1',
    technicianName: 'Biruk Tesfaye',
    status: 'in_progress',
    priority: 'high',
    description: 'Full engine service + timing belt replacement',
    estimatedHours: 6,
    actualHours: 4,
    startedAt: '2025-06-05T09:00:00Z',
    createdAt: '2025-06-04T16:00:00Z',
    dueDate: '2025-06-06T17:00:00Z',
  },
  {
    id: 'wo2',
    quotationId: 'q3',
    vehicleId: 'v7',
    vehiclePlate: 'AA-2-34512',
    vehicleName: 'Mitsubishi Pajero 2017',
    customerId: 'c5',
    customerName: 'Yohannes Alemu',
    technicianId: 't2',
    technicianName: 'Kaleab Wolde',
    status: 'waiting_parts',
    priority: 'medium',
    description: 'AC compressor replacement + regas',
    estimatedHours: 4,
    createdAt: '2025-06-04T11:00:00Z',
    dueDate: '2025-06-07T17:00:00Z',
  },
  {
    id: 'wo3',
    quotationId: 'q4',
    vehicleId: 'v5',
    vehiclePlate: 'AA-3-55671',
    vehicleName: 'Nissan X-Trail 2022',
    customerId: 'c4',
    customerName: 'Sara Tadesse',
    technicianId: 't3',
    technicianName: 'Henok Assefa',
    status: 'quality_check',
    priority: 'medium',
    description: 'Brake pad replacement + wheel alignment',
    estimatedHours: 3,
    actualHours: 2.5,
    startedAt: '2025-06-04T14:00:00Z',
    completedAt: '2025-06-05T10:00:00Z',
    createdAt: '2025-06-04T13:00:00Z',
    dueDate: '2025-06-05T17:00:00Z',
  },
  {
    id: 'wo4',
    quotationId: 'q5',
    vehicleId: 'v6',
    vehiclePlate: 'AA-1-78902',
    vehicleName: 'Ford Ranger 2020',
    customerId: 'c5',
    customerName: 'Yohannes Alemu',
    technicianId: 't4',
    technicianName: 'Naod Girma',
    status: 'completed',
    priority: 'low',
    description: 'Minor dent repair rear bumper + touch-up paint',
    estimatedHours: 4,
    actualHours: 3.5,
    startedAt: '2025-06-03T08:00:00Z',
    completedAt: '2025-06-05T09:00:00Z',
    createdAt: '2025-06-03T07:30:00Z',
    dueDate: '2025-06-05T17:00:00Z',
  },
  {
    id: 'wo5',
    quotationId: 'q6',
    vehicleId: 'v2',
    vehiclePlate: 'AA-1-98234',
    vehicleName: 'Toyota Hilux 2021',
    customerId: 'c1',
    customerName: 'Abebe Girma',
    status: 'pending',
    priority: 'low',
    description: 'Routine oil change + filter service',
    estimatedHours: 1,
    createdAt: '2025-06-05T11:00:00Z',
    dueDate: '2025-06-06T12:00:00Z',
  },
  {
    id: 'wo6',
    quotationId: 'q7',
    vehicleId: 'v3',
    vehiclePlate: 'AA-2-67891',
    vehicleName: 'Hyundai Tucson 2020',
    customerId: 'c2',
    customerName: 'Tigist Haile',
    status: 'assigned',
    priority: 'urgent',
    description: 'Brake pad replacement (critical)',
    estimatedHours: 2,
    technicianId: 't3',
    technicianName: 'Henok Assefa',
    createdAt: '2025-06-05T12:00:00Z',
    dueDate: '2025-06-05T18:00:00Z',
  },
]

// ─── INVENTORY ────────────────────────────────────────────────
export const mockInventory: InventoryItem[] = [
  {
    id: 'inv1',
    sku: 'BP-TOY-001',
    name: 'Toyota Brake Pad Set (Front)',
    category: 'Brake System',
    stock: 3,
    minStock: 5,
    unit: 'Set',
    costPrice: 1800,
    sellPrice: 2500,
    supplier: 'AutoParts Ethiopia',
    lastRestocked: '2025-05-15',
  },
  {
    id: 'inv2',
    sku: 'EO-5W30-4L',
    name: 'Engine Oil 5W-30 4L',
    category: 'Fluids',
    stock: 24,
    minStock: 10,
    unit: 'Can',
    costPrice: 450,
    sellPrice: 650,
    supplier: 'Total Ethiopia',
    lastRestocked: '2025-05-28',
  },
  {
    id: 'inv3',
    sku: 'ATF-DEX-4L',
    name: 'ATF Transmission Fluid 4L',
    category: 'Fluids',
    stock: 2,
    minStock: 6,
    unit: 'Can',
    costPrice: 680,
    sellPrice: 950,
    supplier: 'AutoParts Ethiopia',
    lastRestocked: '2025-05-01',
  },
  {
    id: 'inv4',
    sku: 'SA-REAR-IS',
    name: 'Isuzu Rear Shock Absorber',
    category: 'Suspension',
    stock: 4,
    minStock: 2,
    unit: 'Pair',
    costPrice: 3200,
    sellPrice: 4800,
    supplier: 'Isuzu Dealer Parts',
    lastRestocked: '2025-05-10',
  },
  {
    id: 'inv5',
    sku: 'AC-COMP-HY',
    name: 'Hyundai AC Compressor',
    category: 'AC System',
    stock: 0,
    minStock: 1,
    unit: 'Unit',
    costPrice: 12500,
    sellPrice: 17000,
    supplier: 'Korean Auto Parts',
    lastRestocked: '2025-04-20',
  },
  {
    id: 'inv6',
    sku: 'AF-UNIV-01',
    name: 'Air Filter Universal',
    category: 'Engine',
    stock: 15,
    minStock: 8,
    unit: 'Unit',
    costPrice: 280,
    sellPrice: 420,
    supplier: 'AutoParts Ethiopia',
    lastRestocked: '2025-05-25',
  },
]

// ─── DASHBOARD STATS ──────────────────────────────────────────
export const mockDashboardStats = {
  dailyRevenue: 28500,
  dailyRevenueChange: 12.4,
  monthlyRevenue: 486200,
  monthlyRevenueChange: 8.7,
  vehiclesInGarage: 7,
  vehiclesInGarageChange: 2,
  activeRepairs: 3,
  activeRepairsChange: 1,
  pendingApprovals: 1,
  pendingInspections: 1,
  inventoryAlerts: 3,
  completedToday: 2,
}

export const mockRevenueData = [
  { month: 'Jan', revenue: 320000, repairs: 42 },
  { month: 'Feb', revenue: 298000, repairs: 38 },
  { month: 'Mar', revenue: 415000, repairs: 55 },
  { month: 'Apr', revenue: 380000, repairs: 49 },
  { month: 'May', revenue: 452000, repairs: 61 },
  { month: 'Jun', revenue: 486200, repairs: 58 },
]

export const mockJobStatusData = [
  { name: 'Completed', value: 42, color: '#22c55e' },
  { name: 'In Progress', value: 8, color: '#3b82f6' },
  { name: 'Waiting Parts', value: 3, color: '#f59e0b' },
  { name: 'Quality Check', value: 2, color: '#8b5cf6' },
  { name: 'Pending', value: 5, color: '#64748b' },
]

export const mockActivityFeed = [
  {
    id: 'a1',
    type: 'inspection_completed',
    message: 'Inspection completed for Isuzu D-Max (AA-4-12398)',
    user: 'Biruk Tesfaye',
    time: '10 min ago',
    icon: 'check',
  },
  {
    id: 'a2',
    type: 'quotation_sent',
    message: 'Quotation #Q-2025-041 sent to Dawit Bekele',
    user: 'System',
    time: '25 min ago',
    icon: 'send',
  },
  {
    id: 'a3',
    type: 'parts_ordered',
    message: 'AC Compressor ordered for Mitsubishi Pajero',
    user: 'Inventory',
    time: '1 hr ago',
    icon: 'package',
  },
  {
    id: 'a4',
    type: 'work_order_started',
    message: 'Work order WO-001 started on Toyota Land Cruiser',
    user: 'Biruk Tesfaye',
    time: '2 hr ago',
    icon: 'wrench',
  },
  {
    id: 'a5',
    type: 'vehicle_registered',
    message: 'New vehicle registered: Toyota Hilux (AA-1-98234)',
    user: 'Reception',
    time: '3 hr ago',
    icon: 'car',
  },
  {
    id: 'a6',
    type: 'invoice_paid',
    message: 'Invoice #INV-2025-089 paid — Ford Ranger — ETB 9,800',
    user: 'Finance',
    time: '4 hr ago',
    icon: 'check-circle',
  },
]

export const vehicleStatusConfig: Record<
  VehicleStatus,
  { label: string; color: string; bg: string }
> = {
  registered: { label: 'Registered', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
  under_inspection: { label: 'Under Inspection', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
  awaiting_approval: { label: 'Awaiting Approval', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
  approved: { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  in_repair: { label: 'In Repair', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
  quality_check: { label: 'Quality Check', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950' },
  ready: { label: 'Ready', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
  delivered: { label: 'Delivered', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
}

export const workOrderStatusConfig: Record<
  WorkOrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pending', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-800' },
  assigned: { label: 'Assigned', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
  in_progress: { label: 'In Progress', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
  waiting_parts: { label: 'Waiting Parts', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
  quality_check: { label: 'Quality Check', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950' },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  delivered: { label: 'Delivered', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
}

export const severityConfig: Record<
  Severity,
  { label: string; color: string; bg: string; border: string }
> = {
  critical: {
    label: 'Critical',
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
  },
  high: {
    label: 'High',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 dark:border-amber-800',
  },
  low: {
    label: 'Low',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
  },
}
