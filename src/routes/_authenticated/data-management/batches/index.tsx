import {
  DeleteBatchDialog,
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

  const { isSuccess, data, refetch } = $api.useQuery("get", "/api/v1/batches");

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
            <Button>
              <UploadIcon />
              Import Data
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
                {isSuccess &&
                  data &&
                  data.items.map(({ batch }, index) => (
                    <TableRow key={"batch-item-" + index}>
                      <TableCell className="px-4">{batch.name}</TableCell>
                      <TableCell className="space-x-1 px-4">
                        <Button size={"icon"} asChild variant={"outline"}>
                          <Link
                            to="/data-management/batches/$batchId/majors"
                            params={{ batchId: String(batch.id) }}
                          >
                            <EyeIcon />
                          </Link>
                        </Button>
                        <Button
                          size={"icon"}
                          onClick={() =>
                            setDialogUpsertBatchState({
                              open: true,
                              data: {
                                id: batch.id,
                                name: batch.name,
                              },
                            })
                          }
                          variant={"outline"}
                        >
                          <Edit2Icon />
                        </Button>
                        <Button
                          size={"icon"}
                          onClick={() =>
                            setDialogDeleteBatchState({
                              open: true,
                              data: {
                                id: batch.id,
                                name: batch.name,
                              },
                            })
                          }
                          variant={"destructive"}
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
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
    </>
  );
}
