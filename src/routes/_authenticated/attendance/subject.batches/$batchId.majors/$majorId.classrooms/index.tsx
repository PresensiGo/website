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
  "/_authenticated/attendance/subject/batches/$batchId/majors/$majorId/classrooms/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId } = Route.useParams();

  const { data: dataBatch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}",
    {
      params: {
        path: {
          batch_id: Number(batchId),
        },
      },
    }
  );
  const { data: dataMajor } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
        },
      },
    }
  );
  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
        },
      },
    }
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-medium">Daftar Kelas - Jurusan ABCD</p>
          <p className="text-muted-foreground">
            Halaman ini menampilkan daftar kelas yang terdaftar di jurusan{" "}
            {dataMajor && dataMajor.major.name} angkatan{" "}
            {dataBatch && dataBatch.batch.name}. Pilih kelas untuk melanjutkan
            ke daftar mata pelajaran dan memulai proses presensi.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="px-4">Nama Kelas</TableHead>
                <TableHead className="px-4 w-1">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSuccess &&
                data &&
                data.items.map(({ classroom: item }, index) => (
                  <TableRow key={"classroom-item-" + index}>
                    <TableCell className="px-4">{item.name}</TableCell>
                    <TableCell className="px-4">
                      <Button asChild size={"icon"} variant={"outline"}>
                        <Link
                          to="/attendance/subject/batches/$batchId/majors/$majorId/classrooms/$classroomId/attendances"
                          params={{
                            batchId: String(batchId),
                            majorId: String(majorId),
                            classroomId: String(item.id),
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
