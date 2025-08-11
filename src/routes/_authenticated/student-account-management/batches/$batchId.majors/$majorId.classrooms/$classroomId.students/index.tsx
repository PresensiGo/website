import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/student-account-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello
      "/_authenticated/student-account-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students/"!
    </div>
  );
}
