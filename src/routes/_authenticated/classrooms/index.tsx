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

export const Route = createFileRoute("/_authenticated/classrooms/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isSuccess, data } = $api.useQuery("get", "/api/v1/classrooms");

  return (
    <>
      <div className="container mx-auto">
        <p>Daftar Kelas</p>
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
                <TableRow key={"classaroom-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
