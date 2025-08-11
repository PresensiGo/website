import { ImportTeacherDialog } from "@/components/teacher-management";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { UploadIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/teacher-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [importDialogState, setImportDialogState] = useState<{
    open: boolean;
  }>({ open: false });

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

        <div className="flex justify-end mt-4">
          <Button>
            <UploadIcon />
            Unggah Data Guru
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <ImportTeacherDialog
        open={importDialogState.open}
        onOpenChange={(open, status) => {
          setImportDialogState({ open });
          if (status) {
          }
        }}
      />
    </>
  );
}
