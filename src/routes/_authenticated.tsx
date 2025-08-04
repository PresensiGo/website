import { Button } from "@/components/ui/button";
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
      <div>
        <Button>Manajemen Angkatan</Button>
        <Button>Manajemen Jurusan</Button>
        <Button>Manajemen Kelas</Button>
        <Button>Manajemen Siswa</Button>
      </div>

      <Outlet />
    </>
  );
}
