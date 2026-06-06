import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/inspections/$inspectionId')({
  component: lazy(() => import('@/features/inspections').then(m => ({ default: m.InspectionDetail }))),
})
