export const QUOTATION_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  partially_approved: { label: 'Partially Approved', color: 'bg-blue-100 text-blue-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-700' },
}

export const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-700' },
  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
}

export const INVOICE_STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  partial: { label: 'Partial', color: 'bg-yellow-100 text-yellow-700' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700' },
}

export const WORK_ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  waiting_parts: { label: 'Waiting Parts', color: 'bg-orange-100 text-orange-700' },
  quality_check: { label: 'Quality Check', color: 'bg-teal-100 text-teal-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  delivered: { label: 'Delivered', color: 'bg-slate-100 text-slate-700' },
}
