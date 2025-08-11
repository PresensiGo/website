import { ImportTeacherDialog } from "@/components/teacher-management";
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
import { PlusIcon, UploadIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/teacher-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [importDialogState, setImportDialogState] = useState<{
    open: boolean;
  }>({ open: false });

  const { isSuccess, data, refetch } = $api.useQuery("get", "/api/v1/accounts");

  return (
    <>
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Data Guru</p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
            perferendis, eligendi debitis fugit a, quis voluptate praesentium
            nesciunt natus ut deserunt incidunt sint dolores hic aspernatur
            molestiae magnam doloremque! Voluptatem.
          </p>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <Button variant={"outline"}>
            <UploadIcon />
            Unggah Data Guru
          </Button>
          <Button>
            <PlusIcon />
            Tambah Guru
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.users.map((item, index) => (
                <TableRow key={"account-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <ImportTeacherDialog
        open={importDialogState.open}
        onOpenChange={(open, status) => {
          setImportDialogState({ open });
          if (status) refetch();
        }}
      />
    </>
  );
}
