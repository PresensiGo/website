import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { $api } from "@/lib/api/api";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/batches/")({
  component: Page,
});

function Page() {
  const { data, isLoading, error } = $api.useQuery(
    "get",
    "/api/v1/batch",
    undefined,
    { retry: false }
  );

  return (
    <>
      <div className="container mx-auto">
        <p>halaman daftar angkatan</p>

        <Button>
          <PlusIcon />
          Angkatan Baru
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <td>Angkatan {index + 1}</td>
                <td>
                  <Button variant="ghost">Edit</Button>
                  <Button variant="destructive">Hapus</Button>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
