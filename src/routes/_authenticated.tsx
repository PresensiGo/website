import { auth } from "@/lib/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  loader: () => {
    const token = auth.get();
    if (!token) throw redirect({ to: "/auth/login", replace: true });
  },
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
