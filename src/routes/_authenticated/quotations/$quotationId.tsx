import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/quotations/$quotationId')({
  component: lazy(() => import('@/features/quotations/quotation-detail')),
})
