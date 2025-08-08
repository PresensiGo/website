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
  "/_authenticated/attendance/subject/batches/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { isSuccess: isSuccessBatches, data: dataBatches } = $api.useQuery(
    "get",
    "/api/v1/batches"
  );

  return (
    <>
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Presensi Mata Pelajaran</p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            vero neque doloribus provident possimus sapiente veritatis
            laboriosam molestiae voluptate fugiat iste architecto esse
            cupiditate maxime, aliquam natus dolorem repudiandae dolorum!
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
            {isSuccessBatches &&
              dataBatches &&
              dataBatches.batches.map((item, index) => (
                <TableRow key={"batch-item-" + index}>
                  <TableCell>{item.batch.name}</TableCell>
                  <TableCell>
                    <Button size={"icon"} variant={"outline"} asChild>
                      <Link
                        to="/attendance/subject/batches/$batchId/majors"
                        params={{ batchId: String(item.batch.id) }}
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
