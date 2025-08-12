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
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCwIcon } from "lucide-react";
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
  const { isSuccess: isSuccessRecords, data: dataRecords } = $api.useQuery(
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
            Presensi Mata Pelajaran - Fisika
          </p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            aspernatur eius possimus consequuntur aperiam hic voluptate velit
            error dolorem nesciunt autem quisquam incidunt, pariatur quaerat,
            blanditiis modi, aliquid deleniti doloremque.
          </p>
        </div>

        <Tabs defaultValue="records" className="mt-4">
          <TabsList>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="records">Daftar Siswa</TabsTrigger>
          </TabsList>
          <TabsContent value="qr-code">
            {isSuccess && data && (
              <ReactQRCode
                value={JSON.stringify({
                  type: "subject",
                  code: data.subject_attendance.code,
                })}
                className="w-full h-84"
              />
            )}
            <Button>
              <RefreshCwIcon />
              Refresh QR Code
            </Button>
          </TabsContent>
          <TabsContent value="records">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSuccessRecords &&
                  dataRecords &&
                  dataRecords.items.map((item, index) => (
                    <TableRow key={"record-item-" + index}>
                      <TableCell>{item.student.nis}</TableCell>
                      <TableCell>{item.student.name}</TableCell>
                      <TableCell>
                        {item.record.id === 0 ? (
                          "-"
                        ) : (
                          <FormattedDate value={item.record.created_at} />
                        )}
                      </TableCell>
                      <TableCell>
                        {item.record.id === 0 ? (
                          "-"
                        ) : (
                          <FormattedTime value={item.record.created_at} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
