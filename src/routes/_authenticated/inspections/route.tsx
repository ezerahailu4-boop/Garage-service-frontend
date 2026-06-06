import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

export const Route = createFileRoute('/_authenticated/inspections')({
  component: lazy(() => import('@/features/inspections').then(m => ({ default: m.InspectionsPage }))),
})
