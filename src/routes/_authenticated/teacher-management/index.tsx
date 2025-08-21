import { WithSkeleton } from "@/components";
import {
  DeleteTeacherDialog,
  ImportTeacherDialog,
  UpdateTeacherPasswordDialog,
  UpdateTeacherRoleDialog,
} from "@/components/teacher-management";
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
import { LockIcon, TrashIcon, UploadIcon, UserCogIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/teacher-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [importDialogState, setImportDialogState] = useState<{
    open: boolean;
  }>({ open: false });
  const [updatePasswordDialogState, setUpdatePasswordDialogState] = useState<{
    open: boolean;
    data?: { id: number };
  }>({ open: false });
  const [updateRoleDialogState, setUpdateRoleDialogState] = useState<{
    open: boolean;
    data?: {
      id: number;
      name: string;
      role: string;
    };
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
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Data Guru</p>
          <p className="text-muted-foreground">
            Kelola seluruh data guru yang berwenang membuat presensi siswa.
            Gunakan tombol Unggah Data Guru untuk mengunggah data guru dalam
            format file Excel. Anda juga dapat mengubah role dan password setiap
            guru secara manual.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <Button onClick={() => setImportDialogState({ open: true })}>
              <UploadIcon />
              Unggah Data Guru
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-4">Nama Guru</TableHead>
                  <TableHead className="px-4">Alamat Email</TableHead>
                  <TableHead className="px-4">Role</TableHead>
                  <TableHead className="px-4 w-1">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* loading state */}
                {isLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <AccountItem
                      key={"loading-account-item-" + index}
                      isLoading
                    />
                  ))}

                {/* success state */}
                {isSuccess &&
                  data &&
                  data.users.map((item, index) => (
                    <AccountItem
                      key={"account-item-" + index}
                      data={item}
                      onClickUpdatePassword={() =>
                        setUpdatePasswordDialogState({
                          open: true,
                          data: { id: item.id },
                        })
                      }
                      onClickUpdateRole={() =>
                        setUpdateRoleDialogState({
                          open: true,
                          data: {
                            id: item.id,
                            name: item.name,
                            role: item.role,
                          },
                        })
                      }
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
        </div>
      </div>

      {/* dialogs */}
      <ImportTeacherDialog
        open={importDialogState.open}
        onOpenChange={(open, status) => {
          setImportDialogState({ open });
          if (status) refetch();
        }}
      />
      <UpdateTeacherPasswordDialog
        open={updatePasswordDialogState.open}
        onOpenChange={(open, status) => {
          setUpdatePasswordDialogState({ open });
          if (status) refetch();
        }}
        data={updatePasswordDialogState.data}
      />
      <UpdateTeacherRoleDialog
        open={updateRoleDialogState.open}
        onOpenChange={(open, status) => {
          setUpdateRoleDialogState({ open });
          if (status) refetch();
        }}
        data={updateRoleDialogState.data}
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
  data?: components["schemas"]["User"];
  onClickUpdatePassword?: () => void;
  onClickUpdateRole?: () => void;
  onClickDelete?: () => void;
}
const AccountItem = ({
  isLoading = false,
  data,
  onClickUpdatePassword,
  onClickUpdateRole,
  onClickDelete,
}: AccountItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.email ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            <Badge variant={"outline"}>{data?.role ?? "loading"}</Badge>
          </WithSkeleton>
        </TableCell>
        <TableCell className="flex gap-1 px-4">
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={onClickUpdateRole}
            >
              <UserCogIcon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={onClickUpdatePassword}
            >
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
