import { Button } from "@/components/ui/button";
import { $api } from "@/lib/api/api";
import { auth } from "@/lib/auth";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  loader: () => {
    const token = auth.get();
    if (!token) throw redirect({ to: "/auth/login", replace: true });
  },
});

const menus: { title: string; href: string }[] = [
  { title: "Halaman Utama", href: "/" },
  { title: "Manajemen Angkatan", href: "/batches" },
  { title: "Manajemen Jurusan", href: "/majors" },
  { title: "Manajemen Kelas", href: "/classrooms" },
  { title: "Pengaturan", href: "/setting" },
  { title: "Presensi Kehadiran", href: "/general-attendance" },
  { title: "Presensi Mata Pelajaran", href: "/subject-attendance" },
];

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
      <div>
        {menus.map((item, index) => (
          <Button key={"menu-item-" + index} asChild>
            <Link to={item.href}>{item.title}</Link>
          </Button>
        ))}
      </div>

      <Outlet />
    </>
  );
}
