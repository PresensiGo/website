import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  date: z.date(),
  time: z.string(),
  note: z.string().optional(),
  batchId: z.number(),
  majorId: z.number(),
  classroomId: z.number(),
  subjectId: z.number(),
});

interface UpsertSubjectAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
  data?: {};
}
export const UpsertSubjectAttendanceDialog = ({
  open,
  onOpenChange,
  data,
}: UpsertSubjectAttendanceDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSuccess: isSuccessBatches, data: dataBatches } = $api.useQuery(
    "get",
    "/api/v1/batches"
  );
  const { isSuccess: isSuccessMajors, data: dataMajors } = $api.useQuery(
    "get",
    "/api/v1/majors/batch/{batch_id}",
    { params: { path: { batch_id: form.watch("batchId") } } },
    { enabled: form.watch("batchId") !== undefined }
  );
  const { isSuccess: isSuccessClassrooms, data: dataClassrooms } =
    $api.useQuery(
      "get",
      "/api/v1/classrooms/major/{major_id}",
      {
        params: { path: { major_id: form.watch("majorId") } },
      },
      { enabled: form.watch("majorId") !== undefined }
    );
  const { isSuccess: isSuccessSubjects, data: dataSubjects } = $api.useQuery(
    "get",
    "/api/v1/subjects"
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {};

  return (
    <>
      <Dialog open={false}>
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
              {/* batches */}
              <FormField
                control={form.control}
                name="batchId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Select
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
                                key={"batch-item-" + index}
                                value={String(item.batch.id)}
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

              {/* majors */}
              <FormField
                control={form.control}
                name="majorId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Select
                        disabled={form.watch("batchId") === undefined}
                        value={(value && String(value)) || undefined}
                        onValueChange={(e) => onChange(Number(e))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {isSuccessMajors &&
                            dataMajors &&
                            dataMajors.majors.map((item, index) => (
                              <SelectItem
                                key={"major-item-" + index}
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

              {/* classrooms */}
              <FormField
                control={form.control}
                name="classroomId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Select
                        disabled={form.watch("majorId") === undefined}
                        value={(value && String(value)) || undefined}
                        onValueChange={(e) => onChange(Number(e))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {isSuccessClassrooms &&
                            dataClassrooms &&
                            dataClassrooms.classrooms.map((item, index) => (
                              <SelectItem
                                key={"classroom-item-" + index}
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

              {/* subjects */}
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Select
                        value={(value && String(value)) || undefined}
                        onValueChange={(e) => onChange(Number(e))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Theme" />
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

              {/* date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                    <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        defaultValue="10:30:00"
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Textarea placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button>Batal</Button>
            <Button>
              <Loader2Icon className="animate-spin" />
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
