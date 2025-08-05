import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/classrooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/classrooms/"!</div>;
}
