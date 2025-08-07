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

interface DeleteBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: { id: number; name: string };
}

export const DeleteBatchDialog = ({
  open,
  onOpenChange,
  data,
}: DeleteBatchDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/api/v1/batches/{batch_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Angkatan dan data-data terkait berhasil dihapus.",
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
              Apakah Anda yakin akan menghapus data angkatan{" "}
              <span className="text-foreground font-medium">{data?.name}</span>?
              Data-data terkait seperti jurusan, kelas, siswa, dan presensi akan
              ikut terhapus. Tindakan yang Anda lakukan tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                if (data) mutate({ params: { path: { batch_id: data.id } } });
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
