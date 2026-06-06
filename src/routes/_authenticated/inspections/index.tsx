import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/inspections'

export const Route = createFileRoute('/_authenticated/inspections/')({
  component: Page,
})
