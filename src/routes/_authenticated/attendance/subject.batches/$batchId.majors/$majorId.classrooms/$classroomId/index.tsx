import { UpsertSubjectAttendanceDialog } from "@/components/attendance/subject";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/attendance/subject/batches/$batchId/majors/$majorId/classrooms/$classroomId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="py-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">
            Daftar Presensi Mata Pelajaran - Kelas ABCD
          </p>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt
            suscipit rem provident eligendi doloribus mollitia dolorum
            praesentium odit debitis, assumenda nesciunt! Dolorem asperiores
            officiis dolores repellendus error fugiat delectus cum.
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <Button>
            <PlusIcon />
            Tambah Presensi Mata Pelajaran
          </Button>
        </div>
      </div>

      {/* dialogs */}
      <UpsertSubjectAttendanceDialog />
    </>
  );
}
