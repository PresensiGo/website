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

export const Route = createFileRoute(
  "/_authenticated/data-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId, classroomId } = Route.useParams();

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
      <div className="container mx-auto p-4">
        <p>Daftar Siswa</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.students.map((item, index) => (
                <TableRow key={"student-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
