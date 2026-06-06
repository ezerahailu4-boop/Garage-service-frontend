// ============================================
// GARAGE INSPECTION & REPAIR MANAGEMENT PLATFORM
// Mock Data Services
// ============================================

import { faker } from '@faker-js/faker';
import type {
  User,
  Customer,
  Vehicle,
  VehicleStatus,
  Inspection,
  InspectionFinding,
  InspectionCategory,
  SeverityLevel,
  Quotation,
  QuotationItem,
  WorkOrder,
  WorkOrderStatus,
  Technician,
  SparePart,
  Supplier,
  Invoice,
  Notification,
  DashboardMetrics,
  Activity,
  TechnicianMetric,
} from '@/types/garage';

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = () => faker.string.uuid();

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const inspectionCategories: InspectionCategory[] = [
  'engine',
  'transmission',
  'brake_system',
  'suspension',
  'steering',
  'electrical',
  'ac_system',
  'cooling_system',
  'tires',
  'body_work',
];

const severityLevels: SeverityLevel[] = ['critical', 'high', 'medium', 'low'];

const vehicleStatuses: VehicleStatus[] = [
  'registered',
  'under_inspection',
  'awaiting_approval',
  'approved',
  'in_repair',
  'quality_check',
  'ready',
  'delivered',
];

const workOrderStatuses: WorkOrderStatus[] = [
  'pending',
  'assigned',
  'in_progress',
  'waiting_parts',
  'quality_check',
  'completed',
  'delivered',
];

const carMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Kia'];

// ============================================
// MOCK DATA GENERATORS
// ============================================

export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
    role: faker.helpers.arrayElement<User['role']>([
      'super_admin',
      'garage_manager',
      'receptionist',
      'inspector',
      'technician',
      'accountant',
    ]),
    avatar: faker.image.avatar(),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2023, 0, 1), new Date()),
  }));
};

export const generateCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    alternatePhone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    notes: faker.lorem.sentence(),
    vehicles: [],
    totalSpent: faker.number.float({ min: 0, max: 50000, fractionDigits: 2 }),
    visitsCount: faker.number.int({ min: 1, max: 20 }),
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2022, 0, 1), new Date()),
  }));
};

export const generateVehicles = (customers: Customer[], count: number): Vehicle[] => {
  return Array.from({ length: count }, () => {
    const customer = faker.helpers.arrayElement(customers);
    const make = faker.helpers.arrayElement(carMakes);
    return {
      id: generateId(),
      customerId: customer.id,
      make,
      model: faker.vehicle.model(),
      year: faker.number.int({ min: 2000, max: 2024 }),
      vin: faker.vehicle.vin(),
      licensePlate: faker.vehicle.vrm(),
      color: faker.vehicle.color(),
      mileage: faker.number.int({ min: 1000, max: 200000 }),
      status: faker.helpers.arrayElement(vehicleStatuses),
      images: [faker.image.urlPicsumPhotos(), faker.image.urlPicsumPhotos()],
      currentInspectionId: undefined,
      currentWorkOrderId: undefined,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: randomDate(new Date(2023, 0, 1), new Date()),
    };
  });
};

export const generateInspectionFindings = (count: number): InspectionFinding[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    title: faker.helpers.arrayElement([
      'Brake Pad Wear',
      'Oil Leak',
      'Battery Low',
      'Tire Tread Low',
      'AC Not Cooling',
      'Engine Misfire',
      'Transmission Slip',
      'Suspension Noise',
      'Steering Vibration',
      'Coolant Leak',
    ]),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(inspectionCategories),
    severity: faker.helpers.arrayElement(severityLevels),
    recommendedAction: faker.lorem.sentence(),
    requiredParts: [
      {
        name: faker.vehicle.fuel(),
        partNumber: faker.string.alphanumeric(8).toUpperCase(),
        quantity: faker.number.int({ min: 1, max: 4 }),
        unitPrice: faker.number.float({ min: 20, max: 500, fractionDigits: 2 }),
      },
    ],
    estimatedLaborHours: faker.number.float({ min: 0.5, max: 8, fractionDigits: 1 }),
    photos: [faker.image.urlPicsumPhotos()],
    videos: [],
    isApproved: faker.datatype.boolean({ probability: 0.7 }),
  }));
};

export const generateInspections = (vehicles: Vehicle[], users: User[], count: number): Inspection[] => {
  const inspectors = users.filter((u) => u.role === 'inspector');
  return Array.from({ length: count }, () => {
    const vehicle = faker.helpers.arrayElement(vehicles);
    const inspector = faker.helpers.arrayElement(inspectors);
    const findings = generateInspectionFindings(faker.number.int({ min: 1, max: 5 }));
    return {
      id: generateId(),
      vehicleId: vehicle.id,
      inspectorId: inspector?.id || users[0].id,
      status: faker.helpers.arrayElement<Inspection['status']>(['draft', 'in_progress', 'completed', 'cancelled']),
      findings,
      overallCondition: faker.helpers.arrayElement(['excellent', 'good', 'fair', 'poor']),
      notes: faker.lorem.paragraph(),
      startedAt: randomDate(new Date(2024, 0, 1), new Date()),
      completedAt: randomDate(new Date(2024, 0, 1), new Date()),
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: randomDate(new Date(2024, 0, 1), new Date()),
    };
  });
};

export const generateQuotations = (
  vehicles: Vehicle[],
  customers: Customer[],
  inspections: Inspection[],
  count: number
): Quotation[] => {
  return Array.from({ length: count }, (_i) => {
    const vehicle = faker.helpers.arrayElement(vehicles);
    const customer = customers.find((c) => c.id === vehicle.customerId) || faker.helpers.arrayElement(customers);
    const inspection = faker.helpers.arrayElement(inspections);
    const items: QuotationItem[] = inspection.findings.flatMap((finding) => [
      ...(finding.requiredParts || []).map((part) => ({
        id: generateId(),
        type: 'part' as const,
        description: part.name,
        quantity: part.quantity,
        unitPrice: part.unitPrice,
        total: part.quantity * part.unitPrice,
        findingId: finding.id,
      })),
      {
        id: generateId(),
        type: 'labor' as const,
        description: `Labor - ${finding.title}`,
        quantity: finding.estimatedLaborHours,
        unitPrice: 50,
        total: finding.estimatedLaborHours * 50,
        findingId: finding.id,
      },
    ]);

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.16;
    const taxAmount = subtotal * taxRate;
    const discountPercent = faker.number.float({ min: 0, max: 0.15, fractionDigits: 2 });
    const discountAmount = subtotal * discountPercent;
    const serviceCharges = 25;
    const totalAmount = subtotal + taxAmount - discountAmount + serviceCharges;

    return {
      id: generateId(),
      vehicleId: vehicle.id,
      customerId: customer.id,
      inspectionId: inspection.id,
      status: faker.helpers.arrayElement<Quotation['status']>([
        'pending',
        'approved',
        'partially_approved',
        'rejected',
        'expired',
      ]),
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountPercent,
      discountAmount,
      serviceCharges,
      totalAmount,
      validUntil: faker.date.future().toISOString(),
      notes: faker.lorem.sentence(),
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: randomDate(new Date(2024, 0, 1), new Date()),
    };
  });
};

export const generateWorkOrders = (
  vehicles: Vehicle[],
  customers: Customer[],
  quotations: Quotation[],
  technicians: Technician[],
  count: number
): WorkOrder[] => {
  return Array.from({ length: count }, () => {
    const quotation = faker.helpers.arrayElement(quotations);
    const vehicle = vehicles.find((v) => v.id === quotation.vehicleId) || faker.helpers.arrayElement(vehicles);
    const customer = customers.find((c) => c.id === vehicle.customerId) || faker.helpers.arrayElement(customers);

    const assignments = quotation.items
      .filter((item) => item.type === 'labor')
      .map((item) => ({
        technicianId: faker.helpers.arrayElement(technicians).id,
        task: item.description,
        estimatedHours: item.quantity,
        status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed'] as const),
        startedAt: randomDate(new Date(2024, 0, 1), new Date()),
      }));

    return {
      id: generateId(),
      vehicleId: vehicle.id,
      customerId: customer.id,
      quotationId: quotation.id,
      status: faker.helpers.arrayElement(workOrderStatuses),
      priority: faker.helpers.arrayElement(['low', 'normal', 'high', 'urgent'] as const),
      assignments,
      partsNeeded: quotation.items
        .filter((item) => item.type === 'part')
        .map((item) => ({
          name: item.description,
          quantity: item.quantity,
          status: faker.helpers.arrayElement(['pending', 'ordered', 'received', 'installed'] as const),
        })),
      estimatedCompletionDate: faker.date.future().toISOString(),
      totalLaborHours: assignments.reduce((sum, a) => sum + a.estimatedHours, 0),
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: randomDate(new Date(2024, 0, 1), new Date()),
    };
  });
};

export const generateTechnicians = (users: User[], count: number): Technician[] => {
  return Array.from({ length: count }, (i) => {
    const user = users[i % users.length];
    return {
      id: generateId(),
      userId: user.id,
      employeeId: `TECH-${String(i + 1).padStart(4, '0')}`,
      skills: [
        {
          category: faker.helpers.arrayElement(inspectionCategories),
          level: faker.helpers.arrayElement(['junior', 'intermediate', 'senior', 'expert']),
          yearsExperience: faker.number.int({ min: 1, max: 20 }),
        },
      ],
      hourlyRate: faker.number.float({ min: 25, max: 100, fractionDigits: 2 }),
      currentWorkload: faker.number.int({ min: 0, max: 40 }),
      maxWorkload: 40,
      activeWorkOrders: [],
      completedJobs: faker.number.int({ min: 10, max: 500 }),
      averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
      isActive: faker.datatype.boolean({ probability: 0.95 }),
      createdAt: randomDate(new Date(2022, 0, 1), new Date()),
    };
  });
};

export const generateSpareParts = (suppliers: Supplier[], count: number): SparePart[] => {
  return Array.from({ length: count }, () => {
    const supplier = faker.helpers.arrayElement(suppliers);
    const stockQuantity = faker.number.int({ min: 0, max: 100 });
    const minStockLevel = faker.number.int({ min: 5, max: 20 });
    return {
      id: generateId(),
      partNumber: faker.string.alphanumeric(10).toUpperCase(),
      name: faker.helpers.arrayElement([
        'Brake Pad',
        'Oil Filter',
        'Air Filter',
        'Spark Plug',
        'Battery',
        'Alternator',
        'Water Pump',
        'Timing Belt',
        'Radiator',
        'Fuel Pump',
        'Oxygen Sensor',
        'Catalytic Converter',
        'Shock Absorber',
        'Ball Joint',
        'Tie Rod End',
        'Wheel Bearing',
        'CV Joint',
        'Brake Rotor',
        'Brake Caliper',
        'Clutch Kit',
      ]),
      description: faker.lorem.sentence(),
      category: faker.helpers.arrayElement(inspectionCategories),
      brand: faker.company.name(),
      unitPrice: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      costPrice: faker.number.float({ min: 5, max: 500, fractionDigits: 2 }),
      stockQuantity,
      minStockLevel,
      maxStockLevel: minStockLevel * 3,
      supplierId: supplier.id,
      location: `Aisle ${faker.number.int({ min: 1, max: 10 })}, Shelf ${faker.number.int({ min: 1, max: 5 })}`,
      status: stockQuantity === 0 ? 'out_of_stock' : stockQuantity < minStockLevel ? 'low_stock' : 'in_stock',
      images: [faker.image.urlPicsumPhotos()],
      compatibleVehicles: carMakes.slice(0, faker.number.int({ min: 1, max: 5 })),
      createdAt: randomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: randomDate(new Date(2023, 0, 1), new Date()),
    };
  });
};

export const generateSuppliers = (count: number): Supplier[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    name: faker.company.name(),
    contactPerson: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    paymentTerms: faker.helpers.arrayElement(['Net 30', 'Net 60', 'COD', '50% Advance']),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
  }));
};

let invoiceCounter = 0;

export const generateInvoices = (
  quotations: Quotation[],
  workOrders: WorkOrder[],
  count: number
): Invoice[] => {
  return Array.from({ length: count }, () => {
    invoiceCounter++;
    const quotation = faker.helpers.arrayElement(quotations);
    const workOrder = workOrders.find((wo) => wo.quotationId === quotation.id) || faker.helpers.arrayElement(workOrders);
    const paidAmount = faker.number.float({ min: 0, max: quotation.totalAmount, fractionDigits: 2 });
    return {
      id: generateId(),
      quotationId: quotation.id,
      workOrderId: workOrder.id,
      customerId: quotation.customerId,
      vehicleId: quotation.vehicleId,
      invoiceNumber: `INV-${String(invoiceCounter).padStart(6, '0')}`,
      status: faker.helpers.arrayElement<Invoice['status']>(['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled']),
      items: quotation.items,
      subtotal: quotation.subtotal,
      taxAmount: quotation.taxAmount,
      discountAmount: quotation.discountAmount,
      totalAmount: quotation.totalAmount,
      paidAmount,
      dueAmount: quotation.totalAmount - paidAmount,
      dueDate: faker.date.future().toISOString(),
      payments: paidAmount > 0
        ? [{
            id: generateId(),
            invoiceId: '',
            amount: paidAmount,
            method: faker.helpers.arrayElement(['cash', 'card', 'mobile', 'bank_transfer', 'check']),
            status: 'completed',
            paidAt: randomDate(new Date(2024, 0, 1), new Date()),
          }]
        : [],
      createdAt: randomDate(new Date(2024, 0, 1), new Date()),
      updatedAt: randomDate(new Date(2024, 0, 1), new Date()),
    };
  });
};

export const generateNotifications = (count: number): Notification[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    type: faker.helpers.arrayElement<Notification['type']>(['info', 'warning', 'error', 'success']),
    priority: faker.helpers.arrayElement<Notification['priority']>(['low', 'normal', 'high', 'urgent']),
    title: faker.lorem.sentence({ min: 3, max: 6 }),
    message: faker.lorem.paragraph(),
    isRead: faker.datatype.boolean({ probability: 0.3 }),
    actionUrl: faker.internet.url(),
    createdAt: randomDate(new Date(2024, 0, 1), new Date()),
  }));
};

export const generateActivities = (users: User[], count: number): Activity[] => {
  const activityTypes = [
    'vehicle_registered',
    'inspection_completed',
    'quotation_created',
    'quotation_approved',
    'work_started',
    'work_completed',
    'invoice_generated',
    'payment_received',
  ];

  return Array.from({ length: count }, () => {
    const user = faker.helpers.arrayElement(users);
    const type = faker.helpers.arrayElement(activityTypes);
    return {
      id: generateId(),
      type,
      description: faker.lorem.sentence(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      timestamp: randomDate(new Date(2024, 0, 1), new Date()),
    };
  });
};

export const generateDashboardMetrics = (
  vehicles: Vehicle[],
  workOrders: WorkOrder[],
  inspections: Inspection[],
  quotations: Quotation[],
  technicians: Technician[],
  invoices: Invoice[]
): DashboardMetrics => {
  const dailyRevenue = invoices
    .filter((inv) => new Date(inv.createdAt) > new Date(Date.now() - 86400000))
    .reduce((sum, inv) => sum + inv.paidAmount, 0);

  const monthlyRevenue = invoices
    .filter((inv) => new Date(inv.createdAt) > new Date(Date.now() - 30 * 86400000))
    .reduce((sum, inv) => sum + inv.paidAmount, 0);

  const vehiclesInGarage = vehicles.filter((v) =>
    ['under_inspection', 'awaiting_approval', 'approved', 'in_repair', 'quality_check', 'ready'].includes(v.status)
  ).length;

  const activeRepairs = workOrders.filter((wo) =>
    ['assigned', 'in_progress', 'waiting_parts', 'quality_check'].includes(wo.status)
  ).length;

  const pendingApprovals = quotations.filter((q) => q.status === 'pending').length;

  const pendingInspections = inspections.filter((i) => i.status === 'in_progress').length;

  const inventoryAlerts = faker.number.int({ min: 1, max: 10 });

  const technicianPerformance: TechnicianMetric[] = technicians.slice(0, 5).map((t) => ({
    technicianId: t.id,
    name: t.employeeId,
    completedJobs: t.completedJobs,
    efficiency: faker.number.float({ min: 70, max: 100, fractionDigits: 1 }),
    rating: t.averageRating,
  }));

  const recentActivities: Activity[] = generateActivities([], 10).map((a, i) => ({
    ...a,
    userName: faker.person.fullName(),
    timestamp: randomDate(new Date(Date.now() - 7 * 86400000), new Date()),
  }));

  const upcomingDeliveries = vehicles
    .filter((v) => v.status === 'quality_check' || v.status === 'ready')
    .slice(0, 5);

  return {
    dailyRevenue,
    monthlyRevenue,
    vehiclesInGarage,
    activeRepairs,
    pendingApprovals,
    pendingInspections,
    inventoryAlerts,
    technicianPerformance,
    recentActivities,
    upcomingDeliveries,
  };
};

// ============================================
// PRE-GENERATED MOCK DATA
// ============================================

const mockUsers = generateUsers(20);
const mockCustomers = generateCustomers(50);
const mockVehicles = generateVehicles(mockCustomers, 100);
const mockTechnicians = generateTechnicians(mockUsers, 8);
const mockSuppliers = generateSuppliers(5);
const mockSpareParts = generateSpareParts(mockSuppliers, 200);
const mockInspections = generateInspections(mockVehicles, mockUsers, 80);
const mockQuotations = generateQuotations(mockVehicles, mockCustomers, mockInspections, 60);
const mockWorkOrders = generateWorkOrders(mockVehicles, mockCustomers, mockQuotations, mockTechnicians, 50);
const mockInvoices = generateInvoices(mockQuotations, mockWorkOrders, 40);
const mockNotifications = generateNotifications(15);
const mockActivities = generateActivities(mockUsers, 25);
const mockDashboardMetrics = generateDashboardMetrics(
  mockVehicles,
  mockWorkOrders,
  mockInspections,
  mockQuotations,
  mockTechnicians,
  mockInvoices
);

// ============================================
// MOCK API SERVICE
// ============================================

export const mockApi = {
  // Dashboard
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    await simulateDelay();
    return mockDashboardMetrics;
  },

  // Customers
  getCustomers: async (params?: { search?: string; page?: number; limit?: number }) => {
    await simulateDelay();
    let filtered = mockCustomers;
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = mockCustomers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(search) ||
          c.lastName.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.includes(search)
      );
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  },

  getCustomer: async (id: string): Promise<Customer | undefined> => {
    await simulateDelay();
    return mockCustomers.find((c) => c.id === id);
  },

  createCustomer: async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'vehicles' | 'totalSpent' | 'visitsCount'>) => {
    await simulateDelay();
    const customer: Customer = {
      ...data,
      id: generateId(),
      vehicles: [],
      totalSpent: 0,
      visitsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCustomers.unshift(customer);
    return customer;
  },

  // Vehicles
  getVehicles: async (params?: { search?: string; status?: VehicleStatus; page?: number; limit?: number }) => {
    await simulateDelay();
    let filtered = mockVehicles;
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = mockVehicles.filter(
        (v) =>
          v.make.toLowerCase().includes(search) ||
          v.model.toLowerCase().includes(search) ||
          v.licensePlate.toLowerCase().includes(search) ||
          v.vin.toLowerCase().includes(search)
      );
    }
    if (params?.status) {
      filtered = filtered.filter((v) => v.status === params.status);
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  },

  getVehicle: async (id: string): Promise<Vehicle | undefined> => {
    await simulateDelay();
    return mockVehicles.find((v) => v.id === id);
  },

  updateVehicleStatus: async (id: string, status: VehicleStatus) => {
    await simulateDelay();
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index !== -1) {
      mockVehicles[index].status = status;
      mockVehicles[index].updatedAt = new Date().toISOString();
      return mockVehicles[index];
    }
    return undefined;
  },

  // Inspections
  getInspections: async (params?: { vehicleId?: string; status?: string; page?: number; limit?: number }) => {
    await simulateDelay();
    let filtered = mockInspections;
    if (params?.vehicleId) {
      filtered = filtered.filter((i) => i.vehicleId === params.vehicleId);
    }
    if (params?.status) {
      filtered = filtered.filter((i) => i.status === params.status);
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  },

  getInspection: async (id: string): Promise<Inspection | undefined> => {
    await simulateDelay();
    return mockInspections.find((i) => i.id === id);
  },

  createInspection: async (data: Omit<Inspection, 'id' | 'createdAt' | 'updatedAt'>) => {
    await simulateDelay();
    const inspection: Inspection = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockInspections.unshift(inspection);
    return inspection;
  },

  updateInspection: async (id: string, data: Partial<Inspection>) => {
    await simulateDelay();
    const index = mockInspections.findIndex((i) => i.id === id);
    if (index !== -1) {
      mockInspections[index] = { ...mockInspections[index], ...data, updatedAt: new Date().toISOString() };
      return mockInspections[index];
    }
    return undefined;
  },

  // Quotations
  getQuotations: async (params?: { status?: string; page?: number; limit?: number }) => {
    await simulateDelay();
    let filtered = mockQuotations;
    if (params?.status) {
      filtered = filtered.filter((q) => q.status === params.status);
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  },

  getQuotation: async (id: string): Promise<Quotation | undefined> => {
    await simulateDelay();
    return mockQuotations.find((q) => q.id === id);
  },

  updateQuotationStatus: async (id: string, status: Quotation['status']) => {
    await simulateDelay();
    const index = mockQuotations.findIndex((q) => q.id === id);
    if (index !== -1) {
      mockQuotations[index].status = status;
      mockQuotations[index].updatedAt = new Date().toISOString();
      return mockQuotations[index];
    }
    return undefined;
  },

  createQuotation: async (data: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    await simulateDelay();
    const quotation: Quotation = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockQuotations.unshift(quotation);
    return quotation;
  },

  // Work Orders
  getWorkOrders: async (params?: { status?: WorkOrderStatus; priority?: string; page?: number; limit?: number }) => {
    await simulateDelay();
    let filtered = mockWorkOrders;
    if (params?.status) {
      filtered = filtered.filter((wo) => wo.status === params.status);
    }
    if (params?.priority) {
      filtered = filtered.filter((wo) => wo.priority === params.priority);
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  },

  getWorkOrder: async (id: string): Promise<WorkOrder | undefined> => {
    await simulateDelay();
    return mockWorkOrders.find((wo) => wo.id === id);
  },

  updateWorkOrderStatus: async (id: string, status: WorkOrderStatus) => {
    await simulateDelay();
    const index = mockWorkOrders.findIndex((wo) => wo.id === id);
    if (index !== -1) {
      mockWorkOrders[index].status = status;
      mockWorkOrders[index].updatedAt = new Date().toISOString();
      return mockWorkOrders[index];
    }
    return undefined;
  },

  assignTechnician: async (workOrderId: string, technicianId: string, task: string, estimatedHours: number) => {
    await simulateDelay();
    const index = mockWorkOrders.findIndex((wo) => wo.id === workOrderId);
    if (index !== -1) {
      mockWorkOrders[index].assignments.push({
        technicianId,
        task,
        estimatedHours,
        status: 'pending',
      });
      mockWorkOrders[index].updatedAt = new Date().toISOString();
      return mockWorkOrders[index];
    }
    return undefined;
  },

  createWorkOrder: async (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    await simulateDelay();
    const workOrder: WorkOrder = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockWorkOrders.unshift(workOrder);
    return workOrder;
  },

  // Technicians
  getTechnicians: async () => {
    await simulateDelay();
    return mockTechnicians;
  },

  getTechnician: async (id: string): Promise<Technician | undefined> => {
    await simulateDelay();
    return mockTechnicians.find((t) => t.id === id);
  },

  // Inventory
  getSpareParts: async (params?: { search?: string; category?: string; status?: string; page?: number; limit?: number }) => {
    await simulateDelay();
    let filtered = mockSpareParts;
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = mockSpareParts.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.partNumber.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }
    if (params?.category) {
      filtered = filtered.filter((p) => p.category === params.category);
    }
    if (params?.status) {
      filtered = filtered.filter((p) => p.status === params.status);
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  },

  getSparePart: async (id: string): Promise<SparePart | undefined> => {
    await simulateDelay();
    return mockSpareParts.find((p) => p.id === id);
  },

  getLowStockParts: async () => {
    await simulateDelay();
    return mockSpareParts.filter((p) => p.stockQuantity <= p.minStockLevel);
  },

  // Suppliers
  getSuppliers: async () => {
    await simulateDelay();
    return mockSuppliers;
  },

  // Invoices
  getInvoices: async (params?: { status?: string; page?: number; limit?: number }) => {
    await simulateDelay();
    let filtered = mockInvoices;
    if (params?.status) {
      filtered = filtered.filter((inv) => inv.status === params.status);
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  },

  getInvoice: async (id: string): Promise<Invoice | undefined> => {
    await simulateDelay();
    return mockInvoices.find((inv) => inv.id === id);
  },

  // Notifications
  getNotifications: async (unreadOnly = false) => {
    await simulateDelay();
    return unreadOnly ? mockNotifications.filter((n) => !n.isRead) : mockNotifications;
  },

  markNotificationAsRead: async (id: string) => {
    await simulateDelay();
    const index = mockNotifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      mockNotifications[index].isRead = true;
      return mockNotifications[index];
    }
    return undefined;
  },

  // Activities
  getActivities: async (limit = 25) => {
    await simulateDelay();
    return mockActivities.slice(0, limit);
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function simulateDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function paginate<T>(data: T[], page: number, limit: number) {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: data.slice(start, end),
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}