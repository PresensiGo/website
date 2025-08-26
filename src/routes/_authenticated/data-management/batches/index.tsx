import { WithSkeleton } from "@/components";
import {
  DeleteBatchDialog,
  ImportDataDialog,
  UpsertBatchDialog,
} from "@/components/data-management";
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
import { Edit2Icon, EyeIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/data-management/batches/"
)({
  component: Page,
});

function Page() {
  const [dialogUpsertBatchState, setDialogUpsertBatchState] = useState<{
    open: boolean;
    data?: { id: number; name: string };
  }>({ open: false });
  const [dialogDeleteBatchState, setDialogDeleteBatchState] = useState<{
    open: boolean;
    data?: { id: number; name: string };
  }>({ open: false });
  const [importDialogState, setImportDialogState] = useState<{
    open: boolean;
  }>({ open: false });

  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches"
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Data</p>
          <p className="text-muted-foreground">
            Halaman ini menampilkan daftar lengkap angkatan. Anda dapat melihat,
            mengelola, dan menambahkan data angkatan baru untuk setiap tahun
            ajaran.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end">
            <Button onClick={() => setImportDialogState({ open: true })}>
              <UploadIcon />
              Impor Data
            </Button>
          </div>

          <div className="overflow-hidden border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-4">Nama Angkatan</TableHead>
                  <TableHead className="px-4 w-1">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* loading state */}
                {isLoading &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <Item isLoading key={"batch-loading-" + index} />
                  ))}

                {/* empty state */}
                {isSuccess && data && data.items.length === 0 && (
                  <TableRow>
                    <TableCell
                      className="text-muted-foreground text-center py-4"
                      colSpan={2}
                    >
                      Tidak ada data angkatan
                    </TableCell>
                  </TableRow>
                )}

                {/* success state */}
                {isSuccess &&
                  data &&
                  data.items.map((item, index) => (
                    <Item
                      key={"batch-item-" + index}
                      data={item}
                      onClickUpdate={() =>
                        setDialogUpsertBatchState({
                          open: true,
                          data: {
                            id: item.batch.id,
                            name: item.batch.name,
                          },
                        })
                      }
                      onClickDelete={() =>
                        setDialogDeleteBatchState({
                          open: true,
                          data: {
                            id: item.batch.id,
                            name: item.batch.name,
                          },
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
      <UpsertBatchDialog
        open={dialogUpsertBatchState.open}
        onOpenChange={(open, status) => {
          setDialogUpsertBatchState({ open, data: undefined });
          if (status) refetch();
        }}
        data={dialogUpsertBatchState.data}
      />
      <DeleteBatchDialog
        open={dialogDeleteBatchState.open}
        onOpenChange={(open, status) => {
          setDialogDeleteBatchState({ open, data: undefined });
          if (status) refetch();
        }}
        data={dialogDeleteBatchState.data}
      />
      <ImportDataDialog
        open={importDialogState.open}
        onOpenChange={(open, status) => {
          setImportDialogState({ open });
          if (status) refetch();
        }}
      />
    </>
  );
}

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllBatchesItem"];
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
}
const Item = ({
  isLoading = false,
  data,
  onClickUpdate,
  onClickDelete,
}: ItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.batch.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="flex gap-1 px-4">
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} asChild variant={"outline"}>
              <Link
                to="/data-management/batches/$batchId/majors"
                params={{ batchId: String(data?.batch.id) }}
              >
                <EyeIcon />
              </Link>
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} onClick={onClickUpdate} variant={"outline"}>
              <Edit2Icon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button
              size={"icon"}
              onClick={onClickDelete}
              variant={"destructive"}
            >
              <TrashIcon />
            </Button>
          </WithSkeleton>
        </TableCell>
      </TableRow>
    </>
  );
};
