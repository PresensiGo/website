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
import { Edit2Icon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
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
      <div className="py-6">
        <p className="text-3xl font-semibold">Daftar Kelas - Jurusan A</p>
        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
          dolore sapiente magni ex sed mollitia minus odio labore architecto
          repudiandae facilis incidunt eos reiciendis deleniti enim, nulla
          eligendi nihil natus!
        </p>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setDialogUpsertState({ open: true })}>
            <PlusIcon />
            Tambah Kelas
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
              data.classrooms.map((item, index) => (
                <TableRow key={"classroom-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="space-x-1">
                    <Button size={"icon"} asChild variant={"outline"}>
                      <Link
                        to="/data-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students"
                        params={{
                          batchId,
                          majorId,
                          classroomId: String(item.id),
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
                            id: item.id,
                            name: item.name,
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
