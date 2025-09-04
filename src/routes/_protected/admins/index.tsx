import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admins/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admins/"!</div>
}
