import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/majors/")({
  component: Page,
});

function Page() {
  return (
    <>
      <div className="container mx-auto">
        <p>halaman daftar jurusan</p>

        <Button>
          <PlusIcon />
          Jurusan Baru
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Jurusan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </div>
    </>
  );
}
