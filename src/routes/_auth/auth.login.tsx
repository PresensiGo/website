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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_auth/auth/login")({
  component: Page,
});

const formSchema = z.object({
  email: z.email("Alamat email tidak valid!"),
  password: z.string("Kata sandi tidak boleh kosong!"),
});

function Page() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "rizal@email.com",
      password: "password",
    },
  });

  const { mutate, isPending } = $api.useMutation("post", "/api/v1/auth/login", {
    onSuccess: (data) => {
      auth.set({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      navigate({ to: "/", replace: true });
    },
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
      <div className="container mx-auto">
        <p>login page</p>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
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
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              Masuk
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
