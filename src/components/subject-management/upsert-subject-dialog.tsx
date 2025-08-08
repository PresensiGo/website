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
    .string("Nama mata pelajaran tidak boleh kosong!")
    .min(1, "Nama mata pelajaran tidak boleh kosong!"),
});

interface UpsertSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: {
    id: number;
    name: string;
  };
}
export const UpsertSubjectDialog = ({
  open,
  onOpenChange,
  data,
}: UpsertSubjectDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data) form.reset({ name: data.name });
  }, [data]);

  const { mutate: mutateCreate, isPending: isPendingCreate } = $api.useMutation(
    "post",
    "/api/v1/subjects",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Mata pelajaran berhasil ditambahkan.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = $api.useMutation(
    "put",
    "/api/v1/subjects/{subject_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Perubahan mata pelajaran berhasil disimpan.",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (data)
      mutateUpdate({
        params: { path: { subject_id: data.id } },
        body: { name: values.name },
      });
    else
      mutateCreate({
        body: { name: values.name },
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {data ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"}
            </DialogTitle>
            <DialogDescription>
              Masukkan nama mata pelajaran pada form berikut untuk{" "}
              {data ? "mengubah" : "menambahkan"} mata pelajaran.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Mata Pelajaran</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama mata pelajaran"
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
            <DialogClose asChild>
              <Button
                disabled={isPendingCreate || isPendingUpdate}
                variant={"outline"}
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              disabled={isPendingCreate || isPendingUpdate}
              onClick={form.handleSubmit(onSubmit)}
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
