import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import WorkOrderDetail from '@/features/work-orders/work-order-detail'

export const Route = createFileRoute('/_authenticated/work-orders/$workOrderId')({
  component: lazy(() => Promise.resolve({ default: WorkOrderDetail })),
})
