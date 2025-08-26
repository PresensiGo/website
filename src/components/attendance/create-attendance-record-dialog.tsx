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

const formSchema = z.object({
  status: z.enum(
    ["present-on-time", "present-late", "sick", "permission", "alpha"],
    "Status presensi tidak valid!"
  ),
});

export interface CreateSubjectAttendanceRecordDialogDataProps {
  type: "subject" | "general";

  batchId: number;
  majorId: number;
  classroomId: number;
  attendanceId: number;
  studentId: number;
  studentNIS: string;
  studentName: string;
}

export interface CreateGeneralAttendanceRecordDialogDataProps {
  type: "subject" | "general";

  attendanceId: number;
  studentId: number;
  studentNIS: string;
  studentName: string;
}

interface CreateAttendanceRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?:
    | CreateSubjectAttendanceRecordDialogDataProps
    | CreateGeneralAttendanceRecordDialogDataProps;
}
export const CreateAttendanceRecordDialog = ({
  open,
  onOpenChange,
  data,
}: CreateAttendanceRecordDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate: mutateSubject, isPending: isPendingSubject } =
    $api.useMutation(
      "post",
      "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/{subject_attendance_id}/records",
      {
        onSuccess: () => {
          form.reset({ status: undefined });
          onOpenChange(false, true);
          toast.success("Berhasil!", {
            description: "Status presensi siswa berhasil disimpan!",
            position: "top-right",
          });
        },
      }
    );
  const { mutate: mutateGeneral, isPending: isPendingGeneral } =
    $api.useMutation(
      "post",
      "/api/v1/general-attendances/{general_attendance_id}/records",
      {
        onSuccess: () => {
          form.reset({ status: undefined });
          onOpenChange(false, true);
          toast.success("Berhasil!", {
            description: "Status presensi siswa berhasil disimpan!",
            position: "top-right",
          });
        },
      }
    );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (data) {
      if (data.type === "subject") {
        const { batchId, majorId, classroomId } =
          data as CreateSubjectAttendanceRecordDialogDataProps;
        mutateSubject({
          body: {
            student_id: data.studentId,
            status: values.status,
          },
          params: {
            path: {
              batch_id: batchId,
              major_id: majorId,
              classroom_id: classroomId,
              subject_attendance_id: data.attendanceId,
            },
          },
        });
      } else {
        mutateGeneral({
          params: {
            path: {
              general_attendance_id: data.attendanceId,
            },
          },
          body: {
            student_id: data.studentId,
            status: values.status,
          },
        });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ubah Status Presensi</DialogTitle>
            <DialogDescription>
              Masukkan status presensi untuk siswa{" "}
              <span className="font-medium text-foreground">
                {data?.studentName}
              </span>{" "}
              dengan NIS{" "}
              <span className="font-medium text-foreground">
                {data?.studentNIS}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <FormField
                control={form.control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Status Presensi</FormLabel>
                    <FormControl>
                      <Select value={value} onValueChange={(e) => onChange(e)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih status presensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present-on-time">
                            Hadir tepat waktu
                          </SelectItem>
                          <SelectItem value="present-late">
                            Hadir sesuai waktu saat ini
                          </SelectItem>
                          <SelectItem value="sick">Sakit</SelectItem>
                          <SelectItem value="permission">Izin</SelectItem>
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
            <DialogClose
              asChild
              disabled={isPendingSubject || isPendingGeneral}
            >
              <Button variant={"outline"}>Batal</Button>
            </DialogClose>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPendingSubject || isPendingGeneral}
            >
              {(isPendingSubject || isPendingGeneral) && (
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
