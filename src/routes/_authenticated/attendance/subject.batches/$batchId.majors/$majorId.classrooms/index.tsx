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
  "/_authenticated/attendance/subject/batches/$batchId/majors/$majorId/classrooms/"
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
        <div className="space-y-2">
          <p className="text-3xl font-medium">Daftar Kelas - Jurusan ABCD</p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum nemo
            deserunt corporis harum dolore? Commodi, repellat nobis ullam
            blanditiis dicta nemo rerum sapiente eaque natus voluptatum
            distinctio dolore, culpa reprehenderit?
          </p>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Nama</TableHead>
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
                    <Button asChild size={"icon"} variant={"outline"}>
                      <Link
                        to="/attendance/subject/batches/$batchId/majors/$majorId/classrooms/$classroomId/attendances"
                        params={{
                          batchId: String(batchId),
                          majorId: String(majorId),
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
