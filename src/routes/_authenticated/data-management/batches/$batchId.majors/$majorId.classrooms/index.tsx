import { UpsertClassroomDialog } from "@/components/data-management";
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
  const { isSuccess, data, refetch } = $api.useQuery(
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
              {isSuccess &&
                data &&
                data.items.map(({ classroom }, index) => (
                  <TableRow key={"classroom-item-" + index}>
                    <TableCell className="px-4">{classroom.name}</TableCell>
                    <TableCell className="space-x-1 px-4">
                      <Button size={"icon"} asChild variant={"outline"}>
                        <Link
                          to="/data-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students"
                          params={{
                            batchId,
                            majorId,
                            classroomId: String(classroom.id),
                          }}
                        >
                          <EyeIcon />
                        </Link>
                      </Button>
                      <Button
                        size={"icon"}
                        variant={"outline"}
                        onClick={() =>
                          setDialogUpsertState({
                            open: true,
                            data: {
                              id: classroom.id,
                              name: classroom.name,
                            },
                          })
                        }
                      >
                        <Edit2Icon />
                      </Button>
                      <Button size={"icon"} variant={"destructive"}>
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
    </>
  );
}
