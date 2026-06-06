import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

export const Route = createFileRoute('/_authenticated/customers')({
  component: lazy(() => import('@/features/customers').then(m => ({ default: m.CustomersPage }))),
})