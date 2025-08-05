import { DeleteBatchDialog, UpsertBatchDialog } from "@/components/batch";
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
import { Edit2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/batches/")({
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
      <div className="container mx-auto">
        <p>halaman daftar angkatan</p>

        <Button onClick={() => setDialogUpsertBatchState({ open: true })}>
          <PlusIcon />
          Angkatan Baru
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.batches.map((batch, index) => (
                <TableRow key={"batch-item-" + index}>
                  <TableCell>{batch.batch.name}</TableCell>
                  <TableCell>
                    <Button
                      size={"icon"}
                      onClick={() =>
                        setDialogUpsertBatchState({
                          open: true,
                          data: { id: batch.batch.id, name: batch.batch.name },
                        })
                      }
                    >
                      <Edit2Icon />
                    </Button>
                    <Button
                      size={"icon"}
                      onClick={() =>
                        setDialogDeleteBatchState({
                          open: true,
                          data: { id: batch.batch.id, name: batch.batch.name },
                        })
                      }
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
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
