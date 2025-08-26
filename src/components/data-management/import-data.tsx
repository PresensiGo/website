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

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
}

const formSchema = z.object({
  file: z.file("Data tidak boleh kosong!"),
});

export const ImportDataDialog = ({
  open,
  onOpenChange,
}: ImportDataDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = $api.useMutation(
    "post",
    "/api/v1/excel/import-data",
    {
      onSuccess: () => {
        onOpenChange(false, true);
        toast.success("Berhasil!", {
          description: "Data berhasil diimpor ke sistem.",
          position: "top-right",
        });
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({
      body: { file: values.file as any },
      bodySerializer: (body) => {
        const formData = new FormData();
        formData.set("file", body.file);
        return formData;
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Impor Data</DialogTitle>
            <DialogDescription>
              Silahkan masukkan data dalam bentuk file excel ke form berikut
              untuk mengimpor data ke sistem.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>Berkas Data</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            const file = files[0];
                            if (file) {
                              onChange(file);
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <DialogClose asChild disabled={isPending}>
              <Button variant={"outline"}>Batal</Button>
            </DialogClose>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {isPending && <Loader2Icon className="animate-spin" />}
              Impor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
