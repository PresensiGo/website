import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Page,
});

function Page() {
  return (
    <>
      <div className="py-6">
        <p className="text-muted-foreground">
          Selamat datang di halaman dashboard PresensiGo. Silahkan akses semua
          fitur yang tersedia melalui bilah navigasi di samping kiri.
        </p>
      </div>
    </>
  );
}
