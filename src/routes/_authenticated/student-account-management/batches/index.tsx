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
  "/_authenticated/student-account-management/batches/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { isSuccess, data } = $api.useQuery("get", "/api/v1/batches");

  return (
    <>
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Akun Siswa</p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea saepe
            nulla recusandae pariatur fugit obcaecati accusantium nam, sint esse
            soluta neque odio quis aliquid in id adipisci veritatis. Voluptate,
            explicabo.
          </p>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Nama Angkatan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.batches.map((item, index) => (
                <TableRow key={"batch-item-" + index}>
                  <TableCell className="w-full">{item.name}</TableCell>
                  <TableCell>
                    <Button variant={"outline"} size={"icon"} asChild>
                      <Link
                        to="/student-account-management/batches/$batchId/majors"
                        params={{ batchId: String(item.id) }}
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
