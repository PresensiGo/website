import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: Page,
});

function Page() {
  return (
    <>
      <div>
        <Button>Angkatan</Button>
        <Button>Jurusan</Button>
        <Button>Kelas</Button>
        <Button>Siswa</Button>
      </div>
    </>
  );
}
