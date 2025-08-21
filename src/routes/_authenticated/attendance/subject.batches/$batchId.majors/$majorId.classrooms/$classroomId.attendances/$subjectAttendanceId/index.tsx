import { WithSkeleton } from "@/components";
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
import { createFileRoute } from "@tanstack/react-router";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { FormattedDate, FormattedTime } from "react-intl";
import ReactQRCode from "react-qr-code";

export const Route = createFileRoute(
  "/_authenticated/attendance/subject/batches/$batchId/majors/$majorId/classrooms/$classroomId/attendances/$subjectAttendanceId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId, classroomId, subjectAttendanceId } =
    Route.useParams();

  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/{subject_attendance_id}",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
          classroom_id: Number(classroomId),
          subject_attendance_id: Number(subjectAttendanceId),
        },
      },
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
  } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/{subject_attendance_id}/records",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
          classroom_id: Number(classroomId),
          subject_attendance_id: Number(subjectAttendanceId),
        },
      },
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

        <Tabs defaultValue="records" className="mt-4">
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

                  {/* success state */}
                  {isSuccessRecords &&
                    dataRecords &&
                    dataRecords.items.map((item, index) => (
                      <Item key={"student-item-" + index} data={item} />
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllSubjectAttendanceRecordsItem"];
}
const Item = ({ isLoading, data }: ItemProps) => {
  const isAttended = (data?.record.id ?? 0) > 0;

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
              <FormattedDate value={data?.record.date_time} />
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
                {data?.record.status ?? "loading"}
              </Badge>
            ) : (
              <Badge variant={"destructive"}>tidak hadir</Badge>
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4 flex gap-1">
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button variant={"outline"} size={"icon"}>
              <Edit2Icon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button variant={"destructive"} size={"icon"}>
              <TrashIcon />
            </Button>
          </WithSkeleton>
        </TableCell>
      </TableRow>
    </>
  );
};
