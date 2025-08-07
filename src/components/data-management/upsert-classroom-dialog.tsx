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
    .string("Nama kelas tidak boleh kosong!")
    .min(1, "Nama kelas tidak boleh kosong!"),
});

interface UpsertClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  batchId: number;
  majorId: number;
  data?: {
    id: number;
    name: string;
  };
}

export const UpsertClassroomDialog = ({
  open,
  onOpenChange,
  batchId,
  majorId,
  data,
}: UpsertClassroomDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data) form.reset({ name: data.name });
  }, [data]);

  const { mutate: mutateCreate, isPending: isPendingCreate } = $api.useMutation(
    "post",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Kelas berhasil disimpan.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = $api.useMutation(
    "put",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Perubahan kelas berhasil disimpan.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (data)
      mutateUpdate({
        params: {
          path: {
            batch_id: batchId,
            major_id: majorId,
            classroom_id: data.id,
          },
        },
        body: { name: values.name },
      });
    else
      mutateCreate({
        params: {
          path: {
            batch_id: batchId,
            major_id: majorId,
          },
        },
        body: { name: values.name },
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{data ? "Ubah Kelas" : "Tambah Kelas"}</DialogTitle>
            <DialogDescription>
              Masukkan data kelas pada form berikut untuk menambahkan kelas
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
                    <FormLabel>Nama Kelas</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama kelas" {...field} />
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
