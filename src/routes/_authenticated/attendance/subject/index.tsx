import { WithSkeleton } from "@/components";
import {
  ExportSubjectAttendanceRecapDialog,
  UpsertSubjectAttendanceDialog,
  type ExportSubjectAttendanceRecapDialogDataProps,
} from "@/components/attendance/subject";
import {
  FilterStudentDialog,
  FilterStudentDialogSchema,
} from "@/components/filter-student-dialog";
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
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  DownloadIcon,
  Edit2Icon,
  EyeIcon,
  FilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";

export const Route = createFileRoute("/_authenticated/attendance/subject/")({
  component: RouteComponent,
  validateSearch: FilterStudentDialogSchema,
});

function RouteComponent() {
  const { batch, major, classroom } = Route.useSearch();

  const navigate = useNavigate({ from: Route.fullPath });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [upsertDialogState, setUpsertDialogState] = useState<{
    open: boolean;
    data?: {};
  }>({ open: false });
  const [exportDialogState, setExportDialogState] = useState<{
    open: boolean;
    data?: ExportSubjectAttendanceRecapDialogDataProps;
  }>({ open: false });

  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances",
    {
      params: {
        path: {
          batch_id: batch ?? 0,
          major_id: major ?? 0,
          classroom_id: classroom ?? 0,
        },
      },
    },
    {
      enabled: !!batch && !!major && !!classroom,
    }
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Presensi Mata Pelajaran</p>
          <p className="text-muted-foreground">
            Halaman ini digunakan untuk mencatat presensi mata pelajaran.
            Silakan pilih angkatan dari daftar di bawah untuk melanjutkan ke
            halaman jurusan dan kelas, lalu pilih mata pelajaran untuk memulai
            presensi.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Button variant={"outline"} onClick={() => setIsFilterOpen(true)}>
              <FilterIcon />
              Filter Data Siswa
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={"outline"}
                onClick={() => {
                  if (batch && major && classroom)
                    setExportDialogState({
                      open: true,
                      data: {
                        batchId: batch,
                        majorId: major,
                        classroomId: classroom,
                      },
                    });
                }}
              >
                <DownloadIcon />
                Ekspor Rekap
              </Button>
              <Button
                onClick={() => setUpsertDialogState({ open: true })}
                disabled={!batch || !major || !classroom}
              >
                <PlusIcon />
                Tambah Presensi
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-4">Tanggal</TableHead>
                  <TableHead className="px-4">Tenggat Waktu</TableHead>
                  <TableHead className="px-4">Mata Pelajaran</TableHead>
                  <TableHead className="px-4">Kode Akses</TableHead>
                  <TableHead className="px-4 w-1">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* initial state */}
                {(!batch || !major || !classroom) && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-muted-foreground py-4 px-4 text-center"
                    >
                      Silakan pilih angkatan, jurusan, dan kelas terlebih dahulu
                      dengan menekan tombol filter di pojok kiri atas.
                    </TableCell>
                  </TableRow>
                )}

                {/* loading state */}
                {isLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <Item key={"loading-attendance-item-" + index} isLoading />
                  ))}

                {/* empty state */}
                {isSuccess && data && data.items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-muted-foreground py-4 px-4 text-center"
                    >
                      Tidak ada data presensi yang tersedia.
                    </TableCell>
                  </TableRow>
                )}

                {/* success state */}
                {isSuccess &&
                  data &&
                  data.items.map((item, index) => (
                    <Item
                      key={"attendance-item-" + index}
                      data={item}
                      search={{
                        batch: batch ?? 0,
                        major: major ?? 0,
                        classroom: classroom ?? 0,
                      }}
                    />
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* dialogs */}
      <FilterStudentDialog
        open={isFilterOpen}
        onOpenChange={(open, data) => {
          setIsFilterOpen(open);
          if (data) {
            navigate({
              search: {
                batch: data.batchId,
                major: data.majorId,
                classroom: data.classroomId,
              },
            });
          }
        }}
        data={{
          batchId: batch,
          majorId: major,
          classroomId: classroom,
        }}
      />
      <ExportSubjectAttendanceRecapDialog
        open={exportDialogState.open}
        onOpenChange={(open) => setExportDialogState({ open })}
        data={exportDialogState.data}
      />
      <UpsertSubjectAttendanceDialog
        open={upsertDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertDialogState({ open, data: undefined });
          if (status) {
            refetch();
          }
        }}
        data={upsertDialogState.data}
        params={{
          batchId: Number(batch ?? 0),
          majorId: Number(major ?? 0),
          classroomId: Number(classroom ?? 0),
        }}
      />
    </>
  );
}

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllSubjectAttendancesItem"];
  search?: {
    batch: number;
    major: number;
    classroom: number;
  };
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
}
const Item = ({
  isLoading = false,
  data,
  search,
  onClickUpdate,
  onClickDelete,
}: ItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {(data?.subject_attendance.date_time && (
              <FormattedDate
                value={data?.subject_attendance.date_time}
                weekday="long"
                day="numeric"
                month="long"
                year="numeric"
              />
            )) ||
              "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {(data?.subject_attendance.date_time && (
              <FormattedTime value={data?.subject_attendance.date_time} />
            )) ||
              "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.subject.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.subject_attendance.code ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4 flex items-center gap-1">
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} variant={"outline"} asChild>
              <Link
                to="/attendance/subject/$subjectAttendanceId"
                params={{
                  subjectAttendanceId: String(data?.subject_attendance.id),
                }}
                search={{
                  batch: search?.batch ?? 0,
                  major: search?.major ?? 0,
                  classroom: search?.classroom ?? 0,
                }}
              >
                <EyeIcon />
              </Link>
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button variant={"outline"} size={"icon"} onClick={onClickUpdate}>
              <Edit2Icon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button
              variant={"destructive"}
              size={"icon"}
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
