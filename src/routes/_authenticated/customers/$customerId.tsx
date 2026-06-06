import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

export const Route = createFileRoute('/_authenticated/customers/$customerId')({
  component: lazy(() => import('@/features/customers').then(m => ({ default: m.CustomerDetail }))),
  loader: ({ params }) => ({ customerId: params.customerId }),
})