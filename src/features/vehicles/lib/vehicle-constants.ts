import { VehicleStatus } from '@/types/garage'

export const VEHICLE_STATUS: Record<VehicleStatus, { label: string; color: string }> = {
  registered: { label: 'Registered', color: 'bg-amber-100 text-amber-700' },
  under_inspection: { label: 'Under Inspection', color: 'bg-blue-100 text-blue-700' },
  awaiting_approval: { label: 'Awaiting Approval', color: 'bg-orange-100 text-orange-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  in_repair: { label: 'In Repair', color: 'bg-red-100 text-red-700' },
  quality_check: { label: 'Quality Check', color: 'bg-purple-100 text-purple-700' },
  ready: { label: 'Ready', color: 'bg-teal-100 text-teal-700' },
  delivered: { label: 'Delivered', color: 'bg-slate-100 text-slate-700' },
}