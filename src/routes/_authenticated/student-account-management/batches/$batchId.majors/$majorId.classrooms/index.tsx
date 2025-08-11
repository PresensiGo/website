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
import { EyeIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/student-account-management/batches/$batchId/majors/$majorId/classrooms/"
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
      <div className="py-6">
        <div>
          <p>Daftar Kelas</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
            officiis eligendi consequatur aut iusto minus dolore reiciendis,
            amet error blanditiis exercitationem nesciunt, minima, veniam non
            corrupti esse molestias ipsa nihil?
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kelas</TableHead>
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
                    <Button variant={"outline"} size={"icon"} asChild>
                      <Link
                        to="/student-account-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students"
                        params={{
                          batchId,
                          majorId,
                          classroomId: String(item.id),
                        }}
                      >
                        <EyeIcon />
                      </Link>
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
