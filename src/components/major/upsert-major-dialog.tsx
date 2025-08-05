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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $api } from "@/lib/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  batchId: z
    .number("Angkatan tidak boleh kosong!")
    .min(1, "Angkatan tidak boleh kosong!"),
  name: z
    .string("Nama jurusan tidak boleh kosong!")
    .min(1, "Nama jurusan tidak boleh kosong!"),
});

interface UpsertMajorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: {};
}

export const UpsertMajorDialog = ({
  open,
  onOpenChange,
  data,
}: UpsertMajorDialogProps) => {
  const {
    isLoading: isLoadingBatches,
    isSuccess: isSuccessBatches,
    data: dataBatches,
  } = $api.useQuery("get", "/api/v1/batches");

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutateCreate({ body: { batch_id: values.batchId, name: values.name } });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="batchId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Angkatan</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoadingBatches}
                        value={(value && String(value)) || undefined}
                        onValueChange={(e) => onChange(Number(e))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {isSuccessBatches &&
                            dataBatches &&
                            dataBatches.batches.map((item, index) => (
                              <SelectItem
                                value={String(item.batch.id)}
                                key={"batch-item-" + index}
                              >
                                {item.batch.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Jurusan</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
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
