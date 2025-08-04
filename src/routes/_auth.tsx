import { auth } from "@/lib/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  loader: () => {
    const token = auth.get();
    if (token) throw redirect({ to: "/", replace: true });
  },
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
