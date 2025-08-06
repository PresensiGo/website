import { DeleteSubjectDialog, UpsertSubjectDialog } from "@/components/subject";
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

export const Route = createFileRoute("/_authenticated/subjects/")({
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
      <div className="container mx-auto p-4">
        <p>Manajemen Mata Pelajaran</p>

        <Button onClick={() => setUpsertDialogState({ open: true })}>
          <PlusIcon />
          Tambah Mata Pelajaran
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
              data.subjects.map((item, index) => (
                <TableRow key={"subject-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button
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
