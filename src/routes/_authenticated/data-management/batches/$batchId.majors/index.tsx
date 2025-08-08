import {
  DeleteMajorDialog,
  UpsertMajorDialog,
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
  "/_authenticated/data-management/batches/$batchId/majors/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId } = Route.useParams();

  const [upsertDialogState, setUpsertDialogState] = useState<{
    open: boolean;
    data?: {
      id: number;
      name: string;
    };
  }>({ open: false });
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    data?: { id: number; name: string };
  }>({ open: false });

  const { isSuccess: isSuccessBatch, data: dataBatch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}",
    {
      params: { path: { batch_id: Number(batchId) } },
    }
  );
  const { isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors",
    {
      params: { path: { batch_id: Number(batchId) } },
    }
  );

  return (
    <>
      <div className="py-6">
        <p className="text-3xl font-semibold">
          Daftar Jurusan - {dataBatch && dataBatch.batch.name}
        </p>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat
          corporis harum in provident alias qui autem labore optio nihil nam,
          ullam dolores sunt mollitia blanditiis odit, vel magni nesciunt iusto.
        </p>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setUpsertDialogState({ open: true })}>
            <PlusIcon />
            Tambah Jurusan
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
              data.majors.map((item, index) => (
                <TableRow key={"major-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="space-x-1">
                    <Button size={"icon"} asChild variant={"outline"}>
                      <Link
                        to="/data-management/batches/$batchId/majors/$majorId/classrooms"
                        params={{ batchId, majorId: String(item.id) }}
                      >
                        <EyeIcon />
                      </Link>
                    </Button>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() =>
                        setUpsertDialogState({
                          open: true,
                          data: {
                            id: item.id,
                            name: item.name,
                          },
                        })
                      }
                    >
                      <Edit2Icon />
                    </Button>
                    <Button
                      size={"icon"}
                      variant={"destructive"}
                      onClick={() =>
                        setDeleteDialogState({
                          open: true,
                          data: {
                            id: item.id,
                            name: item.name,
                          },
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
      <UpsertMajorDialog
        open={upsertDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertDialogState({ open, data: undefined });
          if (status) refetch();
        }}
        batchId={Number(batchId)}
        data={upsertDialogState.data}
      />
      <DeleteMajorDialog
        open={deleteDialogState.open}
        onOpenChange={(open, status) => {
          setDeleteDialogState({ open, data: undefined });
          if (status) refetch();
        }}
        data={deleteDialogState.data}
      />
    </>
  );
}
