import { WithSkeleton } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { $api } from "@/lib/api/api";
import { auth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const Route = createFileRoute("/_authenticated/school-management/")({
  component: RouteComponent,
  loader: () => {
    if (!auth.isAdmin()) {
      throw redirect({ to: "/" });
    }
  },
});

const formSchema = z.object({
  name: z
    .string("Nama sekolah tidak boleh kosong!")
    .min(1, "Nama sekolah tidak boleh kosong!"),
  code: z
    .string("Kode sekolah tidak boleh kosong!")
    .min(1, "Kode sekolah tidak boleh kosong!"),
});

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isLoading: isLoadingSchool, data: dataSchool } = $api.useQuery(
    "get",
    "/api/v1/schools/profile",
  );
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = $api.useMutation(
    "put",
    "/api/v1/schools/profile",
    {
      onSuccess: () => {
        toast.success("Berhasil!", {
          description: "Perubahan data sekolah berhasil disimpan.",
          position: "top-right",
        });
      },
    },
  );

  useEffect(() => {
    if (dataSchool)
      form.reset({
        ...dataSchool.school,
      });
  }, [dataSchool]);

  const onSubmit = (values: z.infer<typeof formSchema>) =>
    mutateUpdate({
      body: {
        name: values.name,
        code: values.code,
      },
    });

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Manajemen Sekolah</p>
          <p className="text-muted-foreground">
            lorem ipsum dolor sit amet, consectetur
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 max-w-lg"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Sekolah</FormLabel>
                  <FormControl>
                    <WithSkeleton isLoading={isLoadingSchool}>
                      <Input placeholder="Masukkan nama sekolah" {...field} />
                    </WithSkeleton>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Sekolah</FormLabel>
                  <FormControl>
                    <WithSkeleton isLoading={isLoadingSchool}>
                      <Input placeholder="Masukkan kode sekolah" {...field} />
                    </WithSkeleton>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPendingUpdate}
              >
                {isPendingUpdate && <Loader2Icon className="animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
