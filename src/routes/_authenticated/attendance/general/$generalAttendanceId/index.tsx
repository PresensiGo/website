import {
  FilterStudentDialog,
  FilterStudentDialogSchema,
  WithSkeleton,
} from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { $api } from "@/lib/api/api";
import type { components } from "@/lib/api/v1";
import { checkIsAfter } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Edit2Icon, FilterIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import ReactQRCode from "react-qr-code";
import z from "zod";

export const Route = createFileRoute(
  "/_authenticated/attendance/general/$generalAttendanceId/"
)({
  component: RouteComponent,
  validateSearch: FilterStudentDialogSchema.and(
    z.object({
      section: z.string().default("qr-code"),
    })
  ),
});

function RouteComponent() {
  const { generalAttendanceId } = Route.useParams();
  const { batch, major, classroom, section } = Route.useSearch();

  const navigate = useNavigate({ from: Route.fullPath });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { isSuccess, data } = $api.useQuery(
    "get",
    "/api/v1/general-attendances/{general_attendance_id}",
    {
      params: { path: { general_attendance_id: Number(generalAttendanceId) } },
    }
  );
  const {
    isLoading: isLoadingRecords,
    isSuccess: isSuccessRecords,
    data: dataRecords,
  } = $api.useQuery(
    "get",
    "/api/v1/general-attendances/{general_attendance_id}/classrooms/{classroom_id}/records",
    {
      params: {
        path: {
          general_attendance_id: Number(generalAttendanceId),
          classroom_id: classroom ?? 0,
        },
      },
    },
    {
      enabled: !!classroom,
    }
  );

  return (
    <>
      <div className="py-6">
        <p className="text-3xl font-semibold">Presensi Kehadiran</p>

        <Tabs
          value={section}
          className="mt-4"
          onValueChange={(e) =>
            navigate({ search: { batch, major, classroom, section: e } })
          }
        >
          <div className="flex items-center gap-1">
            <TabsList>
              <TabsTrigger value="qr-code">QR Code</TabsTrigger>
              <TabsTrigger value="students">Daftar Siswa</TabsTrigger>
            </TabsList>
            {section === "students" && (
              <Button variant={"outline"} onClick={() => setIsFilterOpen(true)}>
                <FilterIcon />
                Filter Data Siswa
              </Button>
            )}
          </div>
          <TabsContent value="qr-code">
            {isSuccess && data && (
              <>
                <div className="space-y-6 text-center py-6">
                  <div>
                    <p className="text-xl font-medium">
                      <FormattedDate
                        value={data.general_attendance.datetime}
                        weekday="long"
                        day="numeric"
                        month="long"
                        year="numeric"
                      />
                    </p>
                    <p className="text-lg text-muted-foreground">
                      <FormattedTime value={data.general_attendance.datetime} />
                    </p>
                  </div>

                  <ReactQRCode
                    value={JSON.stringify({
                      type: "general",
                      code: data.general_attendance.code,
                    })}
                    className="w-full h-84"
                  />

                  <p className="text-muted-foreground text-sm">
                    {data.general_attendance.code}
                  </p>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="students">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="px-4">Nomor Induk Siswa</TableHead>
                    <TableHead className="px-4">Nama Siswa</TableHead>
                    <TableHead className="px-4">Tanggal</TableHead>
                    <TableHead className="px-4">Waktu</TableHead>
                    <TableHead className="px-4">Status</TableHead>
                    <TableHead className="px-4 w-1">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* initial state */}
                  {(!batch || !major || !classroom) && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-4"
                      >
                        Silahkan pilih angkatan, jurusan, dan kelas terlebih
                        dahulu menggunakan tombol filter data siswa di kiri
                        atas.
                      </TableCell>
                    </TableRow>
                  )}

                  {/* loading state */}
                  {isLoadingRecords &&
                    Array.from({ length: 3 }).map((_, index) => (
                      <Item key={"student-loading-" + index} isLoading />
                    ))}

                  {/* empty state */}
                  {isSuccessRecords &&
                    dataRecords &&
                    dataRecords.items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-muted-foreground text-center py-4"
                        >
                          Tidak ada data siswa yang tersedia.
                        </TableCell>
                      </TableRow>
                    )}

                  {/* success state */}
                  {isSuccessRecords &&
                    dataRecords &&
                    dataRecords.items.map((item, index) => (
                      <Item
                        key={"student-item-" + index}
                        data={item}
                        generalAttendanceDateTime={
                          data?.general_attendance.datetime
                        }
                      />
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* dialogs */}
      <FilterStudentDialog
        open={isFilterOpen}
        onOpenChange={(open, data) => {
          setIsFilterOpen(open);
          if (data) {
            navigate({
              search: {
                batch: data.batchId,
                major: data.majorId,
                classroom: data.classroomId,
                section,
              },
            });
          }
        }}
        data={{ batchId: batch, majorId: major, classroomId: classroom }}
      />
    </>
  );
}

interface ItemProps {
  isLoading?: boolean;
  generalAttendanceDateTime?: string;
  data?: components["schemas"]["GetAllGeneralAttendanceRecordsByClassroomIdItem"];
}
const Item = ({ isLoading, generalAttendanceDateTime, data }: ItemProps) => {
  const isAttended = (data?.record.id ?? 0) > 0;

  let isLate = false;
  if (data && generalAttendanceDateTime) {
    isLate = checkIsAfter(data.record.date_time, generalAttendanceDateTime);
  }

  return (
    <>
      <TableRow>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.student.nis ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {data?.student.name ?? "loading"}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {isAttended ? (
              <FormattedDate
                value={data?.record.date_time}
                weekday="long"
                day="numeric"
                month="long"
                year="numeric"
              />
            ) : (
              "-"
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {isAttended ? (
              <FormattedTime value={data?.record.date_time} />
            ) : (
              "-"
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4">
          <WithSkeleton isLoading={isLoading}>
            {isAttended ? (
              <Badge variant={"outline"}>
                {(data?.record.status &&
                  (data.record.status === "hadir"
                    ? isLate
                      ? "hadir terlambat"
                      : "hadir"
                    : data.record.status)) ||
                  "loading"}
              </Badge>
            ) : (
              <Badge variant={"destructive"}>tidak hadir</Badge>
            )}
          </WithSkeleton>
        </TableCell>
        <TableCell className="px-4 flex gap-1">
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button variant={"outline"} size={"icon"}>
              <Edit2Icon />
            </Button>
          </WithSkeleton>
          <WithSkeleton isLoading={isLoading} className="w-fit">
            <Button variant={"destructive"} size={"icon"}>
              <TrashIcon />
            </Button>
          </WithSkeleton>
        </TableCell>
      </TableRow>
    </>
  );
};
