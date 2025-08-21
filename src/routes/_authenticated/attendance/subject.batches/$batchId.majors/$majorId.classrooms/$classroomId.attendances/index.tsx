import { UpsertSubjectAttendanceDialog } from "@/components/attendance/subject";
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
import { Edit2Icon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";

export const Route = createFileRoute(
  "/_authenticated/attendance/subject/batches/$batchId/majors/$majorId/classrooms/$classroomId/attendances/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId, classroomId } = Route.useParams();

  const [upsertDialogState, setUpsertDialogState] = useState<{
    open: boolean;
    data?: {};
  }>({ open: false });

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
  const { isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances",
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
          <p className="text-3xl font-semibold">
            Daftar Presensi Mata Pelajaran
          </p>
          <p className="text-muted-foreground">
            Halaman ini menampilkan daftar presensi mata pelajaran untuk kelas{" "}
            {dataClassroom && dataClassroom.classroom.name} pada jurusan{" "}
            {dataMajor && dataMajor.major.name} angkatan{" "}
            {dataBatch && dataBatch.batch.name}. Anda dapat menambahkan presensi
            baru, melihat detailnya, atau mengelola catatan presensi yang sudah
            ada.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end mt-4">
            <Button onClick={() => setUpsertDialogState({ open: true })}>
              <PlusIcon />
              Tambah Presensi Mata Pelajaran
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-4">Mata Pelajaran</TableHead>
                  <TableHead className="px-4">Tanggal</TableHead>
                  <TableHead className="px-4">Waktu</TableHead>
                  <TableHead className="px-4">Kode</TableHead>
                  <TableHead className="px-4 w-1">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSuccess &&
                  data &&
                  data.items.map((item, index) => (
                    <TableRow key={"subject-attendance-item-" + index}>
                      <TableCell className="px-4">
                        {item.subject.name}
                      </TableCell>
                      <TableCell className="px-4">
                        <FormattedDate
                          value={item.subject_attendance.date_time}
                          weekday="long"
                          day="numeric"
                          month="long"
                          year="numeric"
                        />
                      </TableCell>
                      <TableCell className="px-4">
                        <FormattedTime
                          value={item.subject_attendance.date_time}
                        />
                      </TableCell>
                      <TableCell className="px-4">
                        {item.subject_attendance.code}
                      </TableCell>
                      <TableCell className="space-x-1 px-4">
                        <Button size={"icon"} variant={"outline"} asChild>
                          <Link
                            to="/attendance/subject/batches/$batchId/majors/$majorId/classrooms/$classroomId/attendances/$subjectAttendanceId"
                            params={{
                              batchId,
                              majorId,
                              classroomId,
                              subjectAttendanceId: String(
                                item.subject_attendance.id
                              ),
                            }}
                          >
                            <EyeIcon />
                          </Link>
                        </Button>
                        <Button size={"icon"} variant={"outline"}>
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
      </div>

      {/* dialogs */}
      <UpsertSubjectAttendanceDialog
        open={upsertDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertDialogState({ open, data: undefined });
          if (status) {
            refetch();
          }
        }}
        data={upsertDialogState.data}
        params={{
          batchId: Number(batchId),
          majorId: Number(majorId),
          classroomId: Number(classroomId),
        }}
      />
    </>
  );
}
