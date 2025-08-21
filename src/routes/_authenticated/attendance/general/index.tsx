import { WithSkeleton } from "@/components";
import {
  DeleteGeneralAttendanceDialog,
  UpsertGeneralAttendanceDialog,
} from "@/components/attendance/general";
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
import type { components } from "@/lib/api/v1";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit2Icon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";

export const Route = createFileRoute("/_authenticated/attendance/general/")({
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

  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/general-attendances"
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Presensi Kehadiran</p>
          <p className="text-muted-foreground">
            Kelola data kehadiran umum siswa di sekolah. Informasi yang tercatat
            di sini mencakup presensi harian dan tidak terkait dengan data
            presensi untuk setiap mata pelajaran.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <Button onClick={() => setUpsertDialogState({ open: true })}>
              <PlusIcon />
              Tambah Presensi Kehadiran
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-4">Tanggal</TableHead>
                  <TableHead className="px-4">Tenggat Waktu</TableHead>
                  <TableHead className="px-4">Kode Akses</TableHead>
                  <TableHead className="px-4 w-1">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* loading state */}
                {isLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <AttendanceItem
                      key={"loading-attendance-item-" + index}
                      isLoading
                    />
                  ))}

                {/* success state */}
                {isSuccess &&
                  data &&
                  data.items.map((item, index) => (
                    <AttendanceItem
                      key={"attendance-item-" + index}
                      data={item}
                      onClickUpdate={() =>
                        setUpsertDialogState({
                          open: true,
                          data: {
                            id: item.general_attendance.id,
                            datetime: item.general_attendance.datetime,
                            note: item.general_attendance.note,
                          },
                        })
                      }
                      onClickDelete={() =>
                        setDeleteDialogState({
                          open: true,
                          data: { id: item.general_attendance.id },
                        })
                      }
                    />
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
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
      <DeleteGeneralAttendanceDialog
        open={deleteDialogState.open}
        onOpenChange={(open, status) => {
          setDeleteDialogState({ open, data: undefined });
          if (status) refetch();
        }}
        data={deleteDialogState.data}
      />
    </>
  );
}

interface AttendanceItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllGeneralAttendancesItem"];
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
}
const AttendanceItem = ({
  isLoading = false,
  data,
  onClickUpdate,
  onClickDelete,
}: AttendanceItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            <FormattedDate
              value={data?.general_attendance.datetime}
              weekday="long"
              day="numeric"
              month="long"
              year="numeric"
            />
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            <FormattedTime value={data?.general_attendance.datetime} />
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">{data?.general_attendance.code}</TableCell>
        <TableCell className="flex gap-1 px-4">
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} variant={"outline"} asChild>
              <Link
                to="/attendance/general/$generalAttendanceId"
                params={{
                  generalAttendanceId: String(data?.general_attendance.id),
                }}
              >
                <EyeIcon />
              </Link>
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} variant={"outline"} onClick={onClickUpdate}>
              <Edit2Icon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button
              size={"icon"}
              variant={"destructive"}
              onClick={onClickDelete}
            >
              <TrashIcon />
            </Button>
          </WithSkeleton>
        </TableCell>
      </TableRow>
    </>
  );
};
