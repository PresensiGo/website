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
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/batches/")({
  component: Page,
});

function Page() {
  const { isLoading, isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/batch",
    undefined,
    { retry: false }
  );

  return (
    <>
      <div className="container mx-auto">
        <p>halaman daftar angkatan</p>

        <Button>
          <PlusIcon />
          Angkatan Baru
        </Button>

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
              data.batches.map((batch, index) => (
                <TableRow key={"batch-item-" + index}>
                  <TableCell>{batch.batch.name}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
