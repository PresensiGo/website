import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Page,
});

function Page() {
  return (
    <>
      <div className="p-4">
        <p>gatau mau diisi apa</p>
        <Button>Tambah Presensi Kehadiran</Button>
        <Button>Tambah Presensi Mata Pelajaran</Button>
      </div>
    </>
  );
}
