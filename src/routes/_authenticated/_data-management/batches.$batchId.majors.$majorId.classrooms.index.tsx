import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_data-management/batches/$batchId/majors/$majorId/classrooms/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/batches/$batchId/$majorId/"!</div>;
}
