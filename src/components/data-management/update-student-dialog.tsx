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
import { useEffect } from "react";
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

export interface UpdateStudentDialogDataProps {
  batchId: number;
  majorId: number;
  classroomId: number;
  studentId: number;
  studentNIS: string;
  studentName: string;
  studentGender: string;
}

interface UpdateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: UpdateStudentDialogDataProps;
}

const formSchema = z.object({
  nis: z
    .string("NIS siswa tidak boleh kosong!")
    .min(1, "NIS siswa tidak boleh kosong!"),
  name: z
    .string("Nama siswa tidak boleh kosong!")
    .min(1, "Nama siswa tidak boleh kosong!"),
  gender: z
    .string("Jenis kelamin siswa tidak boleh kosong!")
    .min(1, "Jenis kelamin siswa tidak boleh kosong!"),
});

export const UpdateStudentDialog = ({
  open,
  onOpenChange,
  data,
}: UpdateStudentDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (data)
      form.reset({
        nis: data.studentNIS,
        name: data.studentName,
        gender: data.studentGender,
      });
  }, [data]);

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = $api.useMutation(
    "put",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/students/{student_id}",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Perubahan data angkatan berhasil disimpan.",
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
            batch_id: data.batchId,
            major_id: data.majorId,
            classroom_id: data.classroomId,
            student_id: data.studentId,
          },
        },
        body: {
          nis: values.nis,
          name: values.name,
          gender: values.gender,
        },
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ubah Data Siswa</DialogTitle>
            <DialogDescription>
              Masukkan beberapa data berikut untuk mengubah data siswa.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Induk Siswa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nomor induk siswa"
                        {...field}
                      />
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
                    <FormLabel>Nama Siswa</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama siswa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <FormControl>
                      <Select value={value} onValueChange={(e) => onChange(e)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <DialogClose asChild disabled={isPendingUpdate}>
              <Button variant={"outline"}>Batal</Button>
            </DialogClose>
            <Button
              disabled={isPendingUpdate}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isPendingUpdate && <Loader2Icon className="animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
