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

export interface DeleteStudentDialogDataProps {
  batchId: number;
  majorId: number;
  classroomId: number;
  studentId: number;
  studentName: string;
}

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: DeleteStudentDialogDataProps;
}

export const DeleteStudentDialog = ({
  open,
  onOpenChange,
  data,
}: DeleteStudentDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/students/{student_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Siswa dan data-data terkait berhasil dihapus.",
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
              Apakah Anda yakin akan menghapus data siswa{" "}
              <span className="text-foreground font-medium">
                {data?.studentName}
              </span>
              ? Data-data terkait seperti presensi akan ikut terhapus. Tindakan
              yang Anda lakukan tidak dapat dipulihkan.
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
                        batch_id: data.batchId,
                        major_id: data.majorId,
                        classroom_id: data.classroomId,
                        student_id: data.studentId,
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
