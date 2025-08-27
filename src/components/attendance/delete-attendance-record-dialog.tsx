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

export interface DeleteSubjectAttendanceRecordDialogDataProps {
  batchId: number;
  majorId: number;
  classroomId: number;
  attendanceId: number;
  recordId: number;
  studentNIS: string;
  studentName: string;
}

export interface DeleteGeneralAttendanceRecordDialogDataProps {
  attendanceId: number;
  recordId: number;
  studentNIS: string;
  studentName: string;
}

interface DeleteAttendanceRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  type: "subject" | "general";
  data?:
    | DeleteSubjectAttendanceRecordDialogDataProps
    | DeleteGeneralAttendanceRecordDialogDataProps;
}

export const DeleteAttendanceRecordDialog = ({
  open,
  onOpenChange,
  type,
  data,
}: DeleteAttendanceRecordDialogProps) => {
  const { mutate: mutateSubject, isPending: isPendingSubject } =
    $api.useMutation(
      "delete",
      "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/{subject_attendance_id}/records/{record_id}",
      {
        onSuccess: () => {
          toast.success("Berhasil!", {
            description: "Status presensi siswa berhasil dihapus.",
            position: "top-right",
          });
          onOpenChange(false, true);
        },
      }
    );
  const { mutate: mutateGeneral, isPending: isPendingGeneral } =
    $api.useMutation(
      "delete",
      "/api/v1/general-attendances/{general_attendance_id}/records/{record_id}",
      {
        onSuccess: () => {
          toast.success("Berhasil!", {
            description: "Status presensi siswa berhasil dihapus.",
            position: "top-right",
          });
          onOpenChange(false, true);
        },
      }
    );

  const handleSubmit = () => {
    if (data) {
      if (type === "subject") {
        const { batchId, majorId, classroomId } =
          data as DeleteSubjectAttendanceRecordDialogDataProps;
        mutateSubject({
          params: {
            path: {
              batch_id: batchId,
              major_id: majorId,
              classroom_id: classroomId,
              subject_attendance_id: data.attendanceId,
              record_id: data.recordId,
            },
          },
        });
      } else {
        mutateGeneral({
          params: {
            path: {
              general_attendance_id: data.attendanceId,
              record_id: data.recordId,
            },
          },
        });
      }
    }
  };

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
            <AlertDialogCancel disabled={isPendingSubject || isPendingGeneral}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPendingSubject || isPendingGeneral}
              onClick={handleSubmit}
            >
              {(isPendingSubject || isPendingGeneral) && (
                <Loader2Icon className="animate-spin" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
