import { WithSkeleton } from "@/components";
import {
  DeleteClassroomDialog,
  UpsertClassroomDialog,
  type DeleteClassroomDialogDataProps,
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
  "/_authenticated/data-management/batches/$batchId/majors/$majorId/classrooms/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId } = Route.useParams();

  const [dialogUpsertState, setDialogUpsertState] = useState<{
    open: boolean;
    data?: {
      id: number;
      name: string;
    };
  }>({ open: false });
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    data?: DeleteClassroomDialogDataProps;
  }>({ open: false });

  const { data: dataBatch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}",
    {
      params: {
        path: {
          batch_id: Number(batchId),
        },
      },
    }
  );
  const { data: dataMajor } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
        },
      },
    }
  );
  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
        },
      },
    }
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Daftar Kelas</p>
          <p className="text-muted-foreground">
            Halaman ini menampilkan daftar lengkap kelas yang tersedia di
            jurusan {dataMajor && dataMajor.major.name} untuk angkatan{" "}
            {dataBatch && dataBatch.batch.name}. Anda dapat menambahkan kelas
            baru, serta mengelola (mengubah atau menghapus) data kelas yang
            sudah ada.
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
                  <Item key={"classroom-loading-" + index} isLoading />
                ))}

              {/* empty state */}
              {isSuccess && data && data.items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground py-4"
                  >
                    Tidak ada data kelas
                  </TableCell>
                </TableRow>
              )}

              {/* success state */}
              {isSuccess &&
                data &&
                data.items.length > 0 &&
                data.items.map((item, index) => (
                  <Item
                    key={"classroom-item-" + index}
                    data={item}
                    batchId={batchId}
                    majorId={majorId}
                    onClickUpdate={() =>
                      setDialogUpsertState({
                        open: true,
                        data: {
                          id: item.classroom.id,
                          name: item.classroom.name,
                        },
                      })
                    }
                    onClickDelete={() =>
                      setDeleteDialogState({
                        open: true,
                        data: {
                          batchId: Number(batchId),
                          majorId: Number(majorId),
                          classroomId: item.classroom.id,
                          classroomName: item.classroom.name,
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
      <UpsertClassroomDialog
        open={dialogUpsertState.open}
        onOpenChange={(open, status) => {
          setDialogUpsertState({ open, data: undefined });
          if (status) refetch();
        }}
        batchId={Number(batchId)}
        majorId={Number(majorId)}
        data={dialogUpsertState.data}
      />
      <DeleteClassroomDialog
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

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllClassroomsByMajorIdItem"];
  batchId?: string;
  majorId?: string;
  onClickUpdate?: () => void;
  onClickDelete?: () => void;
}
const Item = ({
  isLoading = false,
  data,
  batchId,
  majorId,
  onClickUpdate,
  onClickDelete,
}: ItemProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.classroom.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="flex gap-1 px-4">
          <WithSkeleton isLoading={isLoading}>
            <Button size={"icon"} asChild variant={"outline"}>
              <Link
                to="/data-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students"
                params={{
                  batchId: batchId ?? "",
                  majorId: majorId ?? "",
                  classroomId: String(data?.classroom.id),
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
