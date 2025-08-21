import { WithSkeleton } from "@/components";
import {
  DeleteSubjectDialog,
  UpsertSubjectDialog,
} from "@/components/subject-management";
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
import { Edit2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/subject-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [upsertDialogState, setUpsertDialogState] = useState<{
    open: boolean;
    data?: { id: number; name: string };
  }>({ open: false });
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    data?: { id: number; name: string };
  }>({ open: false });

  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/subjects"
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Mata Pelajaran</p>
          <p className="text-muted-foreground">
            Kelola seluruh data mata pelajaran yang terintegrasi pada sistem
            ini. Pastikan setiap mata pelajaran telah terdaftar dengan benar
            agar dapat digunakan untuk membuat presensi mata pelajaran.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <Button onClick={() => setUpsertDialogState({ open: true })}>
              <PlusIcon />
              Tambah Mata Pelajaran
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-4">Nama Mata Pelajaran</TableHead>
                  <TableHead className="w-1 px-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* loading state */}
                {isLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <SubjectItem
                      key={"loading-subject-item-" + index}
                      isLoading
                    />
                  ))}

                {/* success state */}
                {isSuccess &&
                  data &&
                  data.subjects.map((item, index) => (
                    <SubjectItem
                      key={"subject-item-" + index}
                      data={item}
                      onClickUpdate={() =>
                        setUpsertDialogState({
                          open: true,
                          data: { id: item.id, name: item.name },
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
      <UpsertSubjectDialog
        open={upsertDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertDialogState({
            open,
            data: undefined,
          });
          if (status) refetch();
        }}
        data={upsertDialogState.data}
      />
      <DeleteSubjectDialog
        open={deleteDialogState.open}
        onOpenChange={(open, status) => {
          setDeleteDialogState({
            open,
            data: undefined,
          });
          if (status) refetch();
        }}
        data={deleteDialogState.data}
      />
    </>
  );
}

interface SubjectItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["Subject"];
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
}
const SubjectItem = ({
  isLoading = false,
  data,
  onClickUpdate,
  onClickDelete,
}: SubjectItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="flex gap-1 px-4">
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
