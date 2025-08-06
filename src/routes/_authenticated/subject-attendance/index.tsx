import { UpsertSubjectAttendanceDialog } from "@/components/subject-attendance";
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
import { FormattedDate } from "react-intl";

export const Route = createFileRoute("/_authenticated/subject-attendance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/subject-attendances"
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <Button>
          <PlusIcon />
          Tambah Presensi Mata Pelajaran
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.subject_attendances.map((item, index) => (
                <TableRow key={"subject-attendance-item-" + index}>
                  <TableCell>
                    <FormattedDate value={item.date_time} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <UpsertSubjectAttendanceDialog />
    </>
  );
}
