// ============================================
// GARAGE INSPECTION & REPAIR MANAGEMENT PLATFORM
// Type Definitions
// ============================================

// ============================================
// USER ROLES
// ============================================
export type UserRole =
  | 'super_admin'
  | 'garage_manager'
  | 'receptionist'
  | 'inspector'
  | 'technician'
  | 'accountant'
  | 'customer';

// ============================================
// USER
// ============================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// VEHICLE
// ============================================
export type VehicleStatus =
  | 'registered'
  | 'under_inspection'
  | 'awaiting_approval'
  | 'approved'
  | 'in_repair'
  | 'quality_check'
  | 'ready'
  | 'delivered';

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  color: string;
  mileage: number;
  status: VehicleStatus;
  images: string[];
  currentInspectionId?: string;
  currentWorkOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CUSTOMER
// ============================================
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  vehicles: Vehicle[];
  totalSpent: number;
  visitsCount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INSPECTION
// ============================================
export type InspectionCategory =
  | 'engine'
  | 'transmission'
  | 'brake_system'
  | 'suspension'
  | 'steering'
  | 'electrical'
  | 'ac_system'
  | 'cooling_system'
  | 'tires'
  | 'body_work';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface InspectionFinding {
  id: string;
  title: string;
  description: string;
  category: InspectionCategory;
  severity: SeverityLevel;
  recommendedAction: string;
  requiredParts?: InspectionPart[];
  estimatedLaborHours: number;
  photos: string[];
  videos: string[];
  isApproved?: boolean;
}

export interface InspectionPart {
  name: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  supplier?: string;
}

export interface Inspection {
  id: string;
  vehicleId: string;
  inspectorId: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  findings: InspectionFinding[];
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// QUOTATION
// ============================================
export type QuotationStatus = 'pending' | 'approved' | 'partially_approved' | 'rejected' | 'expired';

export interface QuotationItem {
  id: string;
  type: 'part' | 'labor' | 'service';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  findingId?: string;
}

export interface Quotation {
  id: string;
  vehicleId: string;
  customerId: string;
  inspectionId: string;
  status: QuotationStatus;
  items: QuotationItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountPercent: number;
  discountAmount: number;
  serviceCharges: number;
  totalAmount: number;
  validUntil: string;
  notes?: string;
  approvedItems?: string[];
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// WORK ORDER
// ============================================
export type WorkOrderStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'waiting_parts'
  | 'quality_check'
  | 'completed'
  | 'delivered';

export interface WorkOrderAssignment {
  technicianId: string;
  task: string;
  estimatedHours: number;
  actualHours?: number;
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
}

export interface WorkOrder {
  id: string;
  vehicleId: string;
  customerId: string;
  quotationId: string;
  status: WorkOrderStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignments: WorkOrderAssignment[];
  partsNeeded: {
    name: string;
    partNumber?: string;
    quantity: number;
    status: 'pending' | 'ordered' | 'received' | 'installed';
  }[];
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  qualityCheckNotes?: string;
  qualityCheckPassed?: boolean;
  totalLaborHours: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TECHNICIAN
// ============================================
export interface TechnicianSkill {
  category: string;
  level: 'junior' | 'intermediate' | 'senior' | 'expert';
  yearsExperience: number;
}

export interface Technician {
  id: string;
  userId: string;
  employeeId: string;
  skills: TechnicianSkill[];
  hourlyRate: number;
  currentWorkload: number;
  maxWorkload: number;
  activeWorkOrders: string[];
  completedJobs: number;
  averageRating: number;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// INVENTORY
// ============================================
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order';

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  supplierId: string;
  location?: string;
  status: StockStatus;
  images: string[];
  compatibleVehicles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  isActive: boolean;
  rating: number;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: {
    partId: string;
    quantity: number;
    unitPrice: number;
  }[];
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'received' | 'cancelled';
  totalAmount: number;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FINANCE
// ============================================
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'bank_transfer' | 'check';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Invoice {
  id: string;
  quotationId: string;
  workOrderId: string;
  customerId: string;
  vehicleId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  payments: Payment[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  reference?: string;
  paidAt: string;
  notes?: string;
}

// ============================================
// DASHBOARD METRICS
// ============================================
export interface DashboardMetrics {
  dailyRevenue: number;
  monthlyRevenue: number;
  vehiclesInGarage: number;
  activeRepairs: number;
  pendingApprovals: number;
  pendingInspections: number;
  inventoryAlerts: number;
  technicianPerformance: TechnicianMetric[];
  recentActivities: Activity[];
  upcomingDeliveries: Vehicle[];
}

export interface TechnicianMetric {
  technicianId: string;
  name: string;
  completedJobs: number;
  efficiency: number;
  rating: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// NOTIFICATION
// ============================================
export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ============================================
// PAGINATION
// ============================================
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}