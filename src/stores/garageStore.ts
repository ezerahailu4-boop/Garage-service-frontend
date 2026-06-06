// ============================================
// GARAGE INSPECTION & REPAIR MANAGEMENT PLATFORM
// Zustand Store
// ============================================

import { create } from 'zustand';
import type {
  User,
  Customer,
  Vehicle,
  VehicleStatus,
  Inspection,
  Quotation,
  QuotationStatus,
  WorkOrder,
  WorkOrderStatus,
  Technician,
  SparePart,
  Invoice,
  Notification,
  Activity,
  DashboardMetrics,
} from '@/types/garage';
import { mockApi } from '@/services/mockData';

// ============================================
// STORE INTERFACES
// ============================================

interface GarageState {
  // Dashboard
  dashboardMetrics: DashboardMetrics | null;
  isLoadingDashboard: boolean;

  // Customers
  customers: Customer[];
  selectedCustomer: Customer | null;
  customersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoadingCustomers: boolean;

  // Vehicles
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  vehiclesPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoadingVehicles: boolean;

  // Inspections
  inspections: Inspection[];
  selectedInspection: Inspection | null;
  inspectionsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoadingInspections: boolean;

  // Quotations
  quotations: Quotation[];
  selectedQuotation: Quotation | null;
  quotationsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoadingQuotations: boolean;

  // Work Orders
  workOrders: WorkOrder[];
  selectedWorkOrder: WorkOrder | null;
  workOrdersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoadingWorkOrders: boolean;

  // Technicians
  technicians: Technician[];
  selectedTechnician: Technician | null;
  isLoadingTechnicians: boolean;

  // Inventory
  spareParts: SparePart[];
  sparePartsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  lowStockParts: SparePart[];
  isLoadingInventory: boolean;

  // Invoices
  invoices: Invoice[];
  invoicesPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoadingInvoices: boolean;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  isLoadingNotifications: boolean;

  // Activities
  activities: Activity[];
  isLoadingActivities: boolean;

  // UI State
  sidebarCollapsed: boolean;
  searchQuery: string;
  selectedRole: string;

  // User
  currentUser: User | null;
}

interface GarageActions {
  // Dashboard Actions
  fetchDashboardMetrics: () => Promise<void>;

  // Customer Actions
  fetchCustomers: (params?: { search?: string; page?: number; limit?: number }) => Promise<void>;
  fetchCustomer: (id: string) => Promise<void>;
  createCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'vehicles' | 'totalSpent' | 'visitsCount'>) => Promise<Customer>;
  setSelectedCustomer: (customer: Customer | null) => void;

  // Vehicle Actions
  fetchVehicles: (params?: { search?: string; status?: VehicleStatus; page?: number; limit?: number }) => Promise<void>;
  fetchVehicle: (id: string) => Promise<void>;
  updateVehicleStatus: (id: string, status: VehicleStatus) => Promise<void>;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;

  // Inspection Actions
  fetchInspections: (params?: { vehicleId?: string; status?: string; page?: number; limit?: number }) => Promise<void>;
  fetchInspection: (id: string) => Promise<void>;
  createInspection: (data: Omit<Inspection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Inspection>;
  updateInspection: (id: string, data: Partial<Inspection>) => Promise<Inspection | undefined>;
  setSelectedInspection: (inspection: Inspection | null) => void;

  // Quotation Actions
  fetchQuotations: (params?: { status?: string; page?: number; limit?: number }) => Promise<void>;
  fetchQuotation: (id: string) => Promise<void>;
  updateQuotationStatus: (id: string, status: QuotationStatus) => Promise<Quotation | undefined>;
  createQuotation: (data: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Quotation>;
  setSelectedQuotation: (quotation: Quotation | null) => void;

  // Work Order Actions
  fetchWorkOrders: (params?: { status?: WorkOrderStatus; priority?: string; page?: number; limit?: number }) => Promise<void>;
  fetchWorkOrder: (id: string) => Promise<void>;
  updateWorkOrderStatus: (id: string, status: WorkOrderStatus) => Promise<WorkOrder | undefined>;
  assignTechnician: (workOrderId: string, technicianId: string, task: string, estimatedHours: number) => Promise<WorkOrder | undefined>;
  setSelectedWorkOrder: (workOrder: WorkOrder | null) => void;

  // Technician Actions
  fetchTechnicians: () => Promise<void>;
  fetchTechnician: (id: string) => Promise<void>;
  setSelectedTechnician: (technician: Technician | null) => void;

  // Inventory Actions
  fetchSpareParts: (params?: { search?: string; category?: string; status?: string; page?: number; limit?: number }) => Promise<void>;
  fetchLowStockParts: () => Promise<void>;
  fetchSparePart: (id: string) => Promise<void>;

  // Invoice Actions
  fetchInvoices: (params?: { status?: string; page?: number; limit?: number }) => Promise<void>;
  fetchInvoice: (id: string) => Promise<void>;

  // Notification Actions
  fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;

  // Activity Actions
  fetchActivities: (limit?: number) => Promise<void>;

  // UI Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedRole: (role: string) => void;

  // User Actions
  setCurrentUser: (user: User | null) => void;
}

type GarageStore = GarageState & GarageActions;

// ============================================
// INITIAL STATE
// ============================================

const initialState: GarageState = {
  // Dashboard
  dashboardMetrics: null,
  isLoadingDashboard: false,

  // Customers
  customers: [],
  selectedCustomer: null,
  customersPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  isLoadingCustomers: false,

  // Vehicles
  vehicles: [],
  selectedVehicle: null,
  vehiclesPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  isLoadingVehicles: false,

  // Inspections
  inspections: [],
  selectedInspection: null,
  inspectionsPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  isLoadingInspections: false,

  // Quotations
  quotations: [],
  selectedQuotation: null,
  quotationsPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  isLoadingQuotations: false,

  // Work Orders
  workOrders: [],
  selectedWorkOrder: null,
  workOrdersPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  isLoadingWorkOrders: false,

  // Technicians
  technicians: [],
  selectedTechnician: null,
  isLoadingTechnicians: false,

  // Inventory
  spareParts: [],
  sparePartsPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  lowStockParts: [],
  isLoadingInventory: false,

  // Invoices
  invoices: [],
  invoicesPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  isLoadingInvoices: false,

  // Notifications
  notifications: [],
  unreadCount: 0,
  isLoadingNotifications: false,

  // Activities
  activities: [],
  isLoadingActivities: false,

  // UI State
  sidebarCollapsed: false,
  searchQuery: '',
  selectedRole: '',

  // User
  currentUser: null,
};

// ============================================
// STORE CREATION
// ============================================

export const useGarageStore = create<GarageStore>((set) => ({
  ...initialState,

  // ============================================
  // DASHBOARD ACTIONS
  // ============================================
  fetchDashboardMetrics: async () => {
    set({ isLoadingDashboard: true });
    try {
      const metrics = await mockApi.getDashboardMetrics();
      set({ dashboardMetrics: metrics, isLoadingDashboard: false });
    } catch {
      set({ isLoadingDashboard: false });
    }
  },

  // ============================================
  // CUSTOMER ACTIONS
  // ============================================
  fetchCustomers: async (params = {}) => {
    set({ isLoadingCustomers: true });
    try {
      const response = await mockApi.getCustomers(params);
      set({
        customers: response.data,
        customersPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoadingCustomers: false,
      });
    } catch {
      set({ isLoadingCustomers: false });
    }
  },

  fetchCustomer: async (id) => {
    try {
      const customer = await mockApi.getCustomer(id);
      if (customer) {
        set({ selectedCustomer: customer });
      }
    } catch {
      // Handle error silently
    }
  },

  createCustomer: async (data) => {
    const customer = await mockApi.createCustomer(data);
    set((state) => ({
      customers: [customer, ...state.customers],
    }));
    return customer;
  },

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  // ============================================
  // VEHICLE ACTIONS
  // ============================================
  fetchVehicles: async (params = {}) => {
    set({ isLoadingVehicles: true });
    try {
      const response = await mockApi.getVehicles(params);
      set({
        vehicles: response.data,
        vehiclesPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoadingVehicles: false,
      });
    } catch {
      set({ isLoadingVehicles: false });
    }
  },

  fetchVehicle: async (id) => {
    try {
      const vehicle = await mockApi.getVehicle(id);
      if (vehicle) {
        set({ selectedVehicle: vehicle });
      }
    } catch {
      // Handle error silently
    }
  },

  updateVehicleStatus: async (id, status) => {
    try {
      const vehicle = await mockApi.updateVehicleStatus(id, status);
      if (vehicle) {
        set((state) => ({
          vehicles: state.vehicles.map((v) => (v.id === id ? vehicle : v)),
          selectedVehicle: state.selectedVehicle?.id === id ? vehicle : state.selectedVehicle,
        }));
      }
    } catch {
      // Handle error silently
    }
  },

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  // ============================================
  // INSPECTION ACTIONS
  // ============================================
  fetchInspections: async (params = {}) => {
    set({ isLoadingInspections: true });
    try {
      const response = await mockApi.getInspections(params);
      set({
        inspections: response.data,
        inspectionsPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoadingInspections: false,
      });
    } catch {
      set({ isLoadingInspections: false });
    }
  },

  fetchInspection: async (id) => {
    try {
      const inspection = await mockApi.getInspection(id);
      if (inspection) {
        set({ selectedInspection: inspection });
      }
    } catch {
      // Handle error silently
    }
  },

  createInspection: async (data) => {
    const inspection = await mockApi.createInspection(data);
    set((state) => ({
      inspections: [inspection, ...state.inspections],
    }));
    return inspection;
  },

  updateInspection: async (id, data) => {
    const inspection = await mockApi.updateInspection(id, data);
    if (inspection) {
      set((state) => ({
        inspections: state.inspections.map((i) => (i.id === id ? inspection : i)),
        selectedInspection: state.selectedInspection?.id === id ? inspection : state.selectedInspection,
      }));
    }
    return inspection;
  },

  setSelectedInspection: (inspection) => set({ selectedInspection: inspection }),

  // ============================================
  // QUOTATION ACTIONS
  // ============================================
  fetchQuotations: async (params = {}) => {
    set({ isLoadingQuotations: true });
    try {
      const response = await mockApi.getQuotations(params);
      set({
        quotations: response.data,
        quotationsPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoadingQuotations: false,
      });
    } catch {
      set({ isLoadingQuotations: false });
    }
  },

  fetchQuotation: async (id) => {
    try {
      const quotation = await mockApi.getQuotation(id);
      if (quotation) {
        set({ selectedQuotation: quotation });
      }
    } catch {
      // Handle error silently
    }
  },

  updateQuotationStatus: async (id, status) => {
    const quotation = await mockApi.updateQuotationStatus(id, status);
    if (quotation) {
      set((state) => ({
        quotations: state.quotations.map((q) => (q.id === id ? quotation : q)),
        selectedQuotation: state.selectedQuotation?.id === id ? quotation : state.selectedQuotation,
      }));
    }
    return quotation;
  },

  setSelectedQuotation: (quotation) => set({ selectedQuotation: quotation }),

  createQuotation: async (data) => {
    const quotation = await mockApi.createQuotation(data)
    set((state) => ({
      quotations: [quotation, ...state.quotations],
    }))
    return quotation
  },

  // ============================================
  // WORK ORDER ACTIONS
  // ============================================
  fetchWorkOrders: async (params = {}) => {
    set({ isLoadingWorkOrders: true });
    try {
      const response = await mockApi.getWorkOrders(params);
      set({
        workOrders: response.data,
        workOrdersPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoadingWorkOrders: false,
      });
    } catch {
      set({ isLoadingWorkOrders: false });
    }
  },

  fetchWorkOrder: async (id) => {
    try {
      const workOrder = await mockApi.getWorkOrder(id);
      if (workOrder) {
        set({ selectedWorkOrder: workOrder });
      }
    } catch {
      // Handle error silently
    }
  },

  updateWorkOrderStatus: async (id, status) => {
    const workOrder = await mockApi.updateWorkOrderStatus(id, status);
    if (workOrder) {
      set((state) => ({
        workOrders: state.workOrders.map((wo) => (wo.id === id ? workOrder : wo)),
        selectedWorkOrder: state.selectedWorkOrder?.id === id ? workOrder : state.selectedWorkOrder,
      }));
    }
    return workOrder;
  },

  assignTechnician: async (workOrderId, technicianId, task, estimatedHours) => {
    const workOrder = await mockApi.assignTechnician(workOrderId, technicianId, task, estimatedHours);
    if (workOrder) {
      set((state) => ({
        workOrders: state.workOrders.map((wo) => (wo.id === workOrderId ? workOrder : wo)),
        selectedWorkOrder: state.selectedWorkOrder?.id === workOrderId ? workOrder : state.selectedWorkOrder,
      }));
    }
    return workOrder;
  },

  setSelectedWorkOrder: (workOrder) => set({ selectedWorkOrder: workOrder }),

  // ============================================
  // TECHNICIAN ACTIONS
  // ============================================
  fetchTechnicians: async () => {
    set({ isLoadingTechnicians: true });
    try {
      const technicians = await mockApi.getTechnicians();
      set({ technicians, isLoadingTechnicians: false });
    } catch {
      set({ isLoadingTechnicians: false });
    }
  },

  fetchTechnician: async (id) => {
    try {
      const technician = await mockApi.getTechnician(id);
      if (technician) {
        set({ selectedTechnician: technician });
      }
    } catch {
      // Handle error silently
    }
  },

  setSelectedTechnician: (technician) => set({ selectedTechnician: technician }),

  // ============================================
  // INVENTORY ACTIONS
  // ============================================
  fetchSpareParts: async (params = {}) => {
    set({ isLoadingInventory: true });
    try {
      const response = await mockApi.getSpareParts(params);
      set({
        spareParts: response.data,
        sparePartsPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoadingInventory: false,
      });
    } catch {
      set({ isLoadingInventory: false });
    }
  },

  fetchLowStockParts: async () => {
    try {
      const parts = await mockApi.getLowStockParts();
      set({ lowStockParts: parts });
    } catch {
      // Handle error silently
    }
  },

  fetchSparePart: async () => {
    try {
      await mockApi.getSparePart('');
    } catch {
      // Handle error silently
    }
  },

  // ============================================
  // INVOICE ACTIONS
  // ============================================
  fetchInvoices: async (params = {}) => {
    set({ isLoadingInvoices: true });
    try {
      const response = await mockApi.getInvoices(params);
      set({
        invoices: response.data,
        invoicesPagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoadingInvoices: false,
      });
    } catch {
      set({ isLoadingInvoices: false });
    }
  },

  fetchInvoice: async () => {
    try {
      await mockApi.getInvoice('');
    } catch {
      // Handle error silently
    }
  },

  // ============================================
  // NOTIFICATION ACTIONS
  // ============================================
  fetchNotifications: async (unreadOnly = false) => {
    set({ isLoadingNotifications: true });
    try {
      const notifications = await mockApi.getNotifications(unreadOnly);
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount, isLoadingNotifications: false });
    } catch {
      set({ isLoadingNotifications: false });
    }
  },

  markNotificationAsRead: async (id) => {
    await mockApi.markNotificationAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  // ============================================
  // ACTIVITY ACTIONS
  // ============================================
  fetchActivities: async (limit = 25) => {
    set({ isLoadingActivities: true });
    try {
      const activities = await mockApi.getActivities(limit);
      set({ activities, isLoadingActivities: false });
    } catch {
      set({ isLoadingActivities: false });
    }
  },

  // ============================================
  // UI ACTIONS
  // ============================================
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedRole: (role) => set({ selectedRole: role }),

  // ============================================
  // USER ACTIONS
  // ============================================
  setCurrentUser: (user) => set({ currentUser: user }),
}));