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

export interface DeleteClassroomDialogDataProps {
  batchId: number;
  majorId: number;
  classroomId: number;
  classroomName: string;
}

interface DeleteClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: DeleteClassroomDialogDataProps;
}

export const DeleteClassroomDialog = ({
  open,
  onOpenChange,
  data,
}: DeleteClassroomDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Kelas dan data-data terkait berhasil dihapus.",
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
              Apakah Anda yakin akan menghapus data kelas{" "}
              <span className="text-foreground font-medium">
                {data?.classroomName}
              </span>
              ? Data-data terkait seperti siswa dan presensi akan ikut terhapus.
              Tindakan yang Anda lakukan tidak dapat dipulihkan.
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
