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

  const { isSuccess, data } = $api.useQuery(
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
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">
            Daftar Presensi Mata Pelajaran - Kelas ABCD
          </p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt
            suscipit rem provident eligendi doloribus mollitia dolorum
            praesentium odit debitis, assumenda nesciunt! Dolorem asperiores
            officiis dolores repellendus error fugiat delectus cum.
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setUpsertDialogState({ open: true })}>
            <PlusIcon />
            Tambah Presensi Mata Pelajaran
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.items.map((item, index) => (
                <TableRow key={"subject-attendance-item-" + index}>
                  <TableCell>{item.subject.name}</TableCell>
                  <TableCell>
                    <FormattedDate value={item.subject_attendance.date_time} />
                  </TableCell>
                  <TableCell>
                    <FormattedTime value={item.subject_attendance.date_time} />
                  </TableCell>
                  <TableCell>{item.subject_attendance.code}</TableCell>
                  <TableCell className="space-x-1">
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

      {/* dialogs */}
      <UpsertSubjectAttendanceDialog
        open={upsertDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertDialogState({ open, data: undefined });
          if (status) {
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
