import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'
import type { Vehicle } from '@/types/garage'

const VehiclesPage = lazy(() => import('@/features/vehicles'))

export const Route = createFileRoute('/_authenticated/vehicles')({
  component: VehiclesPage,
})