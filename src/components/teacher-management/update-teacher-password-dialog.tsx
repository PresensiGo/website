import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { $api } from "@/lib/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  password: z
    .string("Kata sandi tidak boleh kosong!")
    .min(1, "Kata sandi tidak boleh kosong!"),
});

interface UpdateTeacherPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: {
    id: number;
  };
}
export const UpdateTeacherPasswordDialog = ({
  open,
  onOpenChange,
  data,
}: UpdateTeacherPasswordDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = $api.useMutation(
    "put",
    "/api/v1/accounts/{account_id}/password",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Kata sandi guru berhasil diperbarui.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (data)
      mutate({
        params: { path: { account_id: data.id } },
        body: { password: values.password },
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Kata Sandi Guru</DialogTitle>
            <DialogDescription>
              Masukkan kata sandi baru untuk mengganti kata sandi guru ketika
              terjadi lupa kata sandi.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi Baru</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Masukkan kata sandi baru"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button variant={"outline"} disabled={isPending}>
              Batal
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {isPending && <Loader2Icon className="animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
