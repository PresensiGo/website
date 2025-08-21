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
import { isBefore } from "date-fns";
import { useCallback } from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import ReactQRCode from "react-qr-code";

export const Route = createFileRoute(
  "/_authenticated/attendance/general/$generalAttendanceId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { generalAttendanceId } = Route.useParams();

  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/general-attendances/{general_attendance_id}",
    {
      params: { path: { general_attendance_id: Number(generalAttendanceId) } },
    }
  );
  const { isSuccess: isSuccessStudent, data: dataStudents } = $api.useQuery(
    "get",
    "/api/v1/general-attendances/{general_attendance_id}/records",
    {
      params: {
        path: {
          general_attendance_id: Number(generalAttendanceId),
        },
      },
    }
  );

  const isEarly = useCallback(
    (date: string) => {
      if (data) return isBefore(date, data.general_attendance.datetime);
      return false;
    },
    [data]
  );

  return (
    <>
      <div className="py-6">
        <p className="text-3xl font-semibold">Presensi Kehadiran</p>

        <Tabs defaultValue="students" className="mt-4">
          <TabsList>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="students">Daftar Siswa</TabsTrigger>
          </TabsList>
          <TabsContent value="qr-code">
            {isSuccess && data && (
              <ReactQRCode
                value={JSON.stringify({
                  type: "general",
                  code: data.general_attendance.code,
                })}
                className="w-full h-84"
              />
            )}
          </TabsContent>
          <TabsContent value="students">
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
                {isSuccessStudent &&
                  dataStudents &&
                  dataStudents.items.map((item, index) => (
                    <TableRow key={"student-item-" + index}>
                      <TableCell>{item.student.nis}</TableCell>
                      <TableCell>{item.student.name}</TableCell>
                      <TableCell>
                        <FormattedDate value={item.record.created_at} />
                      </TableCell>
                      <TableCell>
                        <FormattedTime value={item.record.created_at} />
                      </TableCell>
                      <TableCell>
                        {isEarly(item.record.created_at)
                          ? "Tepat waktu"
                          : "Terlambat"}
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
