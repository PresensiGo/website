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
import { Edit2Icon, EyeIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/data-management/batches/$batchId/majors/$majorId/classrooms/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId } = Route.useParams();

  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
        },
      },
    }
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <p>Daftar Classrooms</p>

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
              data.classrooms.map((item, index) => (
                <TableRow key={"classroom-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button size={"icon"} asChild>
                      <Link
                        to="/data-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students"
                        params={{
                          batchId,
                          majorId,
                          classroomId: String(item.id),
                        }}
                      >
                        <EyeIcon />
                      </Link>
                    </Button>
                    <Button size={"icon"}>
                      <Edit2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
