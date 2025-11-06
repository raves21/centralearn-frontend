import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/sections/$sectionId/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/sections/$sectionId/edit/"!</div>
}
