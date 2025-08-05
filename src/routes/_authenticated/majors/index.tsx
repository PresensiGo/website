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

export const Route = createFileRoute("/_authenticated/majors/")({
  component: Page,
});

function Page() {
  const { isLoading, isSuccess, data } = $api.useQuery("get", "/api/v1/majors");

  return (
    <>
      <div className="container mx-auto">
        <p>halaman daftar jurusan</p>

        <Button>
          <PlusIcon />
          Jurusan Baru
        </Button>

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
              data.map((item, index) => (
                <TableRow key={"major-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
