import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { $api } from "@/lib/api/api";
import { auth } from "@/lib/auth";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
}
export const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
  const { mutate, isPending } = $api.useMutation(
    "post",
    "/api/v1/auth/logout",
    {
      onSuccess: () => {
        auth.clear();
        onOpenChange(false, true);
        toast.success("Berhasil!", {
          description: "Anda telah keluar dari akun Anda.",
          position: "top-right",
        });
      },
    },
  );

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin akan keluar dari akun Anda?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <Button
              disabled={isPending}
              onClick={() => {
                const token = auth.get();

                if (token)
                  mutate({
                    body: {
                      refresh_token: token.refreshToken,
                    },
                  });
              }}
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              Keluar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
