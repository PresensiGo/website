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
import { createFileRoute } from "@tanstack/react-router";
import { EyeIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/batches/$batchId/")({
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
                    <Button size={"icon"}>
                      <EyeIcon />
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
