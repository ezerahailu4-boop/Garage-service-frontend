import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/technicians/$technicianId')({
  component: lazy(() => import('@/features/technicians').then(m => ({ default: m.TechnicianDetail }))),
})
