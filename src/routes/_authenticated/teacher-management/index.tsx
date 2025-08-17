import { WithSkeleton } from "@/components";
import {
  DeleteTeacherDialog,
  ImportTeacherDialog,
} from "@/components/teacher-management";
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
import { LockIcon, TrashIcon, UploadIcon, UserCogIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/teacher-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [importDialogState, setImportDialogState] = useState<{
    open: boolean;
  }>({ open: false });
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    data?: {
      id: number;
      name: string;
    };
  }>({ open: false });

  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/accounts"
  );

  return (
    <>
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Data Guru</p>
          <p className="text-muted-foreground">
            Kelola seluruh data guru yang berwenang membuat presensi siswa.
            Gunakan tombol Unggah Data Guru untuk mengunggah data guru dalam
            format file Excel. Anda juga dapat mengubah role dan password setiap
            guru secara manual.
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={() => setImportDialogState({ open: true })}>
            <UploadIcon />
            Unggah Data Guru
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Guru</TableHead>
              <TableHead>Alamat Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* loading state */}
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <AccountItem key={"loading-account-item-" + index} isLoading />
              ))}

            {/* success state */}
            {isSuccess &&
              data &&
              data.users.map((item, index) => (
                <AccountItem
                  key={"account-item-" + index}
                  data={item}
                  onClickDelete={() =>
                    setDeleteDialogState({
                      open: true,
                      data: { id: item.id, name: item.name },
                    })
                  }
                />
              ))}
          </TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <ImportTeacherDialog
        open={importDialogState.open}
        onOpenChange={(open, status) => {
          setImportDialogState({ open });
          if (status) refetch();
        }}
      />
      <DeleteTeacherDialog
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

interface AccountItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["domains.User"];
  onClickDelete?: () => void;
}
const AccountItem = ({
  isLoading = false,
  data,
  onClickDelete,
}: AccountItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell>
          <WithSkeleton isLoading={isLoading}>
            {data?.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell>
          <WithSkeleton isLoading={isLoading}>
            {data?.email ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell>
          <WithSkeleton isLoading={isLoading}>
            {data?.role ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="flex gap-1">
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button variant={"outline"} size={"icon"}>
              <UserCogIcon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button variant={"outline"} size={"icon"}>
              <LockIcon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading} className="w-fit">
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
