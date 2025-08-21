import { FilterDialog, WithSkeleton } from "@/components";
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
import { createFileRoute } from "@tanstack/react-router";
import { isBefore } from "date-fns";
import { Edit2Icon, FilterIcon, TrashIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import ReactQRCode from "react-qr-code";

export const Route = createFileRoute(
  "/_authenticated/attendance/general/$generalAttendanceId/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { generalAttendanceId } = Route.useParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<{
    batchId: number;
    majorId: number;
    classroomId: number;
  }>();
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
          classroom_id: filter?.classroomId ?? 0,
        },
      },
    },
    {
      enabled: !!filter,
    }
  );

  const isEarly = useCallback(
    (date: string) => {
      if (data) return isBefore(date, data.general_attendance.datetime);
      return false;
    },
    [data]
  );

  return (
    <>
      <div className="py-6">
        <p className="text-3xl font-semibold">Presensi Kehadiran</p>

        <Tabs
          defaultValue="qr-code"
          className="mt-4"
          onValueChange={(e) => setIsFilterVisible(e === "students")}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="qr-code">QR Code</TabsTrigger>
              <TabsTrigger value="students">Daftar Siswa</TabsTrigger>
            </TabsList>
            {isFilterVisible && (
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
                  {/* loading state */}
                  {(isLoadingRecords || !filter) &&
                    Array.from({ length: 3 }).map((_, index) => (
                      <Item key={"student-loading-" + index} isLoading />
                    ))}

                  {/* success state */}
                  {isSuccessRecords &&
                    dataRecords &&
                    dataRecords.items.map((item, index) => (
                      <Item key={"student-item-" + index} data={item} />
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* dialogs */}
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={(open, data) => {
          setIsFilterOpen(open);
          if (data) {
            setFilter(data);
          }
        }}
        data={filter}
      />
    </>
  );
}

interface ItemProps {
  isLoading?: boolean;
  data?: components["schemas"]["GetAllGeneralAttendanceRecordsByClassroomIdItem"];
}
const Item = ({ isLoading, data }: ItemProps) => {
  const isAttended = (data?.record.id ?? 0) > 0;

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
              <FormattedDate value={data?.record.date_time} />
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
                data?.record.status ?? "loading"
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
