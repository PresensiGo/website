import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/data-management/batches/$batchId/majors/$majorId/classrooms/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="container mx-auto p-4">
        <p>Daftar Classrooms</p>
      </div>
    </>
  );
}
