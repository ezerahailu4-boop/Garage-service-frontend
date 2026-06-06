import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/work-orders'

export const Route = createFileRoute('/_authenticated/work-orders/')({
  component: Page,
})
