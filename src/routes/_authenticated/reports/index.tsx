import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/reports'

export const Route = createFileRoute('/_authenticated/reports/')({
  component: Page,
})
