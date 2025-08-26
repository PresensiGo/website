import { WithSkeleton } from "@/components";
import {
  DeleteStudentDialog,
  type DeleteStudentDialogDataProps,
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
import { createFileRoute } from "@tanstack/react-router";
import { Edit2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/data-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId, classroomId } = Route.useParams();

  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    data?: DeleteStudentDialogDataProps;
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
  const { data: dataClassroom } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
          classroom_id: Number(classroomId),
        },
      },
    }
  );
  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/students",
    {
      params: {
        path: {
          batch_id: Number(batchId),
          major_id: Number(majorId),
          classroom_id: Number(classroomId),
        },
      },
    }
  );

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Daftar Siswa</p>
          <p className="text-muted-foreground">
            Halaman ini menyajikan daftar lengkap siswa yang terdaftar di kelas{" "}
            {dataClassroom && dataClassroom.classroom.name} pada jurusan{" "}
            {dataMajor && dataMajor.major.name} angkatan{" "}
            {dataBatch && dataBatch.batch.name}. Gunakan halaman ini untuk
            melihat data siswa secara rinci.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="px-4">NIS</TableHead>
                <TableHead className="px-4">Nama</TableHead>
                <TableHead className="px-4">Jenis Kelamin</TableHead>
                <TableHead className="px-4 w-1">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* loading state */}
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Item key={"student-loading-" + index} isLoading />
                ))}

              {/* empty state */}
              {isSuccess && data && data.students.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground text-center py-4"
                  >
                    Tidak ada data siswa
                  </TableCell>
                </TableRow>
              )}

              {/* success state */}
              {isSuccess &&
                data &&
                data.students.length > 0 &&
                data.students.map((item, index) => (
                  <Item
                    key={"student-item-" + index}
                    data={item}
                    onClickDelete={() =>
                      setDeleteDialogState({
                        open: true,
                        data: {
                          batchId: Number(batchId),
                          majorId: Number(majorId),
                          classroomId: Number(classroomId),
                          studentId: item.id,
                          studentName: item.name,
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
      <DeleteStudentDialog
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
  data?: components["schemas"]["Student"];
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
            {data?.nis ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.gender ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4 flex gap-1">
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
