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
import { Edit2Icon, EyeIcon, TrashIcon } from "lucide-react";
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

  const { data: dataBatch } = $api.useQuery(
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
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Daftar Jurusan</p>
          <p className="text-muted-foreground">
            Halaman ini menampilkan daftar lengkap jurusan yang terdaftar di
            angkatan {dataBatch && dataBatch.batch.name}. Anda dapat menambahkan
            jurusan baru, serta mengelola (mengubah atau menghapus) data jurusan
            yang sudah ada.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="px-4">Nama</TableHead>
                <TableHead className="w-1 px-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSuccess &&
                data &&
                data.items.map(({ major }, index) => (
                  <TableRow key={"major-item-" + index}>
                    <TableCell className="px-4">{major.name}</TableCell>
                    <TableCell className="space-x-1 px-4">
                      <Button size={"icon"} asChild variant={"outline"}>
                        <Link
                          to="/data-management/batches/$batchId/majors/$majorId/classrooms"
                          params={{ batchId, majorId: String(major.id) }}
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
                              id: major.id,
                              name: major.name,
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
                              id: major.id,
                              name: major.name,
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
        batchId={Number(batchId)}
        data={deleteDialogState.data}
      />
    </>
  );
}
