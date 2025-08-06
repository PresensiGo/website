import { $api } from "@/lib/api/api";
import { createFileRoute } from "@tanstack/react-router";
import QRCode from "react-qr-code";

export const Route = createFileRoute(
  "/_authenticated/general-attendance/$generalAttendanceId/"
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
    },
    { enabled: generalAttendanceId.length > 0 }
  );

  return (
    <>
      <div>
        <p>General attendance id: {generalAttendanceId}</p>

        {isSuccess && data && (
          <>
            <QRCode value={data.general_attendance.code} />
          </>
        )}
      </div>
    </>
  );
}
