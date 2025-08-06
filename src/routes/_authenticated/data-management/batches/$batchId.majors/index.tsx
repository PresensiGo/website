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
  "/_authenticated/data-management/batches/$batchId/majors/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId } = Route.useParams();

  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors",
    {
      params: { path: { batch_id: Number(batchId) } },
    },
    { enabled: batchId !== undefined }
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <p>Daftar Jurusan</p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque
          corporis nam quam laboriosam reiciendis mollitia, iure doloribus
          blanditiis animi, dignissimos voluptates ut porro esse itaque officia
          possimus voluptatem unde quia?
        </p>

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
              data.majors.map((item, index) => (
                <TableRow key={"major-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button size={"icon"} asChild>
                      <Link
                        to="/data-management/batches/$batchId/majors/$majorId/classrooms"
                        params={{ batchId, majorId: String(item.id) }}
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
