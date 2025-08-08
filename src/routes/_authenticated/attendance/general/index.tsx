import { UpsertGeneralAttendanceDialog } from "@/components/attendance/general";
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
import { Edit2Icon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";

export const Route = createFileRoute("/_authenticated/attendance/general/")({
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
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Presensi Kehadiran</p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid vel
            exercitationem aperiam, corrupti nostrum deleniti quas, voluptas
            beatae eos quis enim laborum aut consectetur sed soluta voluptates?
            Laudantium, ipsum consectetur.
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setUpsertDialogState({ open: true })}>
            <PlusIcon />
            Tambah Presensi Kehadiran
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead className="w-full">Kode Akses</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.general_attendances.map((item, index) => (
                <TableRow key={"general-attendance-item-" + index}>
                  <TableCell>
                    <FormattedDate value={item.datetime} />
                  </TableCell>
                  <TableCell>
                    <FormattedTime value={item.datetime} />
                  </TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell className="space-x-1">
                    <Button size={"icon"} variant={"outline"}>
                      <EyeIcon />
                    </Button>
                    <Button size={"icon"} variant={"outline"}>
                      <Edit2Icon />
                    </Button>
                    <Button size={"icon"} variant={"destructive"}>
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
          setUpsertDialogState({ open, data: undefined });
          if (status) refetch();
        }}
        data={upsertDialogState.data}
      />
    </>
  );
}
