import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $api } from "@/lib/api/api";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormattedDate } from "react-intl";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  subjectId: z
    .number("Mata pelajaran tidak boleh kosong!")
    .min(1, "Mata pelajaran tidak boleh kosong!"),
  startDate: z.date("Tanggal awal tidak boleh kosong!"),
  endDate: z.date("Tanggal akhir tidak boleh kosong!"),
});

export interface ExportSubjectAttendanceRecapDialogDataProps {
  batchId: number;
  majorId: number;
  classroomId: number;
}

interface ExportSubjectAttendanceRecapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ExportSubjectAttendanceRecapDialogDataProps;
}
export const ExportSubjectAttendanceRecapDialog = ({
  open,
  onOpenChange,
  data,
}: ExportSubjectAttendanceRecapDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const {
    isLoading: isLoadingSubjects,
    isSuccess: isSuccessSubjects,
    data: dataSubjects,
  } = $api.useQuery("get", "/api/v1/subjects");
  const { mutate, isPending } = $api.useMutation(
    "post",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances/export",
    {
      onSuccess: (data) => {
        const { file, file_name } = data;

        const byteCharacters = atob(file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file_name || "Rekap Presensi Mata Pelajaran.xlsx";
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

        onOpenChange(false);
        toast.success("Berhasil!", {
          description: "Rekap presensi mata pelajaran berhasil diunduh.",
          position: "top-right",
        });
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (data)
      mutate({
        params: {
          path: {
            batch_id: data.batchId,
            major_id: data.majorId,
            classroom_id: data.classroomId,
          },
        },
        body: {
          subject_id: values.subjectId,
          start_date: format(values.startDate, "yyyy-MM-dd"),
          end_date: format(values.endDate, "yyyy-MM-dd"),
        },
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ekspor Rekap Presensi Mata Pelajaran</DialogTitle>
            <DialogDescription>
              Silahkan pilih mata pelajaran dan bulan yang akan diekspor ke
              dalam file excel.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Mata Pelajaran</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoadingSubjects}
                        value={(value && String(value)) || undefined}
                        onValueChange={(e) => onChange(Number(e))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih mata pelajaran" />
                        </SelectTrigger>
                        <SelectContent>
                          {isSuccessSubjects &&
                            dataSubjects &&
                            dataSubjects.subjects.map((item, index) => (
                              <SelectItem
                                key={"subject-item-" + index}
                                value={String(item.id)}
                              >
                                {item.name}
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
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Awal</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              <FormattedDate
                                value={field.value}
                                weekday="long"
                                day="numeric"
                                month="long"
                                year="numeric"
                              />
                            ) : (
                              <span>Pilih tanggal awal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Akhir</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              <FormattedDate
                                value={field.value}
                                weekday="long"
                                day="numeric"
                                month="long"
                                year="numeric"
                              />
                            ) : (
                              <span>Pilih tanggal akhir</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
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
              Ekspor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
