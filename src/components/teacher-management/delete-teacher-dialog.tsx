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

interface DeleteTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: { id: number; name: string };
}

export const DeleteTeacherDialog = ({
  open,
  onOpenChange,
  data,
}: DeleteTeacherDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/api/v1/accounts/{account_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Data guru berhasil dihapus.",
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
              Apakah Anda yakin akan menghapus data guru{" "}
              <span className="text-foreground font-medium">{data?.name}</span>?
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
                        account_id: data.id,
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
