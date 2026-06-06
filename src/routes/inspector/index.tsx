import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inspector/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/inspector/"!</div>
}
