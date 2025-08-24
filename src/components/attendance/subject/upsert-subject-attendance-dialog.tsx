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
import { Input } from "@/components/ui/input";
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
  subjectId: z.number(),
  date: z.date(),
  time: z.string(),
});

interface UpsertSubjectAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  params: {
    batchId: number;
    majorId: number;
    classroomId: number;
  };
  data?: {};
}

export const UpsertSubjectAttendanceDialog = ({
  open,
  onOpenChange,
  params,
  data,
}: UpsertSubjectAttendanceDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSuccess: isSuccessSubjects, data: dataSubjects } = $api.useQuery(
    "get",
    "/api/v1/subjects",
  );
  const { mutate: mutateCreate, isPending: isPendingCreate } = $api.useMutation(
    "post",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms/{classroom_id}/subject-attendances",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Presensi mata pelajaran berhasil ditambahkan!",
          position: "top-right",
        });
        onOpenChange(false, true);
      },
    },
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const date = format(values.date, "yyyy-MM-dd");
    const time = values.time;
    const datetime = `${date} ${time}`;

    if (data) {
    } else
      mutateCreate({
        params: {
          path: {
            batch_id: params.batchId,
            major_id: params.majorId,
            classroom_id: params.classroomId,
          },
        },
        body: {
          datetime,
          note: "",
          subject_id: values.subjectId,
        },
      });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Tambah Presensi Mata Pelajaran</DialogTitle>
            <DialogDescription>
              Masukkan beberapa informasi berikut untuk menambahkan presensi
              mata pelajaran baru.
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
                                value={String(item.id)}
                                key={"subject-item-" + index}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
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
                              <span>Pilih tanggal</span>
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
            <DialogClose asChild disabled={isPendingCreate}>
              <Button variant={"outline"}>Batal</Button>
            </DialogClose>
            <Button
              disabled={isPendingCreate}
              onClick={form.handleSubmit(onSubmit)}
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
