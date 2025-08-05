import { UpsertMajorDialog } from "@/components/major";
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

export const Route = createFileRoute("/_authenticated/majors/")({
  component: Page,
});

function Page() {
  const [upsertMajorDialogState, setUpsertMajorDialogState] = useState<{
    open: boolean;
    data?: {
      id: number;
      batchId: number;
      name: string;
    };
  }>({ open: false });

  const { isLoading, isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/majors"
  );

  return (
    <>
      <div className="container mx-auto">
        <p>halaman daftar jurusan</p>

        <Button onClick={() => setUpsertMajorDialogState({ open: true })}>
          <PlusIcon />
          Jurusan Baru
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Jurusan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.map((item, index) => (
                <TableRow key={"major-item-" + index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Button
                      size={"icon"}
                      onClick={() =>
                        setUpsertMajorDialogState({
                          open: true,
                          data: {
                            id: item.id,
                            batchId: item.batch_id,
                            name: item.name,
                          },
                        })
                      }
                    >
                      <Edit2Icon />
                    </Button>
                    <Button size={"icon"}>
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <UpsertMajorDialog
        open={upsertMajorDialogState.open}
        onOpenChange={(open, status) => {
          setUpsertMajorDialogState({ open });
          if (status) refetch();
        }}
        data={upsertMajorDialogState.data}
      />
    </>
  );
}
