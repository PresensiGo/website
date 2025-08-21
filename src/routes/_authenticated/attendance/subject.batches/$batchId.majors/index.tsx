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
  "/_authenticated/attendance/subject/batches/$batchId/majors/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId } = Route.useParams();

  const { data: dataBatch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}",
    {
      params: { path: { batch_id: Number(batchId) } },
    }
  );
  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors",
    {
      params: { path: { batch_id: Number(batchId) } },
    }
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Daftar Jurusan</p>
          <p className="text-muted-foreground">
            Halaman ini menampilkan daftar jurusan yang terdaftar di angkatan{" "}
            {dataBatch && dataBatch.batch.name}. Silakan pilih jurusan untuk
            melihat daftar kelas dan melanjutkan proses presensi mata pelajaran.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="px-4">Nama Jurusan</TableHead>
                <TableHead className="px-4 w-1">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSuccess &&
                data &&
                data.items.map(({ major: item }, index) => (
                  <TableRow key={"major-item-" + index}>
                    <TableCell className="px-4">{item.name}</TableCell>
                    <TableCell className="px-4">
                      <Button variant={"outline"} size={"icon"} asChild>
                        <Link
                          to="/attendance/subject/batches/$batchId/majors/$majorId/classrooms"
                          params={{
                            batchId: String(batchId),
                            majorId: String(item.id),
                          }}
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
