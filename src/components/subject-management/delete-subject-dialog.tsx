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

interface DeleteSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: { id: number; name: string };
}

export const DeleteSubjectDialog = ({
  open,
  onOpenChange,
  data,
}: DeleteSubjectDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/api/v1/subjects/{subject_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Mata pelajaran berhasil dihapus.",
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
              Apakah Anda yakin akan menghapus data mata pelajaran{" "}
              <span className="text-foreground font-medium">{data?.name}</span>?
              Data-data terkait seperti presensi kehadiran mata pelajaran akan
              ikut terhapus. Tindakan yang Anda lakukan tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                if (data) mutate({ params: { path: { subject_id: data.id } } });
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
