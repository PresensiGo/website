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
import { $api, handleError } from "@/lib/api/api";
import { auth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_auth/auth/login/")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email("Alamat email tidak valid!"),
  password: z.string("Kata sandi tidak boleh kosong!"),
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = $api.useMutation("post", "/api/v1/auth/login", {
    onSuccess: (data) => {
      auth.set({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      navigate({ to: "/", replace: true });
    },
    onError: handleError,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({
      body: {
        ...values,
      },
    });
  };

  return (
    <>
      <div className="container max-w-lg mx-auto py-6 px-4">
        <div className="space-y-2">
          <p className="text-3xl font-semibold">Masuk</p>
          <p className="text-muted-foreground">
            Silahkan masuk untuk dapat mengakses semua fitur, mengelola semua
            data penting, dan mengelola presensi.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kata sandi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                disabled={isPending}
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                {isPending && <Loader2Icon className="animate-spin" />}
                Masuk
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
