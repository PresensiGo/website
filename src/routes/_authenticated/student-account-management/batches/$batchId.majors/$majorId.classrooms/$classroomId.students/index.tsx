import { EjectStudentAccountDialog } from "@/components/student-account-management";
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
import { XIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/student-account-management/batches/$batchId/majors/$majorId/classrooms/$classroomId/students/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { batchId, majorId, classroomId } = Route.useParams();

  const [ejectDialogState, setEjectDialogState] = useState<{
    open: boolean;
    data?: {
      id: number;
    };
  }>({ open: false });

  const { isSuccess, data, refetch } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/student-accounts",
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
      <div className="py-6">
        <div>
          <p>Daftar Akun Siswa</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
            pariatur, officiis qui quasi, commodi ab eaque earum aspernatur
            mollitia tempora esse officia magni suscipit quis voluptatem at,
            veritatis cumque impedit.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIS</TableHead>
              <TableHead>Nama Siswa</TableHead>
              <TableHead>ID Perangkat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSuccess &&
              data &&
              data.items.map((item, index) => (
                <TableRow key={"student-account-item-" + index}>
                  <TableCell>{item.student.nis}</TableCell>
                  <TableCell>{item.student.name}</TableCell>
                  <TableCell>
                    {item.student_token.device_id.length === 0
                      ? "Belum masuk akun"
                      : item.student_token.device_id}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => {
                        if (item.student_token.id > 0)
                          setEjectDialogState({
                            open: true,
                            data: { id: item.student_token.id },
                          });
                      }}
                    >
                      <XIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* dialogs */}
      <EjectStudentAccountDialog
        open={ejectDialogState.open}
        onOpenChange={(open, status) => {
          setEjectDialogState({ open, data: undefined });
          if (status) refetch();
        }}
        data={ejectDialogState.data}
      />
    </>
  );
}
