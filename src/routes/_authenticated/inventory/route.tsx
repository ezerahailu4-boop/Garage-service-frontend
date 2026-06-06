import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/inventory')({
  component: lazy(() => import('@/features/inventory').then(m => ({ default: m.InventoryPage }))),
})
