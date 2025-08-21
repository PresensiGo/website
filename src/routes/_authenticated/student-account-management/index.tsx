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
import { createFileRoute } from "@tanstack/react-router";
import { FilterIcon, XIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/student-account-management/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<{
    batchId: number;
    majorId: number;
    classroomId: number;
  }>();
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
          batch_id: filter?.batchId ?? 0,
          major_id: filter?.majorId ?? 0,
          classroom_id: filter?.classroomId ?? 0,
        },
      },
    },
    { enabled: !!filter }
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
                {/* loading state */}
                {(isLoadingAccounts || !filter) &&
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
            setFilter(data);
          }
        }}
        data={filter}
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
