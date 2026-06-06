import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/quotations')({
  component: lazy(() => import('@/features/quotations/quotations-page')),
})
