import { WithSkeleton } from "@/components";
import {
  CreateAttendanceRecordDialog,
  DeleteAttendanceRecordDialog,
  type CreateSubjectAttendanceRecordDialogDataProps,
  type DeleteSubjectAttendanceRecordDialogDataProps,
} from "@/components/attendance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { $api } from "@/lib/api/api";
import type { components } from "@/lib/api/v1";
import { checkIsAfter } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import ReactQRCode from "react-qr-code";
import z from "zod";

const searchSchema = z.object({
  batch: z.number(),
  major: z.number(),
  classroom: z.number(),
  section: z.string().default("qr-code"),
});

export const Route = createFileRoute(
  "/_authenticated/attendance/subject/$subjectAttendanceId/"
)({
  component: RouteComponent,
  validateSearch: searchSchema,
});

function RouteComponent() {
  const { subjectAttendanceId } = Route.useParams();
  const { batch, major, classroom, section } = Route.useSearch();

  const navigate = useNavigate({ from: Route.fullPath });

  const [createRecordState, setCreateRecordState] = useState<{
    open: boolean;
    data?: CreateSubjectAttendanceRecordDialogDataProps;
  }>({ open: false });
  const [deleteRecordDialogState, setDeleteRecordDialogState] = useState<{
    open: boolean;
    data?: DeleteSubjectAttendanceRecordDialogDataProps;
  }>({ open: false });

  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/{subject_attendance_id}",
    {
      params: {
        path: {
          batch_id: batch ?? 0,
          major_id: major ?? 0,
          classroom_id: classroom ?? 0,
          subject_attendance_id: Number(subjectAttendanceId),
        },
      },
    },
    {
      enabled: !!batch && !!major && !!classroom && !!subjectAttendanceId,
    }
  );
  const { data: dataSubject } = $api.useQuery(
    "get",
    "/api/v1/subjects/{subject_id}",
    {
      params: {
        path: { subject_id: data?.subject_attendance.subject_id ?? 0 },
      },
    },
    {
      enabled: !!data,
    }
  );
  const {
    isLoading: isLoadingRecords,
    isSuccess: isSuccessRecords,
    data: dataRecords,
    refetch: refetchRecords,
  } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/{subject_attendance_id}/records",
    {
      params: {
        path: {
          batch_id: batch ?? 0,
          major_id: major ?? 0,
          classroom_id: classroom ?? 0,
          subject_attendance_id: Number(subjectAttendanceId),
        },
      },
    },
    {
      enabled: !!batch && !!major && !!classroom && !!subjectAttendanceId,
    }
  );

  return (
    <>
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">
            Presensi Mata Pelajaran - {dataSubject && dataSubject.subject.name}
          </p>
        </div>

        <Tabs
          value={section}
          onValueChange={(e) =>
            navigate({
              search: {
                batch: batch,
                major: major,
                classroom: classroom,
                section: e,
              },
              replace: true,
            })
          }
          className="mt-4"
        >
          <TabsList>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="records">Daftar Siswa</TabsTrigger>
          </TabsList>
          <TabsContent value="qr-code">
            {isSuccess && data && (
              <div className="space-y-6 text-center py-6">
                <div>
                  <p className="text-xl font-medium">
                    <FormattedDate
                      value={data.subject_attendance.date_time}
                      weekday="long"
                      day="numeric"
                      month="long"
                      year="numeric"
                    />
                  </p>
                  <p className="text-lg text-muted-foreground">
                    <FormattedTime value={data.subject_attendance.date_time} />
                  </p>
                </div>

                <ReactQRCode
                  value={JSON.stringify({
                    type: "subject",
                    code: data.subject_attendance.code,
                  })}
                  className="w-full h-84"
                />

                <p className="text-muted-foreground text-sm">
                  {data.subject_attendance.code}
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="records">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="px-4">Nomor Induk Siswa</TableHead>
                    <TableHead className="px-4">Nama Siswa</TableHead>
                    <TableHead className="px-4">Tanggal</TableHead>
                    <TableHead className="px-4">Waktu</TableHead>
                    <TableHead className="px-4">Status</TableHead>
                    <TableHead className="px-4 w-1">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* loading state */}
                  {isLoadingRecords &&
                    Array.from({ length: 3 }).map((_, index) => (
                      <Item key={"student-loading-" + index} isLoading />
                    ))}

                  {/* empty state */}
                  {isSuccessRecords &&
                    dataRecords &&
                    dataRecords.items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground py-4"
                        >
                          Tidak ada data siswa yang tersedia. Tidak ada data
                          siswa yang tersedia.
                        </TableCell>
                      </TableRow>
                    )}

                  {/* success state */}
                  {isSuccessRecords &&
                    dataRecords &&
                    dataRecords.items.map((item, index) => (
                      <Item
                        key={"student-item-" + index}
                        data={item}
                        subjectAttendanceDateTime={
                          data?.subject_attendance.date_time
                        }
                        onClickUpdate={() =>
                          setCreateRecordState({
                            open: true,
                            data: {
                              type: "subject",
                              batchId: batch ?? 0,
                              majorId: major ?? 0,
                              classroomId: classroom ?? 0,
                              attendanceId: Number(subjectAttendanceId),
                              studentId: item.student.id,
                              studentName: item.student.name,
                              studentNIS: item.student.nis,
                            },
                          })
                        }
                        onClickDelete={() =>
                          setDeleteRecordDialogState({
                            open: true,
                            data: {
                              batchId: batch ?? 0,
                              majorId: major ?? 0,
                              classroomId: classroom ?? 0,
                              attendanceId: Number(subjectAttendanceId),
                              recordId: item.record.id,
                              studentName: item.student.name,
                              studentNIS: item.student.nis,
                            },
                          })
                        }
                      />
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* dialogs */}
      <CreateAttendanceRecordDialog
        open={createRecordState.open}
        onOpenChange={(open, status) => {
          setCreateRecordState({ open });
          if (status) {
            refetchRecords();
          }
        }}
        data={createRecordState.data}
      />
      <DeleteAttendanceRecordDialog
        open={deleteRecordDialogState.open}
        onOpenChange={(open, status) => {
          setDeleteRecordDialogState({ open });
          if (status) {
            refetchRecords();
          }
        }}
        data={deleteRecordDialogState.data}
      />
    </>
  );
}

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllSubjectAttendanceRecordsItem"];
  subjectAttendanceDateTime?: string;
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
}
const Item = ({
  isLoading,
  data,
  subjectAttendanceDateTime,
  onClickUpdate,
  onClickDelete,
}: ItemProps) => {
  const isAttended = (data?.record.id ?? 0) > 0;

  let isLate = false;
  if (data && subjectAttendanceDateTime) {
    isLate = checkIsAfter(data.record.date_time, subjectAttendanceDateTime);
  }

  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.student.nis ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.student.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {isAttended ? (
              <FormattedDate
                value={data?.record.date_time}
                weekday="long"
                day="numeric"
                month="long"
                year="numeric"
              />
            ) : (
              "-"
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {isAttended ? (
              <FormattedTime value={data?.record.date_time} />
            ) : (
              "-"
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {isAttended ? (
              <Badge variant={"outline"}>
                {(data?.record.status &&
                  (data.record.status === "hadir"
                    ? isLate
                      ? "hadir terlambat"
                      : "hadir"
                    : data.record.status)) ||
                  "loading"}
              </Badge>
            ) : (
              <Badge variant={"destructive"}>tidak hadir</Badge>
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4 flex gap-1">
          {(isLoading || !isAttended) && (
            <WithSkeleton isLoading={isLoading} className="w-fit">
              <Button variant={"outline"} size={"icon"} onClick={onClickUpdate}>
                <Edit2Icon />
              </Button>
            </WithSkeleton>
          )}
          {(isLoading || isAttended) && (
            <WithSkeleton isLoading={isLoading} className="w-fit">
              <Button
                variant={"destructive"}
                size={"icon"}
                onClick={onClickDelete}
              >
                <TrashIcon />
              </Button>
            </WithSkeleton>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
