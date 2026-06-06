import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import WorkOrdersPage from '@/features/work-orders/index'

export const Route = createFileRoute('/_authenticated/work-orders')({
  component: lazy(() => Promise.resolve({ default: WorkOrdersPage })),
})
