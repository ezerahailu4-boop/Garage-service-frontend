import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/invoices')({
  component: lazy(() => import('@/features/invoices').then(m => ({ default: m.InvoicesPage }))),
})
