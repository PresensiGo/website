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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $api } from "@/lib/api/api";
import { useEffect, useState } from "react";
import z from "zod";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export const FilterStudentDialogSchema = z.object({
  batch: z.number().optional(),
  major: z.number().optional(),
  classroom: z.number().optional(),
});

interface FilterStudentDialogProps {
  open: boolean;
  onOpenChange: (
    open: boolean,
    data?: { batchId: number; majorId: number; classroomId: number },
  ) => void;
  data: {
    batchId?: number;
    majorId?: number;
    classroomId?: number;
  };
}
export const FilterStudentDialog = ({
  open,
  onOpenChange,
  data,
}: FilterStudentDialogProps) => {
  const [selectedBatch, setSelectedBatch] = useState<number>();
  const [selectedMajor, setSelectedMajor] = useState<number>();
  const [selectedClassroom, setSelectedClassroom] = useState<number>();

  useEffect(() => {
    if (data) {
      setSelectedBatch(data.batchId);
      setSelectedMajor(data.majorId);
      setSelectedClassroom(data.classroomId);
    }
  }, [data]);

  const {
    isLoading: isLoadingBatch,
    isSuccess: isSuccessBatch,
    data: dataBatch,
  } = $api.useQuery("get", "/api/v1/batches");
  const {
    isLoading: isLoadingMajors,
    isSuccess: isSuccessMajors,
    data: dataMajors,
  } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors",
    {
      params: {
        path: {
          batch_id: selectedBatch ?? 0,
        },
      },
    },
    { enabled: !!selectedBatch },
  );
  const {
    isLoading: isLoadingClassrooms,
    isSuccess: isSuccessClassrooms,
    data: dataClassrooms,
  } = $api.useQuery(
    "get",
    "/api/v1/batches/{batch_id}/majors/{major_id}/classrooms",
    {
      params: {
        path: {
          batch_id: selectedBatch ?? 0,
          major_id: selectedMajor ?? 0,
        },
      },
    },
    { enabled: !!selectedBatch && !!selectedMajor },
  );

  return (
    <>
      <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Filter Data Siswa</DialogTitle>
            <DialogDescription>
              Silahkan pilih filter yang ingin diterapkan untuk menampilkan data
              siswa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Angkatan</Label>
              <Select
                disabled={isLoadingBatch}
                value={(selectedBatch && String(selectedBatch)) || undefined}
                onValueChange={(e) => setSelectedBatch(Number(e))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih angkatan" />
                </SelectTrigger>
                <SelectContent>
                  {isSuccessBatch &&
                    dataBatch &&
                    dataBatch.items.map((item, index) => (
                      <SelectItem
                        key={"batch-item-" + index}
                        value={String(item.batch.id)}
                      >
                        {item.batch.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Jurusan</Label>
              <Select
                disabled={isLoadingMajors || !selectedBatch}
                value={(selectedMajor && String(selectedMajor)) || undefined}
                onValueChange={(e) => {
                  setSelectedClassroom(undefined);
                  setSelectedMajor(Number(e));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jurusan" />
                </SelectTrigger>
                <SelectContent>
                  {isSuccessMajors &&
                    dataMajors &&
                    dataMajors.items.map((item, index) => (
                      <SelectItem
                        key={"major-item-" + index}
                        value={String(item.major.id)}
                      >
                        {item.major.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select
                disabled={
                  isLoadingClassrooms || !selectedBatch || !selectedMajor
                }
                value={
                  (selectedClassroom && String(selectedClassroom)) || undefined
                }
                onValueChange={(e) => setSelectedClassroom(Number(e))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {isSuccessClassrooms &&
                    dataClassrooms &&
                    dataClassrooms.items.map((item, index) => (
                      <SelectItem
                        key={"classroom-item-" + index}
                        value={String(item.classroom.id)}
                      >
                        {item.classroom.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Tutup</Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (selectedBatch && selectedMajor && selectedClassroom) {
                  onOpenChange(false, {
                    batchId: selectedBatch,
                    majorId: selectedMajor,
                    classroomId: selectedClassroom,
                  });
                }
              }}
            >
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
