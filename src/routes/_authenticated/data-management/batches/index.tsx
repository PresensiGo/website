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
import { Edit2Icon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
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
      <div className="py-6">
        <p className="text-3xl font-semibold">Daftar Angkatan</p>
        <p className="text-muted-foreground">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae
          labore deleniti obcaecati. Perferendis modi eius laboriosam laudantium
          nam iure quae quos! Quam sunt corrupti quisquam voluptas voluptate
          molestiae enim culpa.
        </p>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setDialogUpsertBatchState({ open: true })}>
            <PlusIcon />
            Angkatan Baru
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Nama</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.batches.map((item, index) => (
                <TableRow key={"batch-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="space-x-1 ">
                    <Button size={"icon"} asChild variant={"outline"}>
                      <Link
                        to="/data-management/batches/$batchId/majors"
                        params={{ batchId: String(item.id) }}
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
                            id: item.id,
                            name: item.name,
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
                            id: item.id,
                            name: item.name,
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
