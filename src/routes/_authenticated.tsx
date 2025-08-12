import { AppSidebar, Navbar } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";
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
