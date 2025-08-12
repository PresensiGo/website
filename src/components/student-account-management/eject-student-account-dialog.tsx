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

interface EjectStudentAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: {
    id: number;
  };
}
export const EjectStudentAccountDialog = ({
  open,
  onOpenChange,
  data,
}: EjectStudentAccountDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "post",
    "/api/v1/auth/students/accounts/{student_token_id}/eject",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Perangkat berhasil dilepaskan dari akun siswa.",
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
            <AlertDialogTitle>Konfirmasi Lepas Perangkat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin melepaskan perangkat ini dari akun siswa?
              Setelah perangkat dilepaskan, siswa dapat masuk kembali ke akun
              mereka menggunakan perangkat lain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                if (data)
                  mutate({
                    params: { path: { student_token_id: data.id } },
                  });
              }}
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              Lepaskan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
