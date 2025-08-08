import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { $api } from "@/lib/api/api";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCwIcon } from "lucide-react";
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

        <Tabs defaultValue="qr-code" className="mt-4">
          <TabsList>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="students">Daftar Siswa</TabsTrigger>
          </TabsList>
          <TabsContent value="qr-code">
            {isSuccess && data && (
              <ReactQRCode
                value={data.subject_attendance.code}
                className="w-full h-84"
              />
            )}
            <Button>
              <RefreshCwIcon />
              Refresh QR Code
            </Button>
          </TabsContent>
          <TabsContent value="students">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
