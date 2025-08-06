import {
  DeleteGeneralAttendanceDialog,
  UpsertGeneralAttendanceDialog,
} from "@/components/general-attendance";
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
import { Edit2Icon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/general-attendance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [upsertDialogState, setUpsertDialogState] = useState<{
    open: boolean;
    data?: {
      id: number;
      datetime: string;
      note: string;
    };
  }>({ open: false });
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    data?: { id: number };
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
              <TableHead>Kode Presensi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.general_attendances.map((item, index) => (
                <TableRow key={"general-attendance-item-" + index}>
                  <TableCell>{item.datetime}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>
                    <Button size={"icon"} asChild>
                      <Link
                        to="/general-attendance/$generalAttendanceId"
                        params={{ generalAttendanceId: String(item.id) }}
                      >
                        <EyeIcon />
                      </Link>
                    </Button>
                    <Button
                      size={"icon"}
                      onClick={() =>
                        setUpsertDialogState({
                          open: true,
                          data: {
                            id: item.id,
                            datetime: item.datetime,
                            note: item.note,
                          },
                        })
                      }
                    >
                      <Edit2Icon />
                    </Button>
                    <Button
                      size={"icon"}
                      onClick={() =>
                        setDeleteDialogState({
                          open: true,
                          data: { id: item.id },
                        })
                      }
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
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
      <DeleteGeneralAttendanceDialog
        open={deleteDialogState.open}
        onOpenChange={(open, status) => {
          setDeleteDialogState({ open });
          if (status) refetch();
        }}
        data={deleteDialogState.data}
      />
    </>
  );
}
