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
import { createFileRoute } from "@tanstack/react-router";
import { Edit2Icon, TrashIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/data-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId, classroomId } = Route.useParams();

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
  const { data: dataClassroom } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
          classroom_id: Number(classroomId),
        },
      },
    }
  );
  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/students",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
          classroom_id: Number(classroomId),
        },
      },
    }
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Daftar Siswa</p>
          <p className="text-muted-foreground">
            Halaman ini menyajikan daftar lengkap siswa yang terdaftar di kelas{" "}
            {dataClassroom && dataClassroom.classroom.name} pada jurusan{" "}
            {dataMajor && dataMajor.major.name} angkatan{" "}
            {dataBatch && dataBatch.batch.name}. Gunakan halaman ini untuk
            melihat data siswa secara rinci.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="px-4">NIS</TableHead>
                <TableHead className="px-4">Nama</TableHead>
                <TableHead className="px-4 w-1">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSuccess &&
                data &&
                data.students.map((item, index) => (
                  <TableRow key={"student-item-" + index}>
                    <TableCell className="px-4">{item.nis}</TableCell>
                    <TableCell className="px-4">{item.name}</TableCell>
                    <TableCell className="px-4 space-x-1">
                      <Button
                        size={"icon"}
                        variant={"outline"}
                        onClick={() => {}}
                      >
                        <Edit2Icon />
                      </Button>
                      <Button size={"icon"} variant={"destructive"}>
                        <TrashIcon />
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
