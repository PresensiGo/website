import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/subject-attendance/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/subject-attendance/"!</div>;
}
