import { AppSidebar, Navbar } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { $api } from "@/lib/api/api";
import { auth } from "@/lib/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  loader: () => {
    const token = auth.get();
    if (!token) throw redirect({ to: "/auth/login", replace: true });
  },
});

function RouteComponent() {
  const { mutate: mutateRefreshTokenTTL } = $api.useMutation(
    "post",
    "/api/v1/auth/refresh-token-ttl"
  );

  useEffect(() => {
    const token = auth.get();
    if (token)
      mutateRefreshTokenTTL({
        body: {
          refresh_token: token.refreshToken,
        },
      });
  }, []);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Navbar />

          <div className="container max-w-5xl mx-auto pt-16 px-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
