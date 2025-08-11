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
  "/_authenticated/student-account-management/batches/$batchId/majors/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId } = Route.useParams();

  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors",
    {
      params: {
        path: {
          batch_id: Number(batchId),
        },
      },
    }
  );

  return (
    <>
      <div className="py-6">
        <div>
          <p>Daftar Jurusan</p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Praesentium minus corrupti magnam? Rem illo sunt totam nam fuga
            recusandae pariatur nobis nemo laborum impedit eos perspiciatis,
            tempore, quidem asperiores voluptates.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Jurusan</TableHead>
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
                    <Button variant={"outline"} size={"icon"} asChild>
                      <Link
                        to="/student-account-management/batches/$batchId/majors/$majorId/classrooms"
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
