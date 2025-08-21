import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { $api } from "@/lib/api/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EyeIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/attendance/subject/batches/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { isSuccess: isSuccessBatches, data: dataBatches } = $api.useQuery(
    "get",
    "/api/v1/batches"
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Presensi Mata Pelajaran</p>
          <p className="text-muted-foreground">
            Halaman ini digunakan untuk mencatat presensi mata pelajaran.
            Silakan pilih angkatan dari daftar di bawah untuk melanjutkan ke
            halaman jurusan dan kelas, lalu pilih mata pelajaran untuk memulai
            presensi.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="px-4">Nama Angkatan</TableHead>
                <TableHead className="px-4 w-1">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSuccessBatches &&
                dataBatches &&
                dataBatches.items.map(({ batch: item }, index) => (
                  <TableRow key={"batch-item-" + index}>
                    <TableCell className="px-4">{item.name}</TableCell>
                    <TableCell className="px-4">
                      <Button size={"icon"} variant={"outline"} asChild>
                        <Link
                          to="/attendance/subject/batches/$batchId/majors"
                          params={{ batchId: String(item.id) }}
                        >
                          <EyeIcon />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
