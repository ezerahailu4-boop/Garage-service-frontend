import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/inventory'

export const Route = createFileRoute('/_authenticated/inventory/')({
  component: Page,
})
