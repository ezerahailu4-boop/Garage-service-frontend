import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/quotations'

export const Route = createFileRoute('/_authenticated/quotations/')({
  component: Page,
})
