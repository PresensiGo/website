import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { $api } from "@/lib/api/api";
import { createFileRoute } from "@tanstack/react-router";
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
    "/api/v1/general_attendances/{general_attendance_id}",
    {
      params: { path: { general_attendance_id: Number(generalAttendanceId) } },
    }
  );

  return (
    <>
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Presensi Kehadiran</p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
            sapiente architecto enim repellat dolor molestias provident neque
            dolorum similique maxime. Magni suscipit placeat distinctio in,
            dolor laboriosam itaque animi ab.
          </p>
        </div>

        <Tabs defaultValue="qr-code" className="mt-4">
          <TabsList>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="students">Daftar Siswa</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>
          <TabsContent value="qr-code">
            {isSuccess && data && (
              <ReactQRCode
                value={data.general_attendance.code}
                className="w-full h-84"
              />
            )}
          </TabsContent>
          <TabsContent value="students">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
