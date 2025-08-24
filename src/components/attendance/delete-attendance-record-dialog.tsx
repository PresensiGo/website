import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { $api } from "@/lib/api/api";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

interface DeleteAttendanceRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: {
    batchId: number;
    majorId: number;
    classroomId: number;
    attendanceId: number;
    recordId: number;
    studentNIS: string;
    studentName: string;
  };
}

export const DeleteAttendanceRecordDialog = ({
  open,
  onOpenChange,
  data,
}: DeleteAttendanceRecordDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/{subject_attendance_id}/records/{record_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description:
            "Presensi kehadiran dan data-data terkait berhasil dihapus.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );

  return (
    <>
      <AlertDialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin akan menghapus data presensi untuk siswa{" "}
              <span className="font-medium text-foreground">
                {data?.studentName}
              </span>{" "}
              dengan NIS{" "}
              <span className="font-medium text-foreground">
                {data?.studentNIS}
              </span>
              ? Tindakan yang Anda lakukan tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                if (data)
                  mutate({
                    params: {
                      path: {
                        batch_id: 0,
                        major_id: 0,
                        classroom_id: 0,
                        subject_attendance_id: 0,
                        record_id: data.recordId,
                      },
                    },
                  });
              }}
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
