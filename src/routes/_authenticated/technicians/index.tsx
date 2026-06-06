import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/technicians'

export const Route = createFileRoute('/_authenticated/technicians/')({
  component: Page,
})
