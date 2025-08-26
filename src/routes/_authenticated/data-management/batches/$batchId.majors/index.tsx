import { WithSkeleton } from "@/components";
import {
  DeleteStudentDialog,
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
import type { components } from "@/lib/api/v1";
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
  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
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
              {/* loading state */}
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Item key={"major-item-loading-" + index} isLoading />
                ))}

              {/* empty state */}
              {isSuccess && data && data.items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-muted-foreground text-center py-4"
                  >
                    Tidak ada data jurusan
                  </TableCell>
                </TableRow>
              )}

              {/* success state */}
              {isSuccess &&
                data &&
                data.items.map((item, index) => (
                  <Item
                    key={"major-item-" + index}
                    data={item}
                    batchId={batchId}
                    onClickUpdate={() =>
                      setUpsertDialogState({
                        open: true,
                        data: {
                          id: item.major.id,
                          name: item.major.name,
                        },
                      })
                    }
                    onClickDelete={() =>
                      setDeleteDialogState({
                        open: true,
                        data: {
                          id: item.major.id,
                          name: item.major.name,
                        },
                      })
                    }
                  />
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
      <DeleteStudentDialog
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

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllMajorsByBatchIdItem"];
  batchId?: string;
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
}
const Item = ({
  isLoading,
  data,
  batchId,
  onClickUpdate,
  onClickDelete,
}: ItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.major.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="flex gap-1 px-4">
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} asChild variant={"outline"}>
              <Link
                to="/data-management/batches/$batchId/majors/$majorId/classrooms"
                params={{
                  batchId: batchId ?? "",
                  majorId: String(data?.major.id),
                }}
              >
                <EyeIcon />
              </Link>
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} variant={"outline"} onClick={onClickUpdate}>
              <Edit2Icon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading}>
            <Button
              size={"icon"}
              variant={"destructive"}
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
