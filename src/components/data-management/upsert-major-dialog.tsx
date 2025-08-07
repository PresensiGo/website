import {
  Dialog,
  DialogClose,
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z
    .string("Nama jurusan tidak boleh kosong!")
    .min(1, "Nama jurusan tidak boleh kosong!"),
});

interface UpsertMajorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  batchId: number;
  data?: {
    id: number;
    name: string;
  };
}

export const UpsertMajorDialog = ({
  open,
  onOpenChange,
  batchId,
  data,
}: UpsertMajorDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data) form.reset({ name: data.name });
  }, [data]);

  const { mutate: mutateCreate, isPending: isPendingCreate } = $api.useMutation(
    "post",
    "/api/v1/majors",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Jurusan berhasil disimpan.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = $api.useMutation(
    "put",
    "/api/v1/majors/{major_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Perubahan jurusan berhasil disimpan.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (data)
      mutateUpdate({
        params: { path: { major_id: data.id } },
        body: { batch_id: batchId, name: values.name },
      });
    else mutateCreate({ body: { batch_id: batchId, name: values.name } });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {data ? "Ubah Jurusan" : "Tambah Jurusan"}
            </DialogTitle>
            <DialogDescription>
              Masukkan data jurusan pada form berikut untuk menambahkan jurusan
              baru.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Jurusan</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama jurusan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <DialogClose asChild disabled={isPendingCreate || isPendingUpdate}>
              <Button variant={"outline"}>Batal</Button>
            </DialogClose>
            <Button
              disabled={isPendingCreate || isPendingUpdate}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {(isPendingCreate || isPendingUpdate) && (
                <Loader2Icon className="animate-spin" />
              )}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
