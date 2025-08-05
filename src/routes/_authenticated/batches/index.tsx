import { UpsertBatchDialog } from "@/components/batch";
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
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/batches/")({
  component: Page,
});

function Page() {
  const [dialogUpsertBatchState, setDialogUpsertBatchState] = useState<{
    open: boolean;
  }>({ open: false });

  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches"
  );

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
                  <TableCell></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <UpsertBatchDialog
        open={dialogUpsertBatchState.open}
        onOpenChange={(open, status) => {
          setDialogUpsertBatchState({ open });
          if (status) refetch();
        }}
      />
    </>
  );
}
