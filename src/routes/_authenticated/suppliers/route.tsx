import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

export const Route = createFileRoute('/_authenticated/suppliers')({
  component: lazy(() => import('@/features/suppliers').then(m => ({ default: m.SuppliersPage }))),
})
