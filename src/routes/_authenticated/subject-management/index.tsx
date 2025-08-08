import {
  DeleteSubjectDialog,
  UpsertSubjectDialog,
} from "@/components/subject-management";
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

export const Route = createFileRoute("/_authenticated/subject-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [upsertDialogState, setUpsertDialogState] = useState<{
    open: boolean;
    data?: { id: number; name: string };
  }>({ open: false });
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    data?: { id: number; name: string };
  }>({ open: false });

  const { isSuccess, data, refetch } = $api.useQuery("get", "/api/v1/subjects");

  return (
    <>
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Mata Pelajaran</p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia
            fugit deserunt amet blanditiis, dignissimos cupiditate veniam
            explicabo molestiae voluptas ducimus nobis porro officiis veritatis
            et at labore nam neque iure.
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setUpsertDialogState({ open: true })}>
            <PlusIcon />
            Tambah Mata Pelajaran
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
              data.subjects.map((item, index) => (
                <TableRow key={"subject-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="space-x-1">
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() =>
                        setUpsertDialogState({
                          open: true,
                          data: { id: item.id, name: item.name },
                        })
                      }
                    >
                      <Edit2Icon />
                    </Button>
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      onClick={() =>
                        setDeleteDialogState({
                          open: true,
                          data: { id: item.id, name: item.name },
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
      <UpsertSubjectDialog
        open={upsertDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertDialogState({
            open,
            data: undefined,
          });
          if (status) refetch();
        }}
        data={upsertDialogState.data}
      />
      <DeleteSubjectDialog
        open={deleteDialogState.open}
        onOpenChange={(open, status) => {
          setDeleteDialogState({
            open,
            data: undefined,
          });
          if (status) refetch();
        }}
        data={deleteDialogState.data}
      />
    </>
  );
}
