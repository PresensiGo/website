import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/auth/register")({
  component: Page,
});

function Page() {
  return (
    <>
      <p>ini halaman register</p>
    </>
  );
}
