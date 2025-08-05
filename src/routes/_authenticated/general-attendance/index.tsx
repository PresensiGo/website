import { UpsertGeneralAttendanceDialog } from "@/components/general-attendance";
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
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/general-attendance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [upsertDialogState, setUpsertDialogState] = useState<{
    open: boolean;
    data?: {};
  }>({ open: false });

  const { isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/general_attendances"
  );

  return (
    <>
      <div className="container mx-auto p-4">
        <p>Presensi Kehadiran</p>
        <p>
          Rencana: presensi untuk mencatat kehadiran siswa ketika pagi hari.
          jika lebih dari pukul 07.00 maka dianggap terlambat. ambang jam bisa
          disetel secara dinamis.
        </p>

        <Button onClick={() => setUpsertDialogState({ open: true })}>
          <PlusIcon />
          Tambah Presensi Kehadiran
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
              data.general_attendances.map((item, index) => (
                <TableRow key={"general-attendance-item-" + index}>
                  <TableCell>{item.datetime}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <UpsertGeneralAttendanceDialog
        open={upsertDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertDialogState({ open });
          if (status) refetch();
        }}
        data={upsertDialogState.data}
      />
    </>
  );
}
