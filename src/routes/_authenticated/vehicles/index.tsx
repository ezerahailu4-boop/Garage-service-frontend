import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/vehicles'

export const Route = createFileRoute('/_authenticated/vehicles/')({
  component: Page,
})
