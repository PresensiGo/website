import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

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
];

function RouteComponent() {
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
