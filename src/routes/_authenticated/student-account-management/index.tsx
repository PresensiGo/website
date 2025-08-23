import { FilterDialog, WithSkeleton } from "@/components";
import { EjectStudentAccountDialog } from "@/components/student-account-management";
import { Badge } from "@/components/ui/badge";
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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FilterIcon, XIcon } from "lucide-react";
import { useState } from "react";
import z from "zod";

const studentFilterSchema = z.object({
  batch: z.number().optional(),
  major: z.number().optional(),
  classroom: z.number().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/student-account-management/",
)({
  component: RouteComponent,
  validateSearch: studentFilterSchema,
});

function RouteComponent() {
  const { batch, major, classroom } = Route.useSearch();

  const navigate = useNavigate({ from: Route.fullPath });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [filter, setFilter] = useState<{
  //   batchId: number;
  //   majorId: number;
  //   classroomId: number;
  // }>();
  const [ejectDialogState, setEjectDialogState] = useState<{
    open: boolean;
    data?: {
      id: number;
    };
  }>({ open: false });

  const {
    isLoading: isLoadingAccounts,
    isSuccess: isSuccessAccounts,
    data: dataAccounts,
    refetch: refetchAccounts,
  } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/student-accounts",
    {
      params: {
        path: {
          batch_id: batch ?? 0,
          major_id: major ?? 0,
          classroom_id: classroom ?? 0,
        },
      },
    },
    { enabled: !!batch && !!major && !!classroom },
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Akun Siswa</p>
          <p className="text-muted-foreground">
            Halaman ini memungkinkan Anda untuk mengelola akun siswa. Pilih
            angkatan untuk melihat daftar jurusan, kelas, dan siswa yang
            terdaftar di dalamnya.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <Button variant={"outline"} onClick={() => setIsFilterOpen(true)}>
              <FilterIcon />
              Filter Data Siswa
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-4">Nomor Induk Siswa</TableHead>
                  <TableHead className="px-4">Nama Siswa</TableHead>
                  <TableHead className="px-4">ID Perangkat</TableHead>
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
                      dengan menekan tombol di pojok kanan atas.
                    </TableCell>
                  </TableRow>
                )}

                {/* loading state */}
                {isLoadingAccounts &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <Item key={"account-loading-" + index} isLoading />
                  ))}

                {/* success state */}
                {isSuccessAccounts &&
                  dataAccounts &&
                  dataAccounts.items.map((item, index) => (
                    <Item
                      key={"account-item-" + index}
                      data={item}
                      onClickEject={() =>
                        setEjectDialogState({
                          open: true,
                          data: { id: item.student_token.id },
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
      <FilterDialog
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
      <EjectStudentAccountDialog
        open={ejectDialogState.open}
        onOpenChange={(open, status) => {
          setEjectDialogState({ open, data: undefined });
          if (status) refetchAccounts();
        }}
        data={ejectDialogState.data}
      />
    </>
  );
}

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["dto.StudentAccount"];
  onClickEject?: () => void;
}
const Item = ({ isLoading = false, data, onClickEject }: ItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.student.nis ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.student.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.student_token.device_id.length === 0 ? (
              <Badge variant={"outline"}>Belum masuk</Badge>
            ) : (
              (data?.student_token.device_id ?? "loading")
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            <Button variant={"outline"} onClick={onClickEject}>
              <XIcon />
              Lepas
            </Button>
          </WithSkeleton>
        </TableCell>
      </TableRow>
    </>
  );
};
