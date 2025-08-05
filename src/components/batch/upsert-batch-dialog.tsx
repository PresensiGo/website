import { $api } from "@/lib/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface UpsertBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: {};
}

const formSchema = z.object({
  name: z
    .string("Nama angkatan tidak boleh kosong!")
    .min(1, "Nama angkatan tidak boleh kosong!"),
});

export const UpsertBatchDialog = ({
  open,
  onOpenChange,
  data,
}: UpsertBatchDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: mutateCreate, isPending: isPendingCreate } = $api.useMutation(
    "post",
    "/api/v1/batches",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Angkatan baru berhasil ditambahkan.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutateCreate({
      body: {
        name: values.name,
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Tambah Angkatan</DialogTitle>
            <DialogDescription>
              Masukkan data berikut untuk menambahkan angkatan baru.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Angkatan</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama angkatan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <DialogClose asChild disabled={isPendingCreate}>
              <Button>Batal</Button>
            </DialogClose>
            <Button
              disabled={isPendingCreate}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {isPendingCreate && <Loader2Icon className="animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
