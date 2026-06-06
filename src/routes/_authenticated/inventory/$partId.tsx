import { lazy } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/inventory/$partId')({
  component: lazy(() => import('@/features/inventory').then(m => ({ default: m.PartDetail }))),
})
